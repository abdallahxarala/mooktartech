# Fabric.js Integration - Card Designer

**Date:** Janvier 2025  
**Status:** ✅ Phase 1 complétée

---

## ✅ Phase 1: Initialisation (COMPLÈTE)

### Fichier Créé
- `components/card-designer/card-designer-canvas-fabric.tsx`

### Imports Corrects
```typescript
import { Canvas, Rect, Circle, Textbox, FabricImage } from 'fabric'
```

### Features Implémentées
- ✅ Initialisation Fabric.js v6.7.1
- ✅ Canvas 800x500px avec fond blanc
- ✅ Error handling
- ✅ Loading state
- ✅ Integration avec props existantes (zoom, rulers, grid, etc.)

### Props Acceptées
```typescript
interface CardDesignerCanvasFabricProps {
  project: CardProject
  mode: 'recto' | 'verso'
  zoom: number
  activeTool: string
  selectedElements: string[]
  showGrid: boolean
  showGuides: boolean
  showRulers: boolean
}
```

---

## ✅ Phase 2: Sync Bidirectionnelle (COMPLÈTE)

### Fabric → Zustand ✅
- ✅ Listen to `selection:created/updated/cleared` events
- ✅ Listen to `object:modified` event (drag, resize, rotate)
- ✅ Sync position, size, rotation, opacity changes
- ✅ Update text content when modified
- ✅ Update store with fabric object data
- ✅ Handle keyboard events (Delete/Backspace)

### Zustand → Fabric ✅
- ✅ Load elements from store on project/mode change
- ✅ Create Fabric objects (Textbox, Rect, Circle, FabricImage)
- ✅ Re-render on store changes
- ✅ Handle mode switch (recto/verso)
- ✅ Restore selection state
- ✅ Async image loading with Promise.all

### Features Implémentées
- ✅ Prevention sync loops avec `isSyncingRef`
- ✅ Snap to grid (10px) optionnel
- ✅ Store values priority over props
- ✅ Error handling pour images
- ✅ Console logging pour debug

### Types Synchronisés
```typescript
// Fabric → Zustand
const updates = {
  position: { x: number, y: number }
  size: { width: number, height: number }
  rotation: number
  opacity: number
  properties?: { text?: string }
}

// Zustand → Fabric
// DesignElement → Fabric Object (Textbox, Rect, Circle, FabricImage)
```

---

## 🎯 Phase 3: Interactions (À FAIRE)

### Outils
- [ ] Pointer (select, move)
- [ ] Text (add/edit)
- [ ] Rectangle (create)
- [ ] Circle (create)
- [ ] Image (upload + place)
- [ ] QR Code (generate)
- [ ] Layers (z-index)

### Events
- [ ] `object:moving` → live update
- [ ] `object:scaling` → live update
- [ ] `object:rotating` → live update
- [ ] `object:selected` → highlight
- [ ] `selection:cleared` → deselect

---

## 🔧 Phase 4: Advanced Features (À FAIRE)

- [ ] Group/ungroup objects
- [ ] Align/distribute
- [ ] Snapping to grid
- [ ] Keyboard shortcuts (delete, escape)
- [ ] Undo/Redo with Fabric history
- [ ] Export to PDF/PNG

---

## 📊 Estimation Restante

| Phase | Est. Time | Priority | Status |
|-------|-----------|----------|--------|
| Phase 2: Sync | 8-12h | High | ✅ **COMPLÈTE** |
| Phase 3: Interactions | 6-8h | High | ⏳ À faire |
| Phase 4: Advanced | 8-10h | Medium | ⏳ À faire |

**Total Restant:** 14-18h

---

## 🧪 Tests à Effectuer

1. ✅ Canvas renders
2. ⏳ Add text element (via toolbar)
3. ✅ Move element (sync to store)
4. ✅ Resize element (sync to store)
5. ✅ Switch recto/verso (loads elements)
6. ✅ Delete element (keyboard)
7. ⏳ Undo/Redo (store handles)
8. ⏳ Export PDF/PNG

---

**Next Update:** Après Phase 3 (Interactions)

