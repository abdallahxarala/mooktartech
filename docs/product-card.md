# Composant ProductCard - Xarala Solutions

## Vue d'ensemble

Le composant ProductCard de Xarala Solutions affiche les informations d'un produit dans une carte interactive avec animations, interactions et gestion d'état. Il intègre la navigation, l'ajout au panier, et les filtres par catégorie.

## Fonctionnalités

### 🏷️ Affichage des informations
- **Image produit** : Next/Image avec placeholder et zoom au hover
- **Badge catégorie** : Cliquable pour filtrer par catégorie
- **Badge stock** : "Stock limité" si < 10, "Rupture de stock" si = 0
- **Nom du produit** : 2 lignes max avec ellipsis
- **Description** : 3 lignes max avec ellipsis
- **Prix** : Formaté en XOF (ex: 450 000 XOF)

### 🎨 Design et animations
- **Card moderne** : Bordure subtile avec élévation au hover
- **Hover effects** : Scale de l'image, apparition des boutons
- **Transitions fluides** : Durée de 300ms pour toutes les animations
- **Responsive** : S'adapte à toutes les tailles d'écran

### 🔄 Interactions
- **Clic sur la carte** : Navigation vers `/products/[id]`
- **Clic sur catégorie** : Filtre par catégorie via le store
- **Bouton panier** : Ajout au panier avec toast de confirmation
- **Bouton détails** : Navigation vers la page produit

## Interface

### Props

```typescript
interface ProductCardProps {
  product: Product                    // Produit à afficher
  onAddToCart?: (product: Product) => void  // Callback optionnel pour ajout au panier
  className?: string                 // Classes CSS supplémentaires
}
```

### Interface Product

```typescript
interface Product {
  id: string                         // ID unique
  name: string                       // Nom du produit
  description: string                // Description
  price: number                      // Prix en XOF
  category: string                   // Catégorie
  image_url: string                  // URL de l'image
  stock: number                      // Quantité en stock
  specifications: Record<string, string>  // Spécifications
  is_active: boolean                 // Produit actif
  created_at: string                 // Date de création
}
```

## Utilisation

### Import et utilisation basique

```tsx
import ProductCard from '@/components/products/product-card'
import { Product } from '@/lib/store/products-store'

function ProductsList() {
  const product: Product = {
    id: 'prod_123',
    name: 'Carte PVC Premium',
    description: 'Carte PVC de haute qualité pour identification professionnelle',
    price: 2500,
    category: 'pvc-cards',
    image_url: '/images/pvc-card-premium.jpg',
    stock: 15,
    specifications: { 'Matériau': 'PVC 0.76mm' },
    is_active: true,
    created_at: '2024-01-15T10:30:00Z'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ProductCard product={product} />
    </div>
  )
}
```

### Avec callback d'ajout au panier

```tsx
import ProductCard from '@/components/products/product-card'
import { useCartStore } from '@/lib/store/cart-store'

function ProductsList() {
  const { addToCart } = useCartStore()

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
    // Logique supplémentaire si nécessaire
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  )
}
```

### Avec classes personnalisées

```tsx
<ProductCard 
  product={product} 
  className="hover:scale-105 transition-transform"
/>
```

## Structure du composant

### Layout principal

```tsx
<motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.2 }}
  className="group cursor-pointer"
  onClick={handleCardClick}
>
  <Card className="h-full overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
    <CardContent className="p-0">
      {/* Image + Badges + Actions */}
      {/* Contenu de la carte */}
    </CardContent>
  </Card>
</motion.div>
```

### Section image

```tsx
<div className="relative aspect-square overflow-hidden bg-gray-100">
  <Image
    src={product.image_url || '/placeholder-product.jpg'}
    alt={product.name}
    fill
    className="object-cover group-hover:scale-105 transition-transform duration-300"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
  
  {/* Badges et actions */}
</div>
```

### Section contenu

```tsx
<div className="p-4 space-y-3">
  {/* Nom du produit */}
  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
    {product.name}
  </h3>

  {/* Description */}
  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
    {product.description}
  </p>

  {/* Prix et stock */}
  <div className="flex items-center justify-between">
    <div className="text-lg font-bold text-primary-600">
      {formatPrice(product.price)}
    </div>
    <div className="text-xs text-gray-500">
      {product.stock} en stock
    </div>
  </div>

  {/* Boutons d'action */}
  <div className="flex gap-2 pt-2">
    <Button className="flex-1" onClick={handleDetailsClick}>
      Voir détails
    </Button>
    <Button size="sm" variant="outline" onClick={handleAddToCart}>
      <ShoppingCart className="h-4 w-4" />
    </Button>
  </div>
</div>
```

## Gestion des états

### États du produit

```typescript
const isInStock = product.stock > 0
const isLowStock = product.stock > 0 && product.stock < 10
const isOutOfStock = product.stock === 0
```

### Badges conditionnels

```tsx
{/* Badge stock limité */}
{isLowStock && (
  <Badge variant="destructive" className="text-xs">
    Stock limité
  </Badge>
)}

{/* Badge rupture de stock */}
{isOutOfStock && (
  <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
    Rupture de stock
  </Badge>
)}
```

### États de chargement

```tsx
const [isAddingToCart, setIsAddingToCart] = useState(false)

// Animation de chargement
{isAddingToCart ? (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <Package className="h-4 w-4" />
  </motion.div>
) : (
  <ShoppingCart className="h-4 w-4" />
)}
```

## Animations Framer Motion

### Animation de la carte

```tsx
<motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.2 }}
  className="group cursor-pointer"
>
```

### Animation des boutons d'action

```tsx
<motion.div 
  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
  initial={{ opacity: 0, scale: 0.8 }}
  whileHover={{ opacity: 1, scale: 1 }}
>
```

### Animation de chargement

```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
>
  <Package className="h-4 w-4" />
</motion.div>
```

## Gestion des événements

### Clic sur la carte

```tsx
const handleCardClick = () => {
  router.push(`/products/${product.id}`)
}
```

### Clic sur la catégorie

```tsx
const handleCategoryClick = (e: React.MouseEvent) => {
  e.stopPropagation()
  setCategory(product.category)
}
```

### Ajout au panier

```tsx
const handleAddToCart = async (e: React.MouseEvent) => {
  e.stopPropagation()
  
  if (isOutOfStock) return

  setIsAddingToCart(true)
  
  try {
    if (onAddToCart) {
      onAddToCart(product)
    }

    toast({
      title: 'Produit ajouté au panier',
      description: `${product.name} a été ajouté à votre panier`,
      variant: 'default'
    })

    await new Promise(resolve => setTimeout(resolve, 500))
    
  } catch (error) {
    toast({
      title: 'Erreur',
      description: 'Impossible d\'ajouter le produit au panier',
      variant: 'destructive'
    })
  } finally {
    setIsAddingToCart(false)
  }
}
```

## Formatage des données

### Prix en XOF

```tsx
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Exemple: 2500 → "2 500 XOF"
```

### Limitation du texte

```css
/* 2 lignes max pour le nom */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 3 lignes max pour la description */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## Design System

### Couleurs utilisées

```css
/* Couleurs principales */
.text-primary-600     /* Prix et hover */
.text-gray-900        /* Nom du produit */
.text-gray-600        /* Description */
.text-gray-500        /* Stock */

/* Badges */
.bg-destructive       /* Stock limité */
.bg-secondary         /* Catégorie */
.bg-gray-100          /* Rupture de stock */

/* Bordures */
.border-gray-200      /* Bordure normale */
.border-gray-300      /* Bordure hover */
```

### Espacement

```css
/* Padding de la carte */
.p-4                  /* Contenu principal */
.space-y-3            /* Espacement vertical */
.gap-2                /* Espacement entre boutons */

/* Marges des badges */
.top-3 .left-3        /* Badge catégorie */
.top-3 .right-3       /* Badge stock */
```

### Typographie

```css
/* Nom du produit */
.font-semibold .text-base .leading-tight

/* Description */
.text-sm .text-gray-600 .leading-relaxed

/* Prix */
.text-lg .font-bold .text-primary-600
```

## Responsive Design

### Breakpoints

```css
/* Mobile (par défaut) */
grid-cols-1

/* Tablet (md) */
md:grid-cols-2

/* Desktop (lg) */
lg:grid-cols-3
```

### Adaptations

- **Image** : Aspect ratio carré maintenu
- **Texte** : Limitation des lignes respectée
- **Boutons** : Taille adaptée à l'écran
- **Espacement** : Padding et margins optimisés

## Accessibilité

### ARIA Labels

```tsx
<Button
  aria-label="Voir les détails"
  onClick={handleDetailsClick}
>
  <Eye className="h-4 w-4" />
</Button>

<Button
  aria-label="Ajouter au panier"
  onClick={handleAddToCart}
>
  <ShoppingCart className="h-4 w-4" />
</Button>
```

### Navigation clavier

- **Tab** : Navigation entre les éléments interactifs
- **Enter** : Activation des boutons
- **Espace** : Activation des boutons
- **Focus visible** : Indicateurs de focus

### Contraste

- **Texte** : Contraste élevé sur fond blanc
- **Boutons** : Couleurs contrastées
- **Badges** : Couleurs distinctes selon l'état

## Performance

### Optimisations

- **Image lazy loading** : `priority={false}`
- **Sizes responsive** : Optimisation des tailles d'image
- **Memoization** : Composant mémorisé si nécessaire
- **Event delegation** : Gestion efficace des événements

### Métriques attendues

- **First Contentful Paint** : < 0.5s
- **Largest Contentful Paint** : < 1.0s
- **Cumulative Layout Shift** : < 0.05
- **Time to Interactive** : < 1.0s

## Tests

### Tests unitaires

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '@/components/products/product-card'

describe('ProductCard', () => {
  const mockProduct = {
    id: 'prod_123',
    name: 'Test Product',
    description: 'Test Description',
    price: 2500,
    category: 'pvc-cards',
    image_url: '/test-image.jpg',
    stock: 10,
    specifications: {},
    is_active: true,
    created_at: '2024-01-15T10:30:00Z'
  }

  test('should render product information', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('2 500 XOF')).toBeInTheDocument()
  })

  test('should handle card click', () => {
    const mockPush = jest.fn()
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush })
    }))

    render(<ProductCard product={mockProduct} />)
    
    fireEvent.click(screen.getByRole('button', { name: /voir détails/i }))
    expect(mockPush).toHaveBeenCalledWith('/products/prod_123')
  })

  test('should show low stock badge', () => {
    const lowStockProduct = { ...mockProduct, stock: 5 }
    render(<ProductCard product={lowStockProduct} />)
    
    expect(screen.getByText('Stock limité')).toBeInTheDocument()
  })
})
```

### Tests d'intégration

- **Navigation** : Vérification des liens
- **Filtres** : Test du clic sur catégorie
- **Panier** : Test de l'ajout au panier
- **Toast** : Vérification des notifications

## Dépannage

### Problèmes courants

1. **Image ne s'affiche pas**
   ```tsx
   // Vérifier le placeholder
   <Image
     src={product.image_url || '/placeholder-product.jpg'}
     alt={product.name}
   />
   ```

2. **Animations ne fonctionnent pas**
   ```tsx
   // Vérifier Framer Motion
   import { motion } from 'framer-motion'
   ```

3. **Toast ne s'affiche pas**
   ```tsx
   // Vérifier le hook useToast
   const { toast } = useToast()
   ```

4. **Navigation ne fonctionne pas**
   ```tsx
   // Vérifier useRouter
   import { useRouter } from 'next/navigation'
   ```

## Support

Pour toute question ou problème :

1. Vérifier la documentation Framer Motion
2. Consulter les logs de la console
3. Tester avec les exemples fournis
4. Créer une issue avec les détails du problème
