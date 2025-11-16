# Analyse Card Designer

> Analyse complète de l'architecture actuelle du Card Designer pour préparer la fusion avec Badge Designer Pro

**Date:** Janvier 2025  
**Status:** Architecture analysée, ready pour fusion

---

## 📁 Structure des Fichiers

### Routes (app/[locale]/card-designer/)
```
app/[locale]/card-designer/
├── page.tsx (REDIRECT vers /badge-editor/design)
└── cardDesignerClient.tsx (Client principal - 187 lignes)
```

### Composants (components/card-designer/)
```
components/card-designer/
├── card-designer-canvas.tsx (Canvas HTML5 - 135 lignes)
├── card-designer-toolbar.tsx (15 outils + clipboard - 86 lignes)
├── card-designer-header.tsx (Menu actions)
├── card-designer-footer.tsx (Info + zoom)
├── card-designer-panels.tsx (5 panels - 77 lignes)
└── panels/
    ├── elements-panel.tsx (Ajout éléments)
    ├── layers-panel.tsx (Gestion calques)
    ├── properties-panel.tsx (Props sélection)
    ├── data-panel.tsx (Source de données)
    └── security-panel.tsx (Features sécurité)
```

**Total:** 15 fichiers, ~1000 lignes de code

### Store/State
```
lib/store/
└── card-designer-store.ts (Zustand avec persist - 475 lignes)
```

---

## 🎨 Fonctionnalités Actuelles

### ✅ Implémentées et Fonctionnelles

#### Canvas & Design
- ✅ Canvas HTML5 (non Fabric.js pour l'instant)
- ✅ Gestion éléments: texte, image, formes, QR, barcode
- ✅ Drag & drop simulé
- ✅ Resize & rotate (props)
- ✅ Layers management (zIndex)
- ✅ Undo/Redo complet (historique)
- ✅ Sélection multiple éléments
- ✅ Grille, guides, règles
- ✅ Zoom (25% - 400%)
- ✅ Mode recto/verso

#### Panels & UI
- ✅ Elements panel: ajout éléments
- ✅ Layers panel: liste + ordre
- ✅ Properties panel: éditer sélection
- ✅ Data panel: config source de données
- ✅ Security panel: hologramme, watermark, microtext

#### Tools
- ✅ Pointer (Sélection)
- ✅ Text (Texte)
- ✅ Rectangle, Circle (Formes)
- ✅ Image, QR, Barcode
- ✅ Line, Crop
- ✅ Lock, Security
- ✅ Copy/Paste/Duplicate

#### State Management
- ✅ Zustand store avec persist localStorage
- ✅ Historique complet
- ✅ Projets multiples
- ✅ Sauvegarde auto

#### Shortcuts Clavier
- ✅ Ctrl+S (Save)
- ✅ Ctrl+Z/Y (Undo/Redo)
- ✅ Ctrl+G (Grid)
- ✅ V, T, R, C, I, Q, B, L, X, K, S, G, M, O (Tools)
- ✅ 1, 2 (Recto/Verso)

### ❌ Non Implémentées

#### Canvas Avancé
- ❌ **Fabric.js non utilisé** (dépendance installée mais pas intégrée)
- ❌ Vraie interaction drag & drop
- ❌ Vraies transformations (resize, rotate)
- ❌ Snap to grid
- ❌ Alignement automatique
- ❌ Groupement éléments
- ❌ Masquage/coupage

#### Templates
- ❌ Templates prédéfinis
- ❌ Chargement templates
- ❌ Sauvegarde custom templates
- ❌ Prévisualisation templates

#### Export
- ❌ Export PDF (jspdf installé mais non utilisé)
- ❌ Export PNG/JPG (html2canvas non utilisé)
- ❌ Preview avant export
- ❌ Qualité paramétrable
- ❌ Batch export

#### Variables Dynamiques
- ❌ Variables texte `{nom}`, `{email}`
- ❌ Remplacement automatique
- ❌ QR codes dynamiques
- ❌ Mapping CSV → variables

#### Production
- ❌ Batch generation
- ❌ Import CSV
- ❌ Multi-badges generation
- ❌ Print queue

---

## 🔧 Stack Technique

### ✅ Installées
- **Canvas:** HTML5 Canvas (fabric v6.7.1 installé mais non utilisé)
- **State:** Zustand avec persist middleware
- **Export:** jspdf v3.0.3, html2canvas v1.4.1, file-saver v2.0.5
- **QR:** qrcode v1.5.4, react-qrcode-logo v4.0.0
- **UI:** Framer Motion v11.18.2, Lucide Icons
- **Forms:** React Hook Form v7.51.0
- **Storage:** localStorage via Zustand persist

### ❌ Non Installées
- **CSV Parsing:** papaparse
- **Fabric.js integration:** besoins wrapper
- **PDF Generation:** améliorer jspdf usage
- **Print:** Print queue manager

---

## 📊 Architecture Actuelle

```
card-designer/
│
├── Client Layer (UI)
│   ├── Header (Menu + Actions)
│   ├── Toolbar (15 outils)
│   ├── Canvas (HTML5, 400x250px)
│   ├── Panels (5 panels side)
│   └── Footer (Info + Zoom)
│
├── State Layer (Zustand)
│   ├── CardProject (recto + verso)
│   ├── DesignElement (types + props)
│   ├── History (undo/redo)
│   └── UI State (active tool/panel)
│
├── Export Layer (Dormante)
│   ├── jspdf (non utilisé)
│   ├── html2canvas (non utilisé)
│   └── file-saver (non utilisé)
│
└── Data Layer (localStorage)
    └── Zustand persist middleware
```

---

## 🎯 Modèle de Données

### CardProject
```typescript
interface CardProject {
  id: string
  name: string
  description: string
  template: string
  
  dimensions: {
    width: number  // mm
    height: number // mm
    dpi: number
  }
  
  recto: CardDesign
  verso: CardDesign
  
  dataSource?: DataSource      // CSV/Excel mapping
  security: SecurityFeatures
  
  createdAt: string
  updatedAt: string
  version: number
}
```

### CardDesign
```typescript
interface CardDesign {
  elements: DesignElement[]
  background: BackgroundSettings
  bleed: number    // mm
  safeArea: number // mm
}
```

### DesignElement
```typescript
interface DesignElement {
  id: string
  type: 'text' | 'image' | 'shape' | 'qr' | 'barcode' | 'line' | 'security'
  name: string
  
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  opacity: number
  locked: boolean
  visible: boolean
  layer: number
  
  properties: {
    // Text
    text?: string
    fontFamily?: string
    fontSize?: number
    fontWeight?: string
    color?: string
    alignment?: 'left' | 'center' | 'right'
    
    // Image
    src?: string
    crop?: { x: number; y: number; width: number; height: number }
    
    // Shape
    shape?: 'rectangle' | 'circle' | 'polygon'
    fillColor?: string
    strokeColor?: string
    strokeWidth?: number
    
    // QR/Barcode
    data?: string
    format?: string
    
    // Security
    securityType?: 'hologram' | 'watermark' | 'microtext'
  }
}
```

---

## ✨ Ce qui Manque pour Badge Designer Pro

### Gestion d'Événements
- [ ] Créer/éditer événements
- [ ] Association événement → template
- [ ] Configuration zones d'accès
- [ ] Dashboard événement

### Import & Participants
- [ ] Import CSV participants
- [ ] Mapping colonnes CSV → variables
- [ ] Validation données
- [ ] Édition manuelle participants
- [ ] Export participants

### Génération Multi-Badges
- [ ] Engine génération batch
- [ ] Remplacement variables `{nom}`, `{email}`
- [ ] QR codes uniques par participant
- [ ] Preview batch
- [ ] Retry en cas d'erreur

### Export & Impression
- [ ] Export PDF batch
- [ ] Export PNG batch
- [ ] Queue d'impression
- [ ] Paramètres imprimante
- [ ] Historique impressions

### QR/NFC Encoding
- [ ] Génération QR uniques
- [ ] NFC encoding (NFCWriter existant)
- [ ] Validation QR
- [ ] QR Scanner check-in

### Analytics & Suivi
- [ ] Badges générés vs imprimés
- [ ] Check-in stats
- [ ] Export analytics

### Canvas Avancé
- [ ] **Intégrer Fabric.js** (priorité haute)
- [ ] Vraies transformations
- [ ] Groupement éléments
- [ ] Templates gallery
- [ ] Variables preview

---

## 🔄 Flux Utilisateur Actuel

```
1. Ouvrir /card-designer
   └─ Redirect vers /badge-editor/design

2. Initialisation auto
   └─ Création projet 'blank'

3. Design Canvas
   ├─ Sélection outil
   ├─ Ajout élément
   ├─ Édition properties
   └─ Layers management

4. Sauvegarde
   └─ localStorage auto (Zustand persist)

5. Undo/Redo
   └─ Historique complet
```

**Pas de flux événement → participants → génération**

---

## 🎯 Plan de Fusion avec Badge Designer Pro

### Étape 1 : Wrapper Card Designer ✅
- ✅ Route `/badge-editor/design` créée
- ✅ Redirect `/card-designer` → `/badge-editor/design`
- ✅ Composants disponibles

### Étape 2 : Intégrer Fabric.js 🔴
- [ ] Wrapper Fabric.js dans card-designer-canvas.tsx
- [ ] Transformations réelles (drag, resize, rotate)
- [ ] Events handlers Fabric
- [ ] Sync avec Zustand store

### Étape 3 : Variables Dynamiques 🔴
- [ ] Support variables `{nom}`, `{email}`, `{qr}`
- [ ] Preview avec données test
- [ ] Mapping variables → data source

### Étape 4 : Templates Gallery 🔴
- [ ] Créer templates de base
- [ ] Loader templates
- [ ] Gallery UI

### Étape 5 : Batch Generation 🔴
- [ ] Engine génération
- [ ] Import CSV (papaparse)
- [ ] Multi-badges PDF/PNG
- [ ] QR codes uniques

### Étape 6 : Production 🔴
- [ ] Print queue
- [ ] Check-in scanner
- [ ] Analytics dashboard

---

## 🐛 Bugs Connus

### Canvas
- Canvas HTML5 simple, pas de vraies interactions
- Fabric.js installé mais non utilisé (opportunité)
- Export PDF/PNG non fonctionnel

### State
- Pas de validation données
- localStorage peut être vidé par user

### Performance
- Historique illimité (risque mémoire)
- Pas de debounce sur sauvegardes

---

## 📈 Métriques Actuelles

- **Lignes de code:** ~1000
- **Fichiers:** 15
- **Composants:** 8
- **Store:** 1 Zustand (475 lignes)
- **Fonctionnalités:** ~40% complètes
- **Couverture tests:** 0%

---

## ✅ Conclusion

**État Actuel:**
- Architecture solide avec Zustand + React
- UI fonctionnelle et complète
- Composants bien structurés
- **CRITIQUE:** Fabric.js installé mais non utilisé

**Prochaines Étapes:**
1. Intégrer Fabric.js dans canvas
2. Ajouter variables dynamiques
3. Créer templates
4. Implémenter batch generation
5. Ajouter print queue

**Estimation Fusion Complète:** 50-70h sur 4 semaines

---

**Document créé:** Janvier 2025  
**Prochain Update:** Après implémentation Fabric.js
