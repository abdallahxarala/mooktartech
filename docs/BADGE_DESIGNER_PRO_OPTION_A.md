# Badge Designer Pro - Option A : Store + Export PDF

## 🎯 Objectif

Implémenter les fonctionnalités PRO pour rendre le Badge Designer utilisable immédiatement :
1. ✅ Connecter canvas Fabric.js au store Zustand (synchronisation bidirectionnelle)
2. ✅ Sauvegarder éléments (persist)
3. ✅ Export PDF fonctionnel
4. ✅ Export PNG
5. ✅ Undo/Redo (déjà dans le store, à vérifier)

---

## 📋 Plan d'implémentation

### Étape 1 : Connecter Canvas au Store (PRIORITÉ 1)

**Fichier :** `components/card-designer/card-designer-canvas-fabric.tsx`

**Actions :**
- Lire les éléments depuis le store (`currentProject.recto.elements` ou `verso.elements`)
- Créer les objets Fabric.js à partir des éléments du store
- Écouter les modifications Fabric.js et mettre à jour le store
- Écouter les changements du store et mettre à jour Fabric.js (éviter les boucles)

**Synchronisation bidirectionnelle :**
```
Fabric.js Canvas ←→ Zustand Store
   (modifications)      (source of truth)
```

### Étape 2 : Export PNG

**Fichier :** `lib/utils/canvas-export.ts` (nouveau)

**Méthode :**
- Utiliser `canvas.toDataURL('image/png')`
- Utiliser `canvas.toBlob()` pour meilleure qualité
- Télécharger avec `downloadFile()` (déjà existant)

### Étape 3 : Export PDF

**Fichier :** `lib/utils/canvas-export.ts`

**Méthode :**
- Utiliser jsPDF (déjà installé : `jspdf: ^3.0.3`)
- Convertir canvas en image
- Ajouter au PDF avec dimensions correctes (mm)
- Télécharger

### Étape 4 : Vérifier Undo/Redo

**Fichier :** `lib/store/card-designer-store.ts`

**Actions :**
- Vérifier que l'historique fonctionne correctement
- S'assurer que les modifications Fabric.js sont bien dans l'historique
- Tester undo/redo avec plusieurs actions

---

## 🛠️ Technologies utilisées

- **Fabric.js** : Canvas interactif
- **Zustand** : Store state management (avec persist)
- **jsPDF** : Export PDF (déjà installé)
- **Canvas API** : Export PNG natif

---

## 📁 Fichiers à modifier/créer

1. `components/card-designer/card-designer-canvas-fabric.tsx` - Connexion au store
2. `lib/utils/canvas-export.ts` - Nouveau fichier pour exports
3. `lib/store/card-designer-store.ts` - Vérifier historiques
4. `components/card-designer/card-designer-header.tsx` - Boutons export (si nécessaire)

---

## ✅ Checklist

- [ ] Canvas lit les éléments du store
- [ ] Modifications Fabric.js → Store
- [ ] Modifications Store → Fabric.js (sans boucle)
- [ ] Export PNG fonctionnel
- [ ] Export PDF fonctionnel
- [ ] Undo/Redo testé et fonctionnel
- [ ] Persistance localStorage testée

---

*Dernière mise à jour : $(date)*

