# Système d'authentification Buyer/Creator

## 📋 Vue d'ensemble

Système d'authentification à double niveau avec activation progressive basée sur la "valeur maximale". Les utilisateurs peuvent avoir deux rôles : **Acheteur** (Buyer) et **Créateur** (Creator), ou les deux simultanément (compte hybride).

## 🎯 Rôles disponibles

### 1. **Rôle Acheteur (Buyer)**
- **Activation** : Première commande ≥ 50,000 FCFA
- **Fonctionnalités** :
  - Historique des commandes
  - Suivi des livraisons
  - Adresses sauvegardées
  - Produits favoris
  - Points de récompense

### 2. **Rôle Créateur (Creator)**
- **Activation** : 3 designs sauvegardés
- **Fonctionnalités** :
  - Bibliothèque de designs
  - Templates personnels
  - Exports haute qualité
  - Partage public de créations
  - Statistiques détaillées

### 3. **Compte Hybride**
- Possibilité d'avoir les deux rôles simultanément
- Basculer entre les vues Buyer/Creator/Hybride
- Données séparées par profil

## 🏗️ Architecture

### Fichiers principaux

```
lib/types/auth-roles.ts          → Types TypeScript étendus
lib/store/auth.ts                → Store Zustand avec rôles
lib/hooks/use-auth-progressive.ts → Hook d'activation progressive

components/auth/
  ├─ progressive-onboarding.tsx  → Modal d'activation
  ├─ role-switcher.tsx           → Bascule de rôles
  └─ role-badge.tsx              → Badge de rôle

supabase/migrations/
  └─ 20250128000000_buyer_creator_auth.sql → Migration DB
```

### Base de données

**Tables principales** :
- `users` : Utilisateurs avec flags `buyer_role_activated`, `creator_role_activated`
- `buyer_profiles` : Profils acheteurs détaillés
- `creator_profiles` : Profils créateurs détaillés
- `user_activity` : Historique des activités (tracking)
- `buyer_favorites` : Produits favoris
- `buyer_addresses` : Adresses sauvegardées
- `creator_designs` : Designs sauvegardés
- `creator_templates` : Templates personnels

**Fonctions PostgreSQL** :
- `activate_buyer_role(user_uuid)` : Active le rôle Buyer
- `activate_creator_role(user_uuid)` : Active le rôle Creator

## 🚀 Utilisation

### 1. Tracking d'activité

```typescript
import { useAuthProgressive } from '@/lib/hooks/use-auth-progressive'

const { trackActivity } = useAuthProgressive()

// Après une commande
await trackActivity('first_order', { 
  orderTotal: 60000, 
  orderId: 'XAR-123' 
})

// Après création d'un design
await trackActivity('third_design', { 
  designId: 'design-456' 
})
```

### 2. Vérification de progression

```typescript
const { 
  buyerProgress, 
  creatorProgress,
  checkBuyerProgression,
  checkCreatorProgression 
} = useAuthProgressive()

// Vérifier la progression Buyer
const progress = await checkBuyerProgression()
// { role: 'buyer', progress: 75, threshold: 50000, currentValue: 37500 }

// Vérifier la progression Creator
const progress = await checkCreatorProgression()
// { role: 'creator', progress: 67, threshold: 3, currentValue: 2 }
```

### 3. Activation manuelle

```typescript
const { 
  activateBuyerRole, 
  activateCreatorRole 
} = useAuthProgressive()

// Activer le rôle Buyer
await activateBuyerRole()

// Activer le rôle Creator
await activateCreatorRole()
```

### 4. Composants UI

#### Modal d'activation

```tsx
import { ProgressiveOnboarding } from '@/components/auth/progressive-onboarding'

<ProgressiveOnboarding
  role="buyer"
  progress={buyerProgress}
  onComplete={() => console.log('Activated!')}
  onSkip={() => setShowModal(false)}
/>
```

#### Indicateur de progression

```tsx
import { ProgressIndicator } from '@/components/auth/progressive-onboarding'

<ProgressIndicator
  role="creator"
  progress={creatorProgress}
  onActivate={async () => await activateCreatorRole()}
/>
```

#### Bascule de rôle

```tsx
import { RoleSwitcher } from '@/components/auth/role-switcher'

<RoleSwitcher
  activeRole="buyer"
  onRoleChange={(role) => console.log('Switched to:', role)}
/>
```

## 🧪 Page de test

Une page de test complète est disponible :

```bash
http://localhost:3000/fr/test-auth
```

**Fonctionnalités de test** :
- Connexion/déconnexion simulée
- Simulation d'activation Buyer (commande 60k FCFA)
- Simulation d'activation Creator (3 designs)
- Affichage de la progression en temps réel
- Persistence des données

## 📊 Seuils configurés

Par défaut dans `lib/types/auth-roles.ts` :

```typescript
export const DEFAULT_THRESHOLDS: ProgressiveActivationThresholds = {
  buyer: {
    minOrderAmount: 50000, // 50,000 FCFA
    requiredOrders: 1,
  },
  creator: {
    minDesigns: 3,
    minExports: 1,
    alternativeTrigger: 'template_shared',
  },
};
```

## 🔒 Sécurité

- **RLS (Row Level Security)** activé sur toutes les tables
- Policies PostgreSQL pour isolation des données
- Chaque utilisateur ne peut accéder qu'à ses propres profils
- Activation automatique vérifiée par la base de données

## 🎨 Intégration dans l'app

### Checkout

```typescript
// Dans app/[locale]/checkout/page.tsx
import { useAuthProgressive } from '@/lib/hooks/use-auth-progressive'

const { trackActivity } = useAuthProgressive()

const handleOrderSubmit = async (orderData) => {
  // ... créer la commande
  
  // Track activity si seuil atteint
  if (orderData.total >= 50000) {
    await trackActivity('order_above_threshold', {
      orderTotal: orderData.total,
      orderId: order.id
    })
  }
}
```

### Card Editor

```typescript
// Dans app/[locale]/card-editor/page.tsx
const handleSaveDesign = async () => {
  // ... sauvegarder le design
  
  // Vérifier le nombre de designs
  const { count } = await supabase
    .from('creator_designs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
  
  if (count === 3) {
    await trackActivity('third_design', { designId: design.id })
  }
}
```

## 📝 TODO / Améliorations futures

- [ ] Dashboard séparé par rôle
- [ ] Notifications push pour seuils atteints
- [ ] Statistiques avancées par profil
- [ ] Export de données utilisateur
- [ ] API publique pour intégrations tierces
- [ ] Webhooks sur activation de rôle

## 🐛 Debug

Pour vérifier l'état des rôles :

```typescript
const { user, isBuyer, isCreator } = useAuthStore()

console.log('User roles:', {
  buyer: isBuyer,
  creator: isCreator,
  activatedAt: {
    buyer: user?.buyer_activated_at,
    creator: user?.creator_activated_at
  }
})
```

## 📚 Références

- [Types TypeScript](/lib/types/auth-roles.ts)
- [Store Zustand](/lib/store/auth.ts)
- [Hook progressif](/lib/hooks/use-auth-progressive.ts)
- [Migration DB](/supabase/migrations/20250128000000_buyer_creator_auth.sql)

