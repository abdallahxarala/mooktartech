# Plan de Restauration du Panier

## 📋 Diagnostic

### Problème Identifié
Il existe **3 systèmes de panier différents** qui créent des conflits :

1. **`lib/store/cart-store.ts`** ✅ **SYSTÈME PRINCIPAL (FONCTIONNEL)**
   - Utilisé par `app/[locale]/cart/page.tsx`
   - Interface : `CartItem { product: Product, quantity: number }`
   - Export : `useCartStore`
   - **C'est celui qui fonctionne actuellement**

2. **`lib/store/cart.ts`** ❌ **CONFLIT**
   - Même nom d'export : `useCartStore` (CONFLIT avec #1)
   - Interface différente : `CartItem { id, name, price, quantity, image }`
   - **DOIT ÊTRE SUPPRIMÉ ou renommé**

3. **`lib/hooks/use-cart.ts`** ⚠️ **SYSTÈME ALTERNATIF**
   - Export : `useCart`
   - Utilisé par `components/cart/mini-cart.tsx`
   - Interface différente : `CartItem { id, name, price, quantity, image, maxQuantity? }`
   - **DOIT ÊTRE UNIFIÉ avec le système principal**

### Fichiers Affectés

#### Fichiers qui utilisent le BON système :
- ✅ `app/[locale]/cart/page.tsx` → utilise `useCartStore` de `cart-store.ts`

#### Fichiers qui utilisent d'autres systèmes :
- ❌ `components/cart/cart.tsx` → utilise `useAppStore` (fonctions vides)
- ⚠️ `components/cart/mini-cart.tsx` → utilise `useCart` de `use-cart.ts`
- ❌ `app/[locale]/cart/cartClient.tsx` → composant vide (non utilisé)

---

## 🎯 Plan de Restauration

### ÉTAPE 1 : Vérifier l'historique Git

```bash
git log --oneline --graph --all -30
```

**Identifier le dernier commit où le panier fonctionnait complètement.**

---

### ÉTAPE 2 : Nettoyer les Conflits

#### 2.1 Supprimer ou Renommer `lib/store/cart.ts`

**Option A : Supprimer complètement** (recommandé si non utilisé)
```bash
git rm lib/store/cart.ts
```

**Option B : Renommer pour éviter le conflit**
```bash
git mv lib/store/cart.ts lib/store/cart-legacy.ts
```

#### 2.2 Unifier `components/cart/mini-cart.tsx`

**Problème** : `mini-cart.tsx` utilise `useCart` de `lib/hooks/use-cart.ts` qui a une interface différente.

**Solution** : Modifier `mini-cart.tsx` pour utiliser `useCartStore` de `cart-store.ts`

**Modifications nécessaires** :
- Remplacer `import { useCart } from '@/lib/hooks/use-cart'` par `import { useCartStore } from '@/lib/store/cart-store'`
- Adapter l'interface `CartItem` (utiliser `item.product` au lieu de `item` directement)
- Adapter les appels de fonctions

#### 2.3 Corriger `components/cart/cart.tsx`

**Problème** : `cart.tsx` utilise `useAppStore` avec des fonctions vides.

**Solution** : 
- Option A : Supprimer le fichier s'il n'est pas utilisé
- Option B : Le modifier pour utiliser `useCartStore` de `cart-store.ts`

---

### ÉTAPE 3 : Restaurer depuis Git (si nécessaire)

Si vous avez identifié un commit où tout fonctionnait :

```bash
# Restaurer le dossier cart complet
git checkout <commit-hash> -- app/[locale]/cart/

# Restaurer le store principal
git checkout <commit-hash> -- lib/store/cart-store.ts

# Restaurer les composants cart
git checkout <commit-hash> -- components/cart/
```

**Vérifier les changements** :
```bash
git status
```

---

### ÉTAPE 4 : Vérifier les Dépendances

#### 4.1 Vérifier les imports dans tous les fichiers

```bash
# Chercher tous les usages de useCartStore, useCart, useAppStore
grep -r "useCartStore\|useCart\|useAppStore" app/ components/ lib/
```

#### 4.2 Identifier les fichiers à modifier

**Fichiers à modifier** :
1. `components/cart/mini-cart.tsx` → utiliser `useCartStore` de `cart-store.ts`
2. `components/cart/cart.tsx` → utiliser `useCartStore` ou supprimer
3. Vérifier tous les autres fichiers qui importent des stores de panier

---

### ÉTAPE 5 : Tester

#### 5.1 Lancer le serveur
```bash
npm run dev
```

#### 5.2 Tests à effectuer

1. **Page Panier** : `/fr/cart`
   - ✅ Affiche les articles du panier
   - ✅ Permet de modifier les quantités
   - ✅ Permet de supprimer des articles
   - ✅ Affiche le total correctement
   - ✅ Bouton "Passer la commande" fonctionne

2. **Mini Panier** : (si présent dans le header)
   - ✅ Affiche le nombre d'articles
   - ✅ S'ouvre au clic
   - ✅ Affiche les articles
   - ✅ Permet de modifier les quantités
   - ✅ Permet de supprimer des articles

3. **Ajout au panier** : Depuis la page produits
   - ✅ Ajoute un produit au panier
   - ✅ Met à jour le compteur
   - ✅ Persiste dans localStorage

---

## 🔧 Actions Immédiates (Sans Git)

Si vous ne pouvez pas utiliser Git ou si vous voulez restaurer manuellement :

### 1. Identifier le système correct

Le système **FONCTIONNEL** est :
- **Store** : `lib/store/cart-store.ts`
- **Page** : `app/[locale]/cart/page.tsx`
- **Interface** : `CartItem { product: Product, quantity: number }`

### 2. Supprimer les fichiers en conflit

```bash
# Supprimer le store en conflit
rm lib/store/cart.ts

# OU le renommer
mv lib/store/cart.ts lib/store/cart-legacy.ts
```

### 3. Unifier les composants

**Modifier `components/cart/mini-cart.tsx`** :

```typescript
// AVANT
import { useCart } from '@/lib/hooks/use-cart'

// APRÈS
import { useCartStore } from '@/lib/store/cart-store'

// Adapter les accès :
// AVANT : item.id, item.name, item.price, item.image
// APRÈS : item.product.id, item.product.name, item.product.price, item.product.mainImage
```

**Modifier `components/cart/cart.tsx`** :

```typescript
// AVANT
import { useAppStore } from '@/lib/store/app-store'

// APRÈS
import { useCartStore } from '@/lib/store/cart-store'

// Remplacer toutes les références
```

---

## 📝 Checklist de Restauration

- [ ] Vérifier l'historique Git (identifier le bon commit)
- [ ] Supprimer/renommer `lib/store/cart.ts` (conflit de nom)
- [ ] Modifier `components/cart/mini-cart.tsx` pour utiliser `useCartStore`
- [ ] Modifier `components/cart/cart.tsx` pour utiliser `useCartStore` ou supprimer
- [ ] Vérifier tous les imports de stores de panier
- [ ] Tester la page `/fr/cart`
- [ ] Tester le mini panier (si présent)
- [ ] Tester l'ajout au panier depuis les produits
- [ ] Vérifier la persistance dans localStorage
- [ ] Vérifier qu'il n'y a pas d'erreurs dans la console

---

## 🚨 Problèmes Potentiels

### 1. Conflit de nom `useCartStore`

**Problème** : `lib/store/cart.ts` et `lib/store/cart-store.ts` exportent tous les deux `useCartStore`.

**Solution** : Supprimer ou renommer `lib/store/cart.ts`.

### 2. Interface `CartItem` différente

**Problème** : Les différents stores utilisent des interfaces `CartItem` différentes.

**Solution** : Standardiser sur l'interface de `cart-store.ts` :
```typescript
interface CartItem {
  product: Product
  quantity: number
}
```

### 3. Persistance localStorage

**Problème** : Plusieurs stores utilisent le même nom `'cart-storage'` pour le localStorage.

**Solution** : S'assurer que seul `cart-store.ts` utilise `'cart-storage'`. Les autres stores doivent utiliser des noms différents ou être supprimés.

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Partager les erreurs de la console** (F12 → Console)
2. **Partager les logs Git** : `git log --oneline -20`
3. **Identifier quels fichiers utilisent quel store** : 
   ```bash
   grep -r "from.*cart-store" app/ components/
   grep -r "from.*use-cart" app/ components/
   grep -r "from.*cart'" app/ components/
   ```

---

## ✅ Résultat Attendu

Après restauration, vous devriez avoir :

1. **Un seul store de panier** : `lib/store/cart-store.ts`
2. **Une seule interface** : `CartItem { product: Product, quantity: number }`
3. **Tous les composants utilisent le même store** : `useCartStore` de `cart-store.ts`
4. **Le panier fonctionne** : ajout, modification, suppression, persistance
5. **Pas de conflits** : pas d'erreurs TypeScript, pas d'erreurs runtime

---

**Date de création** : $(date)
**Dernière mise à jour** : $(date)

