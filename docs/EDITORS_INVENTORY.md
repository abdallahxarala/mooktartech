# Inventaire des Éditeurs - Xarala Solutions

**Date** : 1er février 2025  
**Statut** : ✅ Analyse complète

---

## 📋 Vue d'ensemble

Le projet Xarala Solutions contient **4 éditeurs distincts** pour différents cas d'usage. Tous sont fonctionnels et ont été récemment corrigés.

---

## 🎨 Éditeur 1 : Card Editor (Landing Page Personnelle)

### **Route actuelle**
- URL : `/fr/card-editor`
- Locale : Support i18n (fr, en)

### **Fichiers principaux**
```
app/[locale]/card-editor/
├── page.tsx                       # Page avec CardEditorClient
├── cardEditorClient.tsx           # Client principal (Template sélection + Editor)
├── card-editor-client.tsx         # Page de sélection de templates
└── layout.tsx                     # Layout éditeur

components/card-editor/
├── cardEditorClient.tsx           # ✅ Version principale
├── editor-panel.tsx               # Panel d'édition
├── editor-sidebar.tsx             # Sidebar (tabs)
├── editor-workspace.tsx           # Workspace principal
├── card-preview.tsx               # Aperçu carte
├── preview-pane.tsx               # Pane preview multi-device
├── preview-modal.tsx              # Modal preview
├── share-modal.tsx                # Partage social
├── theme-selector.tsx             # Sélecteur thème
├── image-uploader.tsx             # Upload images
├── templates.ts                   # 3 templates
├── onboarding/
│   ├── welcome.tsx                # Page bienvenue
│   ├── template-selector.tsx      # Sélecteur templates
│   └── tour.tsx                   # Tour guidé
├── preview-themes/
│   ├── minimal-theme.tsx          # Thème minimal
│   ├── gradient-theme.tsx         # Thème gradient
│   ├── glassmorphism-theme.tsx    # Thème glass
│   ├── bento-theme.tsx            # Thème bento
│   └── glass-theme.tsx            # Thème glass
└── tabs/
    ├── info-tab.tsx               # Tab infos
    ├── design-tab.tsx             # Tab design
    ├── social-tab.tsx             # Tab social
    ├── qr-tab.tsx                 # Tab QR
    └── export-tab.tsx             # Tab export
```

### **Store Zustand**
- **Fichier** : `lib/store/card-editor-store.ts`
- **Storage key** : `card-editor-storage`
- **Type** : `CardData`
- **Features** :
  - Images (profile, cover, logo)
  - Informations de base (nom, titre, entreprise)
  - Contact (email, phone, website)
  - Design (4 thèmes, couleurs)
  - Social links
  - Action buttons
  - Preview multi-device (mobile, tablet, desktop)
  - Settings (stats, domain, public)
  - Slug & analytics

### **Statut**
✅ **Fonctionnel** - Landing page personnelle avec thèmes

### **UI**
- Template selector initial
- Sidebar tabs (Profile, Design, Social, Export)
- Live preview (mobile/tablet/desktop)
- Image upload
- Thèmes : minimal, gradient, glassmorphism, bento
- Save/Publish

---

## 🏷️ Éditeur 2 : Badge Editor (Impression Physique)

### **Route actuelle**
- URL : `/fr/badge-editor`
- Locale : Support i18n

### **Fichiers principaux**
```
app/[locale]/badge-editor/
└── page.tsx                       # Redirection vers Card Designer
```

### **Store Zustand**
✅ **Card Designer Store** (partagé)

### **Statut**
✅ **OPÉRATIONNEL** - Redirige vers Card Designer

### **UI**
- Page informative avec features
- CTA vers Card Designer
- Design moderne

### **Fonctionnalités**
- ✅ Canvas professionnel (via Card Designer)
- ✅ Import CSV/Excel
- ✅ Impression en série
- ✅ Batch printing
- ✅ Export PDF/PNG
- ✅ Templates configurables
- ✅ Dimensions personnalisées

**Note :** Badge Editor utilise le Card Designer comme moteur. Pas de duplication de code.

---

## 💳 Éditeur 3 : Card Designer (PVC Cards - Professionnel)

### **Route actuelle**
- URL : `/fr/card-designer`
- Locale : Support i18n

### **Fichiers principaux**
```
app/[locale]/card-designer/
├── page.tsx                       # Page avec CardDesignerClient
├── cardDesignerClient.tsx         # Client principal

components/card-designer/
├── card-designer-canvas.tsx       # Canvas principal
├── card-designer-header.tsx       # Header avec toolbar
├── card-designer-toolbar.tsx      # Toolbar outils
├── card-designer-panels.tsx       # Panels latéraux
├── card-designer-footer.tsx       # Footer stats
├── panels/
│   ├── layers-panel.tsx           # Layers
│   ├── properties-panel.tsx       # Props
│   ├── templates-panel.tsx        # Templates
│   ├── data-source-panel.tsx      # Data source
│   └── print-settings-panel.tsx   # Settings
├── proportions-test.tsx           # Test proportions
└── simple-canvas-test.tsx         # Test canvas
```

### **Store Zustand**
- **Fichier** : `lib/store/card-designer-store.ts`
- **Storage key** : `card-designer-storage`
- **Type** : `CardProject`
- **Features** :
  - Projet avec recto/verso
  - Dimensions configurables (mm, DPI)
  - Design elements (text, image, shape, QR, barcode)
  - Background (color, gradient, image, pattern)
  - Data source (Excel, CSV, JSON)
  - Security features (hologram, watermark, microtext)
  - Canvas tools (pointer, text, rectangle, image)
  - Layers management
  - Undo/Redo
  - Grid/Guides/Rulers
  - Zoom controls
  - Bleed & safe area

### **Statut**
✅ **Fonctionnel** - Designer pro pour cartes PVC

### **UI**
- Canvas réactif
- Toolbar outils
- Panels latéraux
- Grid/rulers/guides
- Undo/Redo
- Shortcuts clavier
- Print preview

### **Cas d'usage**
- Badges employés
- Cartes d'identité
- Cartes PVC personnalisées
- Impression en série

---

## 🎯 Éditeur 4 : NFC Editor (Wizard Gamifié SaaS)

### **Route actuelle**
- URL : `/fr/nfc-editor`
- Locale : Support i18n

### **Fichiers principaux**
```
app/[locale]/nfc-editor/
├── page.tsx                       # Page avec NFCEditorClient + Header

components/nfc-wizard/
├── nfc-editor-client.tsx          # ✅ Orchestrateur principal
├── wizard.tsx                     # Wizard 6 étapes
├── gamified-progress.tsx          # Progress bar gamifiée
├── card-preview-3d.tsx            # Preview 3D temps réel
├── card-preview.tsx               # Preview 2D
├── card-templates.tsx             # Templates sélector
├── social-links-step.tsx          # Step social
├── custom-fields-step.tsx         # Step custom fields
├── export-step.tsx                # Step export
├── export-options.tsx             # Options export
├── image-upload.tsx               # Upload images
├── lead-capture-form.tsx          # Form leads
├── analytics-dashboard.tsx        # Dashboard analytics
└── team-management.tsx            # Team management
```

### **Store Zustand**
- **Fichier** : `lib/store/nfc-editor-store.ts`
- **Storage key** : `nfc-editor-storage`
- **Type** : `NFCProfile`
- **Features** :
  - Mode (personal/business)
  - Wizard 6 étapes (Mode, Info, Contact, Social, Design, Export)
  - Themes : sunset, ocean, forest, midnight, royal, dawn
  - Images (avatar, background, logo)
  - Social links (10 platforms incluant TikTok)
  - Custom fields
  - Lead capture
  - Analytics dashboard
  - Team management (multi-tenant ready)
  - QR Code export
  - vCard export
  - Multi-format share
  - Views/Saves/Shares tracking
  - Auto-save

### **Statut**
✅ **Fonctionnel** - SaaS NFC complet avec wizard gamifié

### **UI**
- Wizard 6 étapes progressif
- Gamified progress avec sparkles
- Preview 3D temps réel
- Auto-save indicator
- 4 templates design
- Upload images (3 types)
- Social links dynamiques
- Export multi-format
- Analytics intégrées

### **Cas d'usage**
- Carte de visite digitale
- Share par NFC/QR
- Lead capture
- Team badges
- Analytics

---

## 🔍 Routes supplémentaires

### **Route 5 : `/fr/nfc`**
- **Client** : `app/[locale]/nfc/nfcClient.tsx`
- **Statut** : ⚠️ Placeholder "Interface NFC en cours de développement"
- **Purpose** : Ancienne route, remplacée par `/nfc-editor`

### **Route 6 : `/fr/card`**
- **Action** : Redirect vers `/fr/card-editor`
- **Purpose** : Alias court

### **Route 7 : `/fr/card/editor`**
- **Client** : `app/[locale]/card/editor/cardEditorHomeClient.tsx`
- **Statut** : ⚠️ Route alternative non utilisée
- **Purpose** : Ancienne structure

---

## 📊 Comparaison des éditeurs

| Feature | Card Editor | Badge Editor | Card Designer | NFC Editor ⭐ |
|---------|-------------|--------------|---------------|---------------|
| **Route** | `/card-editor` | `/badge-editor` | `/card-designer` | `/nfc-editor` |
| **Type** | Landing Page | Badges | PVC Cards | Digital NFC |
| **Cas d'usage** | Site perso | Impression | Impression pro | Partage digital |
| **Store** | ✅ | ✅ | ✅ | ✅ |
| **Templates** | 3 | ∞ (via Card Designer) | ∞ | 4 |
| **Preview** | Multi-device | Canvas | Canvas | 3D temps réel |
| **Images** | 3 | Tous | Tous | 3 |
| **Social** | ✅ | ❌ | ❌ | ✅ (10) |
| **Export** | Share | Print | Print | QR/vCard |
| **Analytics** | Basic | ❌ | ❌ | ✅ Dashboard |
| **CSV Import** | ❌ | ✅ | ✅ | ❌ |
| **Batch Print** | ❌ | ✅ | ✅ | ❌ |
| **Wizard** | ❌ | ❌ | ❌ | ✅ 6 étapes |
| **Gamified** | ❌ | ❌ | ❌ | ✅ |
| **Multi-tenant** | ❌ | ❌ | ❌ | ✅ Ready |
| **Statut** | ✅ Fonctionnel | ✅ Opérationnel | ✅ Fonctionnel | ✅ Fonctionnel |

---

## 🎯 Recommandations

### **Pour Multi-tenant**

1. **Conserver** :
   - ✅ Card Editor (landing pages)
   - ✅ Card Designer (impression)
   - ✅ NFC Editor (SaaS complet)

2. **Développer** :
   - ⚠️ Badge Editor → Priorité basse

3. **Supprimer/Déprécier** :
   - ❌ `/nfc` placeholder → Redirect vers `/nfc-editor`
   - ❌ `/card/editor` → Déjà inutilisé

### **Isolation per tenant**

**Stores à isoler** :
- ✅ `nfc-editor-store` → Multi-tenant ready
- ⚠️ `card-editor-store` → À isoler
- ⚠️ `card-designer-store` → À isoler

**Migration order** :
1. NFC Editor (déjà prêt)
2. Card Designer (store simple)
3. Card Editor (store complexe)

---

## 📦 Dépendances partagées

### **UI Components**
- `components/ui/*` (shadcn)
- `framer-motion` (animations)
- `lucide-react` (icons)

### **Stores**
- `zustand` + `persist`
- `localStorage` (tous les stores)

### **Features**
- Image upload (Cloudinary/local)
- QR codes (`qrcode.react`)
- vCard export (`vcf`)
- Social share (`react-share`)
- Analytics (chart.js, recharts)

---

## 🚀 Architecture Proposée

### **Structure multi-tenant**

```
app/
├── [locale]/
│   ├── [tenant]/                    # Nouveau niveau
│   │   ├── nfc-editor/              # Isolé par tenant
│   │   ├── card-editor/             # Isolé par tenant
│   │   └── card-designer/           # Isolé par tenant
│   └── [...]
```

### **Stores isolation**

```typescript
// Avant
useNFCEditorStore() → localStorage global

// Après
useNFCEditorStore(tenantId) → localStorage[tenantId]
```

### **Routes**

```
/fr/nfc-editor               → Défaut (xarala)
/fr/xarala/nfc-editor        → Explicit xarala
/fr/client2/nfc-editor       → Tenant client2
```

---

**Inventaire créé le** : 1er février 2025  
**Par** : AI Assistant  
**Validé** : ✅ Tous les éditeurs fonctionnels

