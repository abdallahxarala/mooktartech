# Analyse de l'existant - Badge Designer Pro

**Date:** 2025-01-30  
**Objectif:** Cartographier l'existant avant refonte UX du Badge Designer Pro

---

## 📋 TÂCHE 1 – Cartographie de l'existant

### 1.1 Structure des routes

#### `app/[locale]/badge-editor/pro/page.tsx`
- **Type:** Server Component
- **Rôle:** Point d'entrée PRO, wrapper minimal
- **Contenu:**
  - Récupère `locale` et `translations`
  - Rend `<BadgeDesignClient />` avec props
- **Dépendances:** `BadgeDesignClient` depuis `../design/badgeDesignClient`

#### `app/[locale]/badge-editor/design/badgeDesignClient.tsx`
- **Type:** Client Component (`'use client'`)
- **Rôle:** Shell principal du designer (orchestration layout)
- **Structure actuelle:**
  ```
  ┌─────────────────────────────────────┐
  │ Breadcrumb (Retour)                 │
  ├─────────────────────────────────────┤
  │ CardDesignerHeader (topbar)         │
  ├──────────┬─────────────────────────┤
  │ Toolbar  │ Canvas Area              │
  │ (left)   │ ┌──────────┬──────────┐  │
  │          │ │ Canvas   │ Panels   │  │
  │          │ │ (center) │ (right)  │  │
  │          │ └──────────┴──────────┘  │
  ├──────────┴─────────────────────────┤
  │ CardDesignerFooter (bottom bar)     │
  └─────────────────────────────────────┘
  ```
- **Fonctionnalités:**
  - Gestion raccourcis clavier (Ctrl+S, Ctrl+Z, Ctrl+Y, etc.)
  - Initialisation projet par défaut si aucun n'existe
  - Liaison avec Zustand store (`useCardDesignerStore`)
- **Composants utilisés:**
  - `CardDesignerHeader`
  - `CardDesignerToolbar`
  - `CardDesignerCanvasFabric`
  - `CardDesignerPanels`
  - `CardDesignerFooter`

---

### 1.2 Composants UI

#### `components/badge-editor/design/card-designer-header.tsx`
- **Type:** Client Component
- **Rôle:** Topbar avec contrôles principaux
- **Fonctionnalités:**
  - Info projet (nom, version, dimensions)
  - Toggle Recto/Verso
  - Undo/Redo
  - Contrôles vue (Grid, Guides, Rulers)
  - Zoom (in/out/reset)
  - Actions (Preview, Export, Print, Save, Settings)
- **État:** Reçoit props depuis `badgeDesignClient.tsx`

#### `components/badge-editor/design/card-designer-toolbar.tsx`
- **Type:** Client Component
- **Rôle:** Sidebar gauche avec outils (drag & drop)
- **Outils disponibles:**
  - `pointer` (Sélection)
  - `text` (Texte)
  - `rectangle`, `circle` (Formes)
  - `image` (Image)
  - `qr`, `barcode` (Codes)
  - `line` (Ligne)
  - `crop` (Recadrage)
  - `lock` (Verrouiller)
  - `security` (Sécurité)
  - `layers` (Calques)
  - `move`, `rotate` (Transformations)
- **État:** `activeTool` depuis store

#### `components/card-designer/card-designer-canvas-fabric.tsx`
- **Type:** Client Component
- **Rôle:** Canvas Fabric.js principal
- **Fabric.js:** ✅ OUI
- **Fonctionnalités actuelles:**
  - Initialisation canvas (800×500px, fond blanc)
  - Chargement éléments depuis store (recto/verso selon `canvasMode`)
  - Création objets Fabric depuis `DesignElement`:
    - `Textbox` pour texte
    - `Rect` pour rectangles
    - `Circle` pour cercles
  - Écoute événements Fabric:
    - `object:modified` → met à jour store
    - `object:removed` → supprime du store
  - Méthodes exposées via `ref`:
    - `getCanvas()`
    - `addText()`
    - `addRectangle()`
    - `addCircle()`
- **Limitations actuelles:**
  - Pas de zoom appliqué
  - Pas de grid/guides visuels
  - Pas de gestion drag & drop depuis toolbar
  - Dimensions canvas fixes (pas de conversion mm → px)

#### `components/badge-editor/design/card-designer-panels.tsx`
- **Type:** Client Component
- **Rôle:** Panneau latéral droit avec onglets
- **Onglets disponibles:**
  - `elements` → `<ElementsPanel />`
  - `layers` → `<LayersPanel />`
  - `properties` → `<PropertiesPanel />`
  - `data` → `<DataPanel />`
  - `security` → `<SecurityPanel />`

#### `components/badge-editor/design/panels/properties-panel.tsx`
- **Type:** Client Component
- **Rôle:** Panneau de propriétés dynamique selon sélection
- **État actuel:**
  - Affiche "Aucun élément sélectionné" si rien sélectionné
  - Contrôles pour Position (X, Y), Taille (W, H), Rotation, Opacité
  - **⚠️ Non connecté au store:** Les inputs ne sont pas liés aux valeurs réelles

#### `components/badge-editor/design/card-designer-footer.tsx`
- **Type:** Client Component
- **Rôle:** Barre de statut en bas
- **Affichage:**
  - Dimensions (Format CR80)
  - DPI
  - Mode (Recto/Verso)
  - Nombre d'éléments
  - Zoom
  - Fond perdu (bleed)
  - Dernière sauvegarde (hardcodé "2min")
  - Indicateur statut

---

### 1.3 Store Zustand

#### `lib/store/card-designer-store.ts`
- **Type:** Zustand store avec persistence
- **Rôle:** État global du designer
- **Structure de données:**

```typescript
interface CardDesignerState {
  // Projet actuel
  currentProject: CardProject | null
  projects: CardProject[]
  
  // Canvas
  canvasMode: 'recto' | 'verso'
  zoom: number
  selectedElements: string[]
  clipboard: DesignElement[]
  
  // UI
  activeTool: string
  activePanel: string
  showGrid: boolean
  showGuides: boolean
  showRulers: boolean
  
  // Historique
  history: CardProject[]
  historyIndex: number
  
  // Actions (voir code complet)
}
```

- **Types principaux:**

```typescript
interface CardProject {
  id: string
  name: string
  template: string
  dimensions: { width: number; height: number; dpi: number }
  recto: CardDesign
  verso: CardDesign
  dataSource?: DataSource
  variables?: VariableDefinition[]
  security: SecurityFeatures
  // ...
}

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
  properties: { /* spécifique par type */ }
}
```

- **Actions principales:**
  - `createProject(template)`
  - `loadProject(id)`
  - `saveProject()` → **TODO:** Sauvegarde DB
  - `addElement(element)`
  - `updateElement(id, updates)`
  - `deleteElement(id)`
  - `undo()` / `redo()`
  - `exportPDF()` → **TODO:** Implémentation
  - `exportPNG()` → **TODO:** Implémentation
  - `generateBatch(settings)` → **TODO:** Génération par lots

- **Persistence:**
  - Stockage localStorage via `persist` middleware
  - Sauvegarde: `projects` et `currentProject` uniquement

---

### 1.4 Vue d'ensemble

#### Fichiers gérant le canvas Fabric.js
- ✅ `components/card-designer/card-designer-canvas-fabric.tsx`
  - Initialisation Fabric.js
  - Synchronisation store ↔ canvas
  - Création objets Fabric depuis `DesignElement`

#### Fichiers gérant la toolbar / sidebar
- ✅ `components/badge-editor/design/card-designer-toolbar.tsx`
  - Liste outils avec icônes
  - Gestion `activeTool`
  - **⚠️ Pas de drag & drop fonctionnel**

#### Stockage de l'état
- ✅ **Zustand:** `lib/store/card-designer-store.ts`
  - Éléments badge: `currentProject.recto.elements` / `currentProject.verso.elements`
  - Layers: `DesignElement.layer` (numéro, pas de gestion avancée)
  - Templates: `CardProject.template` (string, pas de structure définie)
  - Canvas: `zoom`, `showGrid`, `showGuides`, `showRulers`
  - Sélection: `selectedElements: string[]`

---

## 📋 TÂCHE 2 – Proposition de nouvelle organisation

### 2.1 Structure proposée

```
app/[locale]/badge-editor/pro/
  └── page.tsx                    # Server component (wrapper)

components/badge-designer/pro/
  ├── badge-designer-shell.tsx   # Layout global (topbar + sidebar + canvas + panels)
  ├── canvas/
  │   └── badge-canvas.tsx        # Canvas Fabric.js (initialisation, zoom, grid)
  ├── tools/
  │   └── tools-panel.tsx        # Sidebar outils (drag & drop)
  ├── properties/
  │   └── properties-panel.tsx   # Panneau dynamique selon sélection
  ├── topbar/
  │   └── designer-topbar.tsx    # Topbar (undo/redo, zoom, export)
  └── footer/
      └── designer-footer.tsx     # Bottom bar (zoom, grid size, stats)

lib/store/
  └── badge-designer-store.ts    # Store Zustand centralisé (refactor de card-designer-store.ts)
```

### 2.2 Détails des composants proposés

#### `app/[locale]/badge-editor/pro/page.tsx`
```typescript
// Server component simple
export default async function BadgeDesignerProPage({ params: { locale } }) {
  const translations = await getDictionary(locale)
  return <BadgeDesignerShell locale={locale} translations={translations} />
}
```

#### `components/badge-designer/pro/badge-designer-shell.tsx`
```typescript
'use client'

// Layout type design studio:
// ┌─────────────────────────────────────────────┐
// │ Topbar (undo/redo, zoom, export, save)      │
// ├──────┬───────────────────────────────┬──────┤
// │      │                               │      │
// │Tools │      Canvas (center)         │Props │
// │Panel │                               │Panel │
// │      │                               │      │
// ├──────┴───────────────────────────────┴──────┤
// │ Footer (zoom, grid, stats)                   │
// └─────────────────────────────────────────────┘
```

**Responsabilités:**
- Gestion layout responsive
- Coordination entre composants enfants
- Raccourcis clavier globaux
- Gestion état UI (panels ouverts/fermés)

#### `components/badge-designer/pro/canvas/badge-canvas.tsx`
```typescript
'use client'

// Canvas Fabric.js avec:
// - Initialisation depuis dimensions projet (mm → px)
// - Zoom appliqué au canvas
// - Grid overlay (si showGrid)
// - Guides visuels (si showGuides)
// - Gestion sélection objets
// - Drag & drop depuis toolbar
// - Synchronisation bidirectionnelle store ↔ Fabric
```

**Améliorations vs actuel:**
- Conversion mm → px selon DPI
- Zoom réel appliqué au canvas Fabric
- Grid/guides visuels
- Drag & drop fonctionnel

#### `components/badge-designer/pro/tools/tools-panel.tsx`
```typescript
'use client'

// Sidebar gauche avec:
// - Liste outils (texte, image, logo, QR, formes)
// - Drag & drop vers canvas
// - Indicateur outil actif
// - Groupes d'outils (Formes, Texte, Media, Codes)
```

**Améliorations vs actuel:**
- Drag & drop fonctionnel
- Groupes visuels
- Tooltips avec raccourcis

#### `components/badge-designer/pro/properties/properties-panel.tsx`
```typescript
'use client'

// Panneau dynamique selon sélection:
// - Aucune sélection → Message + actions globales
// - 1 élément sélectionné → Propriétés détaillées selon type
//   - Texte: font, size, color, alignment, etc.
//   - Image: src, crop, filters, etc.
//   - Shape: fill, stroke, radius, etc.
//   - QR: data, format, size, etc.
// - Plusieurs éléments → Propriétés communes (position, taille, rotation)
```

**Améliorations vs actuel:**
- Connecté au store (valeurs réelles)
- Panneaux spécifiques par type d'élément
- Validation en temps réel

#### `lib/store/badge-designer-store.ts`
```typescript
'use client'

// Refactor de card-designer-store.ts avec:
// - Même structure de données (CardProject, DesignElement)
// - Actions améliorées:
//   - Gestion templates (Classic, Minimal, Corporate, Event)
//   - Export PNG/PDF réel (via Fabric.js)
//   - Batch generation
//   - Liaison événements/exposants (si nécessaire)
```

**Compatibilité:**
- Garde les mêmes types (`CardProject`, `DesignElement`)
- Migration progressive depuis `card-designer-store.ts`

---

## 📋 TÂCHE 3 – Compatibilité / Non-régression

### 3.1 Parties critiques à NE PAS CASSER

#### ✅ Export (PNG/PDF)
- **État actuel:** 
  - Fonctions `exportPDF()` et `exportPNG()` dans store → **TODO** (non implémentées)
  - Boutons "Export" dans header → non fonctionnels
- **Action:** 
  - Implémenter export via Fabric.js `canvas.toDataURL()` (PNG)
  - Implémenter export PDF via `jsPDF` ou `pdfkit` (à évaluer)
  - **⚠️ Ne pas supprimer les fonctions du store**

#### ✅ Liaison événements / exposants
- **État actuel:**
  - Pas de liaison explicite trouvée dans le code analysé
  - Routes existantes: `app/[locale]/badge-editor/events/[eventId]/exhibitors/`
  - Tables DB: `events`, `exhibitors` (à vérifier dans migrations)
- **Action:**
  - **⚠️ Préserver la structure de routes `/badge-editor/events/**`**
  - Si liaison future nécessaire, ajouter `eventId` / `exhibitorId` dans `CardProject`
  - Ne pas modifier les routes existantes

#### ✅ Types utilisés
- **Types critiques:**
  - `CardProject` (structure complète)
  - `DesignElement` (tous les types: text, image, shape, qr, barcode, line, security)
  - `VariableDefinition` (pour batch generation)
  - `DataSource`, `DataSourceConfig` (pour import données)
- **Action:**
  - **⚠️ Ne pas modifier les types existants**
  - Ajouter de nouveaux types si nécessaire (ex: `BadgeTemplate`)
  - Migration progressive si refactor nécessaire

#### ✅ Field mapping / Variables
- **État actuel:**
  - `VariableDefinition[]` dans `CardProject`
  - `DEFAULT_VARIABLES` définis dans store
  - `DataSourceConfig` pour mapping CSV/API
- **Action:**
  - **⚠️ Préserver la logique de mapping**
  - Ne pas casser `initializeProjectVariables()`
  - Garder compatibilité avec batch generation

### 3.2 Parties refactorables sans impact

#### ✅ Composants UI uniquement
- **Sûr de refactorer:**
  - `components/badge-editor/design/*` → `components/badge-designer/pro/*`
  - Layout shell (`badgeDesignClient.tsx` → `badge-designer-shell.tsx`)
  - Panneaux (header, toolbar, panels, footer)
- **Impact:** Aucun sur la logique métier

#### ✅ Route `/badge-editor/pro`
- **Sûr de refactorer:**
  - Contenu de `page.tsx` (tant que props restent compatibles)
  - Composants enfants
- **Impact:** Aucun sur autres routes (`/badge-editor/events/**`, `/badge-editor/templates`, etc.)

#### ✅ Store (migration progressive)
- **Sûr de refactorer:**
  - Renommer `card-designer-store.ts` → `badge-designer-store.ts`
  - Améliorer actions (export, templates)
  - **⚠️ Garder même structure de données initialement**
- **Migration:**
  - Phase 1: Créer nouveau store, garder ancien en parallèle
  - Phase 2: Migrer composants un par un
  - Phase 3: Supprimer ancien store

### 3.3 Plan de refonte structurée

#### **Phase 1: Préparation (Sans casser l'existant)**
1. Créer nouvelle structure de dossiers:
   ```
   components/badge-designer/pro/
   ```
2. Créer nouveau store `badge-designer-store.ts` (copie de `card-designer-store.ts`)
3. Créer composants shell vides (squelettes)

#### **Phase 2: Canvas & Core (Impact limité)**
1. Refactor `badge-canvas.tsx`:
   - Améliorer conversion mm → px
   - Ajouter zoom réel
   - Ajouter grid/guides visuels
2. Tester avec store existant (compatibilité)

#### **Phase 3: UI Components (Impact limité)**
1. Refactor `tools-panel.tsx` avec drag & drop
2. Refactor `properties-panel.tsx` connecté au store
3. Refactor `designer-topbar.tsx` et `designer-footer.tsx`
4. Tester chaque composant isolément

#### **Phase 4: Intégration (Migration progressive)**
1. Créer `badge-designer-shell.tsx` qui utilise nouveaux composants
2. Mettre à jour `app/[locale]/badge-editor/pro/page.tsx` pour utiliser nouveau shell
3. Tester end-to-end
4. **⚠️ Garder ancien code en commentaire pendant 1-2 semaines**

#### **Phase 5: Export & Features (Nouvelles fonctionnalités)**
1. Implémenter `exportPNG()` réel
2. Implémenter `exportPDF()` réel
3. Ajouter gestion templates (Classic, Minimal, Corporate, Event)
4. Tester export avec projets existants

#### **Phase 6: Nettoyage (Après validation)**
1. Supprimer anciens composants (`components/badge-editor/design/*`)
2. Supprimer ancien store (`card-designer-store.ts`)
3. Mettre à jour imports dans autres fichiers si nécessaire

---

## 📊 Résumé

### Points forts actuels
- ✅ Structure Zustand solide
- ✅ Types TypeScript bien définis
- ✅ Canvas Fabric.js fonctionnel (basique)
- ✅ Architecture modulaire (header, toolbar, panels, footer)

### Points à améliorer
- ⚠️ Export PNG/PDF non implémenté
- ⚠️ Drag & drop depuis toolbar non fonctionnel
- ⚠️ Properties panel non connecté au store
- ⚠️ Zoom non appliqué au canvas
- ⚠️ Grid/guides non visuels
- ⚠️ Pas de gestion templates structurée

### Risques de non-régression
- ✅ **Faible:** Refactor UI uniquement
- ⚠️ **Moyen:** Migration store (nécessite tests)
- ✅ **Faible:** Export (non implémenté actuellement)

### Prochaines étapes recommandées
1. **Valider cette analyse** avec l'équipe
2. **Créer branche** `feature/badge-designer-refactor`
3. **Commencer Phase 1** (structure dossiers + store copie)
4. **Tester chaque phase** avant de passer à la suivante

---

**Document créé le:** 2025-01-30  
**Dernière mise à jour:** 2025-01-30

