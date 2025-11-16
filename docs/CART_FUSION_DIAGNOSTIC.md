# Diagnostic : Fusion Incorrecte des Produits dans le Panier

## 📋 ÉTAPE 1 : Analyse de la fonction addItem

### Fonction addItem complète (lib/store/cart-store.ts)

```typescript
addItem: (item) => {
  set((state) => {
    // Chercher item identique par productId ET options
    const existingItem = state.items.find(
      (i) => 
        i.productId === item.productId &&
        JSON.stringify(i.options || {}) === JSON.stringify(item.options || {})
    )
    
    if (existingItem) {
      // Augmenter quantité de l'item existant
      return {
        items: state.items.map((i) =>
          i.id === existingItem.id
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        ),
      }
    }
    
    // Ajouter nouveau item
    const id = crypto.randomUUID()
    return {
      items: [...state.items, { ...item, id, quantity: item.quantity || 1 }],
    }
  })
}
```

### Critères de comparaison
- ✅ **productId** : Comparé avec `i.productId === item.productId`
- ✅ **options** : Comparé avec `JSON.stringify(i.options || {}) === JSON.stringify(item.options || {})`
- ✅ **Logique** : Fusionne seulement si `productId` ET `options` sont identiques

---

## 🔍 ÉTAPE 2 : Vérification des appels à addItem

### Fichiers trouvés qui appellent addItem :

#### 1. ✅ `components/products/catalog.tsx` (CORRECT)
```typescript
onAddToCart({
  productId: product.id,  // ✅ Utilise productId
  name: product.name,
  price: product.price,
  quantity: 1,
  image: product.mainImage || product.images?.[0],
  brand: product.brand,
  slug: product.slug,
  shortDescription: product.shortDescription,
  stock: product.stock,
  mainImage: product.mainImage,
})
```
**Status** : ✅ CORRECT - Utilise `productId: product.id`

#### 2. ❌ `components/ui/product-card.tsx` (PROBLÈME TROUVÉ !)
```typescript
import { useCartStore } from "@/lib/store/cart";  // ❌ MAUVAIS IMPORT

addItem({
  id: Math.random(),  // ❌ Utilise 'id' au lieu de 'productId'
  name,
  price,
  quantity: 1,
  image,
})
```
**Status** : ❌ **PROBLÈME MAJEUR**
- Importe depuis `@/lib/store/cart` (ancien store) au lieu de `@/lib/store/cart-store`
- Utilise `id: Math.random()` au lieu de `productId`
- Manque `productId`, donc tous les produits de ce composant auront `productId: undefined`
- **Résultat** : Tous les produits de ce composant seront fusionnés car `undefined === undefined`

---

## 🐛 PROBLÈME IDENTIFIÉ

### Cause racine
Le fichier `components/ui/product-card.tsx` :
1. Importe le **mauvais store** (`@/lib/store/cart` au lieu de `@/lib/store/cart-store`)
2. N'envoie **pas de `productId`** (utilise `id: Math.random()`)
3. Tous les items ajoutés via ce composant ont `productId: undefined`
4. La fonction `addItem` compare `undefined === undefined` → **TOUS fusionnent**

### Impact
- ✅ Produits ajoutés via `components/products/catalog.tsx` → Fonctionnent correctement
- ❌ Produits ajoutés via `components/ui/product-card.tsx` → Fusionnent tous ensemble

---

## 🔧 SOLUTION

### Correction nécessaire dans `components/ui/product-card.tsx` :

1. **Corriger l'import** :
```typescript
// AVANT
import { useCartStore } from "@/lib/store/cart";

// APRÈS
import { useCartStore } from "@/lib/store/cart-store";
```

2. **Corriger l'appel addItem** :
```typescript
// AVANT
addItem({
  id: Math.random(),
  name,
  price,
  quantity: 1,
  image,
})

// APRÈS
addItem({
  productId: `product-${name}-${price}`, // Générer un ID unique basé sur name+price
  name,
  price,
  quantity: 1,
  image,
})
```

**OU** si ce composant reçoit un `product` en props :
```typescript
interface ProductCardProps {
  product?: { id: string, name: string, price: number, image: string }
  name: string;
  price: number;
  image: string;
  bgColor: "orange" | "purple";
}

addItem({
  productId: product?.id || `product-${name}-${price}`,
  name,
  price,
  quantity: 1,
  image,
})
```

---

## 📊 ÉTAPE 3 : Logs de debug ajoutés

Des logs de debug ont été ajoutés dans `lib/store/cart-store.ts` :

- 🛒 Log quand un item est ajouté
- 📦 Log des items existants avant ajout
- 🔍 Log de chaque comparaison (productId et options)
- ✅ Log si item existant trouvé (incrément quantité)
- ➕ Log si nouvel item ajouté
- ✅ Log des items finaux après ajout

---

## 🧪 ÉTAPE 4 : Instructions de test

### 1. Vider le panier
```javascript
// Dans la console du navigateur (F12)
localStorage.clear()
// OU
localStorage.removeItem('cart-storage')
```

### 2. Ajouter 3 produits différents
- Via la page produits (`/fr/products`)
- Via `components/ui/product-card.tsx` si utilisé

### 3. Ouvrir Console (F12)
- Chercher les logs avec 🛒, 📦, 🔍, ✅, ➕

### 4. Vérifier les logs
- **Si productId est `undefined`** → Problème identifié
- **Si productId est identique pour produits différents** → Problème identifié
- **Si options sont différentes mais fusionnent quand même** → Problème identifié

### 5. Rapporter
- Copier TOUS les logs console
- Screenshot du panier
- Liste des produits ajoutés

---

## ✅ PROCHAINES ÉTAPES

1. **Corriger `components/ui/product-card.tsx`** (import + productId)
2. **Tester avec les logs**
3. **Vérifier que chaque produit a un `productId` unique**
4. **Retirer les logs de debug une fois le problème résolu**

---

**Date** : $(date)
**Status** : 🐛 Problème identifié - Correction nécessaire

