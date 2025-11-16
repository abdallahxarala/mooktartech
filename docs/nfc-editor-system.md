# Éditeur NFC Enterprise - Documentation complète

## 📋 Vue d'ensemble

Éditeur NFC de niveau SaaS enterprise avec wizard gamifié, preview 3D, analytics avancés, gestion d'équipe, capture de leads, et architecture multi-tenant.

## 🏗️ Architecture

### Stack technique

- **Frontend** : Next.js 14 + Framer Motion
- **State** : Zustand (global) + persist middleware
- **Preview** : CSS 3D transforms + Framer Motion animations
- **QR Code** : qrcode library
- **Charts** : Recharts
- **Export** : vCard format

### Fichiers principaux

```
lib/store/nfc-editor-store.ts          → Store global Zustand
components/nfc-wizard/
  ├─ wizard.tsx                        → Wizard principal 6 étapes
  ├─ gamified-progress.tsx             → Progress bar animée
  ├─ card-preview-3d.tsx               → Preview 3D temps réel
  ├─ social-links-step.tsx             → Gestion réseaux sociaux
  ├─ custom-fields-step.tsx            → Champs personnalisés
  ├─ export-step.tsx                   → Export & QR Code
  ├─ analytics-dashboard.tsx           → Dashboard analytics
  ├─ lead-capture-form.tsx             → Capture de leads
  ├─ export-options.tsx                → Options d'export
  └─ team-management.tsx               → Gestion équipe
```

## 🎯 Fonctionnalités

### 1. Wizard gamifié (6 étapes)

#### Étape 1 : Mode
- Choix Personnel / Entreprise
- Interface différenciée par type

#### Étape 2 : Informations
- Prénom, nom
- Titre / poste
- Entreprise
- Tagline

#### Étape 3 : Contact
- Email
- Téléphone
- Site web
- Localisation

#### Étape 4 : Liens sociaux
- 9 plateformes : LinkedIn, Twitter, Instagram, Facebook, YouTube, GitHub, WhatsApp, Site Web, Email
- Interface drag & drop (prévu)
- Validation des URLs
- Icônes colorées par plateforme

#### Étape 5 : Design + Personnalisation
- 6 thèmes : Sunset, Ocean, Forest, Midnight, Royal, Dawn, Custom
- Couleurs primaires/secondaires
- Champs personnalisés illimités
- 4 types : Texte, Lien, Email, Téléphone
- 5 icônes : Briefcase, Map Pin, Calendar, Hash, Edit

#### Étape 6 : Export & Publication
- Génération QR Code
- Téléchargement vCard
- Partage via API native
- Copie de lien
- Options : QR Code, Analytics, NFC

### 2. Gamification

- **Progress bar animée** avec sparkles
- **4 milestones** :
  - 25% : Bon départ 🚀
  - 50% : Continue 💪
  - 75% : Presque là 🔥
  - 100% : Parfait ✨
- **Célébration** à l'achèvement
- **Bonus points** pour champs remplis

### 3. Preview 3D temps réel

- **Split layout** : Wizard / Preview
- **Animations** Framer Motion :
  - RotateY 3D transforms
  - Hover scale effects
  - Sparkles animés
- **Thèmes dynamiques** : Gradient backgrounds
- **Badge NFC** animé avec pulse
- **Statistiques** en temps réel : vues, saves, shares

### 4. Analytics avancés

- **4 KPIs** :
  - Total vues
  - Enregistrements
  - Partages
  - Taux de conversion
- **Vues par source** :
  - NFC
  - QR Code
  - Lien direct
- **Timeline 7 jours** : Graphique barres
- **Top locations** géographiques
- **Conversion rate** auto-calculé

### 5. Lead capture

- **Formulaire optimisé** :
  - Nom complet
  - Email
  - Téléphone
  - Entreprise
  - Message/notes
- **Validation** en temps réel
- **Feedback** success animation
- **Intégration** automatique avec store
- **Source tracking** : NFC / QR / Link

### 6. Export multi-format

- **QR Code** :
  - Génération haute qualité (niveau H)
  - Téléchargement PNG/SVG
  - Logo au centre (prévu)
- **vCard** :
  - Format standard
  - Compatible tous appareils
  - Automatique toutes les infos
- **Apple Wallet** (prévu)
- **Partage API native** : Web Share API
- **Copie lien** avec feedback

### 7. Gestion d'équipe (multi-tenant)

- **4 rôles** :
  - Owner (Propriétaire)
  - Admin (Administrateur)
  - Editor (Éditeur)
  - Viewer (Lecteur)
- **Invitations** par email
- **Permissions** granulaires
- **Stats équipe** :
  - Total membres
  - Cartes partagées
  - Activité 7 jours
- **Interface** liste + cards

### 8. Store Zustand

```typescript
interface NFCEditorState {
  currentProfile: NFCProfile | null
  wizardStep: number
  wizardProgress: number
  profiles: NFCProfile[]
  leads: Lead[]
  analytics: Record<string, Analytics>
  
  // Actions
  createProfile(mode: CardMode): void
  updateProfile(updates: Partial<NFCProfile>): void
  publishProfile(): void
  
  // Social
  addSocialLink(link): void
  updateSocialLink(id, updates): void
  deleteSocialLink(id): void
  
  // Custom fields
  addCustomField(field): void
  updateCustomField(id, updates): void
  deleteCustomField(id): void
  
  // Analytics
  trackView(profileId, source): void
  trackSave(profileId): void
  trackShare(profileId): void
}
```

### 9. Persistence

- **LocalStorage** : Zustand persist middleware
- **Partialize** : Seulement profils, leads, analytics
- **Auto-save** : Mise à jour automatique
- **Hydration** : Gestion SSR

## 📊 Types de données

### NFCProfile

```typescript
{
  id: string
  mode: 'personal' | 'business'
  firstName, lastName, title, company
  email, phone, website, location
  socialLinks: SocialLink[]
  customFields: CustomField[]
  theme: ProfileTheme
  primaryColor, secondaryColor
  enableLeadCapture, enableAnalytics
  enableQRCode, enableNFC
  slug: string
  isPublished, isPremium
  views, saves, shares
}
```

### SocialLink

```typescript
{
  id: string
  platform: 'linkedin' | 'twitter' | 'instagram' | ...
  url: string
  icon: string
  order: number
}
```

### CustomField

```typescript
{
  id: string
  label: string
  value: string
  icon: 'briefcase' | 'map-pin' | 'calendar' | 'hash' | 'edit'
  type: 'text' | 'url' | 'email' | 'phone'
  order: number
}
```

## 🎨 Thèmes disponibles

| Thème | Couleurs | Usage |
|-------|----------|-------|
| Sunset | Orange → Pink | Personnel chaleureux |
| Ocean | Blue → Cyan | Professionnel marin |
| Forest | Green → Teal | Nature/Durabilité |
| Midnight | Indigo → Purple | Élégant/intello |
| Royal | Purple → Pink | Premium/luxe |
| Dawn | Amber → Pink | Énergique/dynamique |
| Custom | Perso | Personnalisation totale |

## 🚀 Utilisation

### Créer une carte

```typescript
import { useNFCEditorStore } from '@/lib/store/nfc-editor-store'

const { createProfile } = useNFCEditorStore()

// Créer une carte personnelle
createProfile('personal')

// Créer une carte business
createProfile('business')
```

### Ajouter un lien social

```typescript
const { addSocialLink } = useNFCEditorStore()

addSocialLink({
  platform: 'linkedin',
  url: 'https://linkedin.com/in/username',
  icon: 'linkedin'
})
```

### Track analytics

```typescript
const { trackView, trackSave, trackShare } = useNFCEditorStore()

// Vue depuis QR Code
trackView(profileId, 'qr')

// Save
trackSave(profileId)

// Share
trackShare(profileId)
```

### Exporter vCard

```typescript
const generateVCard = () => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.firstName} ${profile.lastName}
N:${profile.lastName};${profile.firstName};;;
ORG:${profile.company}
TITLE:${profile.title}
TEL:${profile.phone}
EMAIL:${profile.email}
URL:${profile.website}
ADR:;;;;;;${profile.location}
END:VCARD`

  const blob = new Blob([vcard], { type: 'text/vcard' })
  // ... télécharger
}
```

## 🧪 Tests

### Page de test

```
http://localhost:3000/fr/nfc-editor
```

### Scénarios de test

1. **Création complète** :
   - Choisir mode Personnel
   - Remplir toutes les étapes
   - Vérifier progression
   - Publier

2. **Social Links** :
   - Ajouter 3+ réseaux
   - Vérifier preview mise à jour
   - Supprimer un lien

3. **Custom Fields** :
   - Ajouter 2 champs personnalisés
   - Modifier les valeurs
   - Vérifier preview

4. **Export** :
   - Générer QR Code
   - Télécharger vCard
   - Copier le lien

5. **Analytics** :
   - Simuler des vues
   - Vérifier graphiques
   - Vérifier conversion rate

## 📈 Roadmap

- [x] Wizard 6 étapes
- [x] Preview 3D
- [x] Social links management
- [x] Custom fields
- [x] QR Code génération
- [x] vCard export
- [x] Analytics dashboard
- [x] Lead capture
- [x] Team management
- [ ] NFC programming (implémentation réelle)
- [ ] Apple Wallet pass
- [ ] Domaines personnalisés
- [ ] API webhooks
- [ ] Intégrations tierces (CRM)
- [ ] Templates premium
- [ ] A/B testing

## 🔧 Configuration

### Thèmes personnalisés

Pour ajouter un thème :

```typescript
const themes = [
  { id: 'custom', name: 'Mon thème', colors: { primary: '#FF0000', secondary: '#0000FF' } }
]
```

### Plateformes sociales

Pour ajouter une plateforme :

```typescript
const SOCIAL_PLATFORMS = [
  { id: 'custom', name: 'Ma plateforme', icon: CustomIcon, color: 'green', placeholder: 'URL...' }
]
```

## 📚 Références

- [Store Zustand](/lib/store/nfc-editor-store.ts)
- [Wizard](/components/nfc-wizard/wizard.tsx)
- [Preview 3D](/components/nfc-wizard/card-preview-3d.tsx)
- [Social Links](/components/nfc-wizard/social-links-step.tsx)
- [Export](/components/nfc-wizard/export-step.tsx)

## 💡 Tips

- **Progression** : Remplir email et 3+ liens sociaux débloque bonus
- **QR Code** : Génération niveau H pour meilleure lisibilité
- **vCard** : Compatible iPhone, Android, Outlook
- **Analytics** : Tracking automatique dès publication
- **Preview** : Ctrl+F5 pour forcer refresh preview

