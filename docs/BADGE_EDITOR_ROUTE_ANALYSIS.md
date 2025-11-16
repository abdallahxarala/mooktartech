# Badge Editor Route Analysis

## 📍 Chemin exact du fichier

**Route :** `/badge-editor/design`

**Fichier principal :** `app/[locale]/badge-editor/design/page.tsx`

**Composant client :** `app/[locale]/badge-editor/design/badgeDesignClient.tsx`

---

## 🎨 Composant Canvas utilisé

### Nom du composant
**`SimpleCanvasTest`**

### Import
```typescript
import { SimpleCanvasTest } from '@/components/badge-editor/design/simple-canvas-test'
```

### Emplacement dans le JSX
```tsx
{/* Canvas */}
<div className="flex-1 bg-gray-100 relative overflow-hidden">
  <SimpleCanvasTest />
</div>
```

**Ligne 177** dans `badgeDesignClient.tsx`

---

## 📦 Imports présents dans badgeDesignClient.tsx

```typescript
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useCardDesignerStore } from '@/lib/store/card-designer-store'
import { CardDesignerHeader } from '@/components/badge-editor/design/card-designer-header'
import { CardDesignerToolbar } from '@/components/badge-editor/design/card-designer-toolbar'
import { SimpleCanvasTest } from '@/components/badge-editor/design/simple-canvas-test'  // ← Canvas utilisé
import { CardDesignerPanels } from '@/components/badge-editor/design/card-designer-panels'
import { CardDesignerFooter } from '@/components/badge-editor/design/card-designer-footer'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
```

---

## 🏗️ Structure JSX

### Structure complète de `badgeDesignClient.tsx`

```tsx
<div className="min-h-screen bg-gray-50 flex flex-col">
  {/* Breadcrumb */}
  <div className="bg-white border-b border-gray-200">
    <Link href={`/${locale}/badge-editor`}>
      ← Retour au Badge Editor
    </Link>
  </div>

  {/* Header */}
  <CardDesignerHeader 
    project={currentProject}
    canvasMode={canvasMode}
    onCanvasModeChange={setCanvasMode}
    onZoomChange={setZoom}
    zoom={zoom}
    canUndo={canUndo()}
    canRedo={canRedo()}
    onUndo={undo}
    onRedo={redo}
    onSave={saveProject}
    onToggleGrid={toggleGrid}
    onToggleGuides={toggleGuides}
    onToggleRulers={toggleRulers}
    showGrid={showGrid}
    showGuides={showGuides}
    showRulers={showRulers}
  />

  {/* Main Content */}
  <div className="flex flex-1 overflow-hidden">
    {/* Toolbar */}
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col">
      <CardDesignerToolbar 
        activeTool={activeTool}
        onToolChange={setActiveTool}
      />
    </div>

    {/* Canvas Area */}
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden">
          <SimpleCanvasTest />  {/* ← Composant Canvas */}
        </div>

        {/* Panels */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <CardDesignerPanels 
            activePanel={activePanel}
            onPanelChange={setActivePanel}
            project={currentProject}
            selectedElements={selectedElements}
          />
        </div>
      </div>
    </div>
  </div>

  {/* Footer */}
  <CardDesignerFooter 
    project={currentProject}
    canvasMode={canvasMode}
    zoom={zoom}
    selectedCount={selectedElements.length}
  />
</div>
```

---

## 📋 Informations sur SimpleCanvasTest

### Fichier source
`components/badge-editor/design/simple-canvas-test.tsx`

### Caractéristiques
- Composant React simple (pas de Fabric.js)
- Utilise le store Zustand (`useCardDesignerStore`) pour le zoom
- Affiche des proportions de carte CR80 (85.6 × 53.98 mm)
- Contient un composant `ProportionsTest`
- Affiche des zones RECTO et VERSO
- Dimensions en pixels : 856px × 540px (ratio 1.586:1)

### Différence avec CardDesignerCanvasFabric
- **SimpleCanvasTest** : Canvas HTML/CSS simple, pas de Fabric.js
- **CardDesignerCanvasFabric** : Canvas avec Fabric.js, interactions avancées

---

## 🔄 Comparaison avec Card Designer

### Card Designer (`/card-designer`)
- **Canvas :** `CardDesignerCanvasFabric` (Fabric.js)
- **Fichier :** `app/[locale]/card-designer/cardDesignerClient.tsx`
- **Import :** `@/components/card-designer/card-designer-canvas-fabric`

### Badge Editor (`/badge-editor/design`)
- **Canvas :** `SimpleCanvasTest` (HTML/CSS simple)
- **Fichier :** `app/[locale]/badge-editor/design/badgeDesignClient.tsx`
- **Import :** `@/components/badge-editor/design/simple-canvas-test`

---

## ✅ Notes importantes

1. **Badge Editor utilise un canvas différent** : `SimpleCanvasTest` au lieu de `CardDesignerCanvasFabric`
2. **Pas de Fabric.js** dans Badge Editor actuellement
3. **Structure similaire** : même layout avec Header, Toolbar, Canvas, Panels, Footer
4. **Store partagé** : les deux utilisent `useCardDesignerStore` de Zustand
5. **Composants séparés** : Badge Editor a ses propres composants dans `components/badge-editor/design/`

---

*Document généré le : $(date)*

