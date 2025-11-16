# Canvas Actuel - Analyse Technique

**Date**: 2025-01-27  
**Auteur**: Analyse Technique  
**Version**: 1.0

---

## 📊 Technology Stack

### Canvas Principal
- **Technologie**: HTML5 Canvas via **Fabric.js v6.7.1** ✅
- **Composant Actif**: `CardDesignerCanvasFabric` (déjà intégré)
- **Composant Legacy**: `SimpleCanvasTest` (preview HTML statique, non interactif)

### État Actuel
```
✅ Fabric.js installé et intégré
✅ Composant CardDesignerCanvasFabric créé
❌ SimpleCanvasTest encore utilisé dans cardDesignerClient.tsx (ligne 161)
❌ CardDesignerCanvasFabric non utilisé actuellement
```

---

## 🎨 Rendering

### Comment les éléments sont dessinés ?

**Fabric.js (CardDesignerCanvasFabric)**:
- Utilise `Canvas`, `Textbox`, `Rect`, `Circle`, `FabricImage` de Fabric.js
- Bidirectional sync avec Zustand store
- Event listeners pour `selection:created/updated/cleared`, `object:modified`, `object:moving`
- Support keyboard events (Delete/Backspace)

**SimpleCanvasTest (Legacy)**:
- HTML statique avec CSS
- Pas de manipulation programmatique
- Juste une preview visuelle

### Comment le texte est géré ?

**Fabric.js**:
- `Textbox` objects avec propriétés: `fontSize`, `fontFamily`, `fill`, `width`
- Support rotation, opacity, locking
- Éditable directement sur canvas

**Legacy**:
- Texte statique en HTML

### Comment les images sont chargées ?

**Fabric.js**:
- `FabricImage.fromURL()` pour charger images
- Support crop, resize, rotation

**Legacy**:
- Pas d'images

---

## 📤 Export

### Méthode utilisée pour PDF

**Module**: `lib/export/canvas-exporter.ts`

```typescript
exportCanvasToPDF(canvas: Canvas, format: 'credit-card' | 'a4' | 'custom')
```

- Utilise `jsPDF` pour générer PDF
- Support formats: credit-card (CR80), A4, custom
- Qualité paramétrable (dpi)
- Export batch multi-pages

### Méthode pour PNG

```typescript
exportCanvasToPNG(canvas: Canvas, quality?: number, backgroundColor?: string)
```

- Utilise `canvas.toDataURL()` de Fabric.js
- Qualité 0-1 paramétrable
- Support background color

### Qualité des exports

- ✅ **PDF**: Haute qualité, formats standardisés
- ✅ **PNG**: Paramétrable, support transparence
- ✅ **JPG**: Paramétrable, compression

---

## 🔧 Manipulation Programmatique

### Peut-on changer un texte via code ?

**Fabric.js**: ✅ **OUI**
```typescript
const textObject = canvas.getActiveObject() as Textbox
textObject.set('text', 'Nouveau texte')
canvas.renderAll()
```

### Peut-on générer 100 badges en batch ?

**Actuellement**: ❌ **NON** (pas encore implémenté)
- Export batch existe (`batchExportPDF`)
- Mais génération avec variables différentes pas encore faite
- **Nécessaire**: Loop sur données CSV + remplacement variables

### API disponible ?

**Via ref**:
```typescript
interface CardDesignerCanvasFabricRef {
  getCanvas: () => Canvas | null
  addText: (text: string, x: number, y: number) => void
  addRectangle: (x: number, y: number, width: number, height: number) => void
  addCircle: (x: number, y: number, radius: number) => void
  clearCanvas: () => void
}
```

---

## 📝 Variables

### Y a-t-il déjà un système de variables ?

**Maintenant**: ✅ **OUI** (ajouté aujourd'hui)

**Store** (`lib/store/card-designer-store.ts`):
- `VariableDefinition[]` dans `CardProject`
- `DEFAULT_VARIABLES` avec nom, email, entreprise, etc.
- Actions: `addVariable`, `removeVariable`, `updateVariable`, `initializeProjectVariables`

**Utilitaires** (`lib/utils/variable-replacer.ts`):
- `detectVariables(text)` → `["nom", "email"]`
- `replaceVariables(text, data)` → `"Bonjour John Doe"`
- `hasVariables(text)` → `true/false`
- `getPreviewText(text, sampleData)`

### Comment {nom} serait remplacé ?

**Processus**:
1. Détecter variables dans texte: `detectVariables("Bonjour {nom}")` → `["nom"]`
2. Charger données depuis CSV/API ou manual
3. Remplacer: `replaceVariables(text, { nom: "John Doe" })` → `"Bonjour John Doe"`
4. Mettre à jour canvas: `textObject.set('text', newText)`

**Mode Preview**:
- Toggle preview mode dans canvas
- Variables remplacées en temps réel
- Données test par défaut

---

## 🎯 Conclusion

### Faut-il intégrer Fabric.js ?

**Réponse**: ✅ **DÉJÀ FAIT, MAIS PAS UTILISÉ**

**Problème actuel**:
- `CardDesignerCanvasFabric` existe et fonctionne
- Mais `cardDesignerClient.tsx` utilise encore `SimpleCanvasTest`
- **Solution**: Remplacer `SimpleCanvasTest` par `CardDesignerCanvasFabric`

### Ou améliorer l'existant suffit ?

**Recommandation**: **UTILISER FABRIC.JS DÉJÀ CRÉÉ**

**Avantages Fabric.js**:
- ✅ Manipulation programmatique complète
- ✅ Export de qualité
- ✅ Support variables (à ajouter dans render)
- ✅ Batch generation possible
- ✅ API propre via ref

**Actions nécessaires**:
1. ✅ Store variables (fait)
2. ✅ Utilitaires variables (fait)
3. ⏳ Ajouter preview mode dans `CardDesignerCanvasFabric`
4. ⏳ Remplacer `SimpleCanvasTest` par `CardDesignerCanvasFabric` dans `cardDesignerClient.tsx`
5. ⏳ Créer panel Variables UI
6. ⏳ Tester batch generation

---

## 📋 Checklist Technique

### ✅ Fait
- [x] Fabric.js installé
- [x] CardDesignerCanvasFabric créé
- [x] Export PDF/PNG/JPG fonctionnel
- [x] Store avec variables
- [x] Utilitaires variable-replacer

### ⏳ À faire
- [ ] Intégrer CardDesignerCanvasFabric dans cardDesignerClient
- [ ] Ajouter preview mode dans canvas
- [ ] Créer panel Variables UI
- [ ] Tester remplacement variables dans texte
- [ ] Implémenter batch generation avec CSV

---

## 🚀 Prochaines Étapes

1. **Phase 2D.1**: Intégrer preview mode dans `CardDesignerCanvasFabric`
2. **Phase 2D.2**: Créer panel Variables UI
3. **Phase 2D.3**: Remplacer SimpleCanvasTest par CardDesignerCanvasFabric
4. **Phase 2D.4**: Tester variables dans preview
5. **Phase 2E**: Templates Gallery
6. **Phase 3**: Event Management

---

**Conclusion Finale**: Fabric.js est déjà intégré et prêt. Il faut juste l'utiliser à la place de SimpleCanvasTest et ajouter le support des variables dans le rendu.

