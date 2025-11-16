# 🚀 Guide Rapide de Contribution - Xarala Solutions

**Pour nouveaux contributeurs et développeurs rejoignant le projet**

---

## ⚡ Démarrage Rapide (5 minutes)

### 1. Installation

```bash
# Cloner et installer
git clone <repository-url>
cd project
npm install

# Configurer environnement
cp env.example .env.local
# Remplir NEXT_PUBLIC_SUPABASE_URL et clés dans .env.local

# Démarrer
npm run dev
# Ouvrir http://localhost:3000
```

### 2. Structure Clé à Connaître

```
📁 app/[locale]/          → Pages (routes internationalisées)
📁 components/            → Composants React réutilisables
📁 lib/store/             → Stores Zustand (état global)
📁 lib/hooks/             → Hooks personnalisés
📁 lib/types/             → Types TypeScript
📁 supabase/migrations/   → Migrations base de données
📁 docs/                  → Documentation complète
```

---

## 🎯 Fichiers Critiques à Connaître

### Stores (État Global)

| Fichier | Usage | Priorité |
|---------|-------|----------|
| `lib/store/cart-store.ts` | ⭐ **PANIER** - Source de vérité | 🔴 Critique |
| `lib/store/content-store.ts` | Contenu CMS dynamique | 🟡 Important |
| `lib/store/nfc-editor-store.ts` | Éditeur NFC SaaS | 🟡 Important |
| `lib/store/card-designer-store.ts` | Designer cartes | 🟢 Optionnel |

**⚠️ ATTENTION** : Toujours utiliser `cart-store.ts`, jamais `cart.ts` (obsolète)

### Pages Principales

| Route | Fichier | Description |
|-------|---------|-------------|
| `/fr` | `app/[locale]/page.tsx` | Page d'accueil |
| `/fr/products` | `app/[locale]/products/page.tsx` | Catalogue produits |
| `/fr/cart` | `app/[locale]/cart/page.tsx` | Panier |
| `/fr/checkout` | `app/[locale]/checkout/page.tsx` | Commande |
| `/fr/badge-editor/events` | `app/[locale]/badge-editor/events/...` | Gestion événements |

### API Routes

| Route | Fichier | Usage |
|-------|---------|-------|
| `/api/orders` | `app/api/orders/route.ts` | ✅ Création commandes |
| `/api/payment/init` | `app/api/payment/init/route.ts` | Paiements simulés |
| `/api/checkout` | ❌ **N'EXISTE PAS** | À créer si nécessaire |

---

## 🔧 Commandes Essentielles

```bash
# Développement
npm run dev              # Démarrer serveur dev
npm run build            # Build production
npm run start            # Serveur production

# Qualité code
npm run lint             # Vérifier erreurs
npm run lint:fix         # Corriger erreurs
npm run type-check       # Vérifier TypeScript

# Base de données
npm run db:generate      # Générer types depuis Supabase
npm run db:push          # Appliquer migrations
npm run db:reset         # Réinitialiser DB
```

---

## 📋 Checklist Avant de Commencer une Feature

- [ ] Lire `docs/RESUME_GLOBAL_PROJET.md` pour contexte global
- [ ] Vérifier si feature existe déjà dans `/docs`
- [ ] Créer branche : `git checkout -b feature/nom-feature`
- [ ] Vérifier conventions de code (TypeScript strict)
- [ ] Tester sur mobile/tablette/desktop
- [ ] Tester toutes les langues (FR/EN/WO)
- [ ] Vérifier pas d'erreurs console
- [ ] Linter : `npm run lint`
- [ ] Type-check : `npm run type-check`

---

## 🚨 Erreurs Courantes à Éviter

### 1. ❌ Utiliser l'ancien store panier

```typescript
// ❌ MAUVAIS
import { useCart } from '@/lib/store/cart'

// ✅ BON
import { useCartStore } from '@/lib/store/cart-store'
```

### 2. ❌ Oublier les traductions i18n

```typescript
// ❌ MAUVAIS
<h1>Mon Titre</h1>

// ✅ BON
const t = useTranslations()
<h1>{t('myTitle')}</h1>
```

### 3. ❌ Créer types manuels pour tables DB

```typescript
// ❌ MAUVAIS
interface User {
  id: string
  email: string
}

// ✅ BON
import type { Database } from '@/lib/types/supabase'
type User = Database['public']['Tables']['users']['Row']
```

### 4. ❌ Oublier validation formulaires

```typescript
// ❌ MAUVAIS
const handleSubmit = (data) => {
  // Pas de validation
}

// ✅ BON
const schema = z.object({
  email: z.string().email(),
})
const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) })
```

---

## 🎨 Conventions de Code

### Noms de Fichiers

- **Composants** : `PascalCase.tsx` → `MyComponent.tsx`
- **Hooks** : `camelCase.ts` avec préfixe `use` → `useMyHook.ts`
- **Stores** : `camelCase.ts` avec suffixe `-store` → `my-store.ts`
- **Utils** : `camelCase.ts` → `myUtil.ts`
- **Types** : `PascalCase.ts` → `MyType.ts`

### Structure Composant

```typescript
'use client' // Si nécessaire

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations()
  const [state, setState] = useState()

  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### Structure Store Zustand

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MyStore {
  data: string[]
  addData: (item: string) => void
}

export const useMyStore = create<MyStore>()(
  persist(
    (set) => ({
      data: [],
      addData: (item) => set((state) => ({ data: [...state.data, item] })),
    }),
    { name: 'my-store' }
  )
)
```

---

## 🧪 Tests Manuels Essentiels

### Test Panier
1. Ajouter produit → Vérifier apparition
2. Modifier quantité → Vérifier calcul
3. Supprimer → Vérifier disparition
4. Vérifier localStorage persiste

### Test Checkout
1. Remplir formulaire → Validation
2. Sélectionner paiement → Affichage méthode
3. Confirmer → Redirection success
4. Vérifier commande créée

### Test Responsive
1. Mobile (375px) → Menu hamburger
2. Tablette (768px) → Layout adapté
3. Desktop (1920px) → Mega menu

### Test i18n
1. Changer langue → Routes changent
2. Vérifier traductions complètes
3. Vérifier pas de texte hardcodé

---

## 📚 Documentation à Lire

### Pour Comprendre le Projet
1. `docs/RESUME_GLOBAL_PROJET.md` ⭐ **COMMENCER ICI**
2. `docs/PROJET-GLOBAL.md` - Vision macro
3. `docs/PROJECT_SUMMARY.md` - Résumé technique

### Pour Fonctionnalités Spécifiques
- `docs/buyer-creator-system.md` - Authentification
- `docs/nfc-editor-system.md` - SaaS NFC
- `docs/card-editor.md` - Éditeur cartes
- `docs/badge-editor-system.md` - Système badges

### Pour Diagnostics
- `docs/CART_FUSION_DIAGNOSTIC.md` - Problème fusion produits
- `docs/MENU_DIAGNOSIS.md` - Diagnostic menu
- `docs/ROUTES_AUDIT.md` - Audit routes

---

## 🆘 Besoin d'Aide ?

### Problèmes Courants

**Q: Le panier ne persiste pas**  
A: Vérifier que vous utilisez `cart-store.ts` et que localStorage est activé

**Q: Les traductions ne fonctionnent pas**  
A: Vérifier que la clé existe dans `messages/fr.json` et autres langues

**Q: Erreur TypeScript sur types Supabase**  
A: Exécuter `npm run db:generate` pour régénérer les types

**Q: Build échoue**  
A: Vérifier `npm run lint` et `npm run type-check` pour erreurs

### Ressources
- Documentation complète : `/docs`
- README principal : `/README.md`
- Issues GitHub : (si configuré)

---

## ✅ Checklist Avant Pull Request

- [ ] Code fonctionne localement
- [ ] Tests manuels passés
- [ ] `npm run lint` : 0 erreur
- [ ] `npm run type-check` : 0 erreur
- [ ] Responsive testé (mobile/tablette/desktop)
- [ ] i18n testé (FR/EN/WO)
- [ ] Pas d'erreurs console navigateur
- [ ] Documentation mise à jour si nécessaire
- [ ] Commit message descriptif
- [ ] Branche à jour avec `main`

---

## 🎯 Prochaines Étapes Recommandées

1. **Lire** `docs/RESUME_GLOBAL_PROJET.md` en entier
2. **Explorer** le code dans `app/[locale]/` pour comprendre structure
3. **Tester** le flow complet : produits → panier → checkout
4. **Identifier** une petite feature à améliorer
5. **Créer** branche et commencer développement

---

**Bon développement ! 🚀**

*Dernière mise à jour : 2025-01-30*

