# Page de Détail du Produit - Xarala Solutions

## Vue d'ensemble

La page de détail du produit de Xarala Solutions offre une expérience immersive et interactive pour découvrir et acheter les solutions d'identification professionnelle. Elle utilise le SSR pour les performances, des animations fluides, et une gestion d'état complète.

## Fonctionnalités

### 🖼️ Galerie d'images interactive
- **Image principale** : Affichage en grand format avec zoom au hover
- **Miniatures** : 4 images maximum avec navigation
- **Navigation** : Boutons précédent/suivant au hover
- **Responsive** : Adaptation à toutes les tailles d'écran

### 📋 Informations produit complètes
- **Breadcrumb** : Navigation Accueil > Produits > Catégorie > Nom
- **Badge catégorie** : Cliquable pour filtrer par catégorie
- **Nom du produit** : Titre principal (h1)
- **Prix** : Affichage en grand format en XOF
- **Badge stock** : États visuels (En stock, Stock limité, Rupture)

### 🛒 Gestion du panier
- **Sélecteur quantité** : Boutons +/- avec limites
- **Ajout au panier** : Bouton principal avec animation
- **Favoris** : Bouton secondaire avec icône cœur
- **Toast notifications** : Confirmation des actions

### 📱 Partage social
- **Réseaux sociaux** : Facebook, Twitter, LinkedIn
- **Email** : Partage par email
- **Copie de lien** : Copie dans le presse-papiers
- **Feedback visuel** : Confirmation des actions

### 🔧 Spécifications techniques
- **Tableau** : 2 colonnes (Caractéristique | Valeur)
- **Style alterné** : Lignes avec couleurs différentes
- **Responsive** : Adaptation mobile

### 🔄 Produits similaires
- **Carrousel** : 4 produits maximum
- **Navigation** : Flèches de navigation
- **ProductCard** : Réutilisation du composant existant

## Structure des fichiers

```
app/[locale]/products/[id]/
├── page.tsx                    # Page serveur avec SSR
└── product-detail-client.tsx   # Composant client interactif

lib/store/
└── cart-store.ts              # Store Zustand pour le panier
```

## Utilisation

### Import et utilisation basique

```tsx
import ProductDetailClient from './product-detail-client'

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params
  const supabase = createServerClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  return <ProductDetailClient product={product} similarProducts={[]} />
}
```

### Avec métadonnées SEO

```tsx
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = params
  const supabase = createServerClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('name, description, category, image_url')
    .eq('id', id)
    .single()

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image_url ? [product.image_url] : [],
      type: 'product',
    },
  }
}
```

## Layout et Design

### Structure de la page

```tsx
<div className="min-h-screen bg-gray-50">
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      
      {/* Galerie d'images (40%) */}
      <div className="lg:col-span-2">
        {/* Image principale + miniatures */}
      </div>

      {/* Informations du produit (60%) */}
      <div className="lg:col-span-3">
        {/* Breadcrumb + Infos + Actions */}
      </div>
      
    </div>

    {/* Spécifications */}
    {/* Produits similaires */}
  </div>
</div>
```

### Galerie d'images

#### Image principale
```tsx
<div className="relative aspect-square overflow-hidden bg-gray-100 group">
  <motion.img
    src={productImages[selectedImageIndex]}
    alt={product.name}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    whileHover={{ scale: 1.05 }}
  />
  
  {/* Boutons de navigation */}
  <Button
    variant="secondary"
    size="sm"
    className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
    onClick={() => setSelectedImageIndex(prev => 
      prev === 0 ? productImages.length - 1 : prev - 1
    )}
  >
    <ChevronLeft className="h-4 w-4" />
  </Button>
</div>
```

#### Miniatures
```tsx
<div className="p-4">
  <div className="grid grid-cols-4 gap-2">
    {productImages.map((image, index) => (
      <button
        key={index}
        onClick={() => setSelectedImageIndex(index)}
        className={`relative aspect-square overflow-hidden rounded-md border-2 ${
          selectedImageIndex === index
            ? 'border-primary-500 ring-2 ring-primary-200'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <img
          src={image}
          alt={`${product.name} - Image ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </button>
    ))}
  </div>
</div>
```

### Informations du produit

#### Breadcrumb
```tsx
<nav className="flex items-center space-x-2 text-sm text-gray-500">
  <button onClick={() => router.push('/')}>
    Accueil
  </button>
  <ChevronRight className="h-4 w-4" />
  <button onClick={() => router.push('/products')}>
    Produits
  </button>
  <ChevronRight className="h-4 w-4" />
  <button onClick={handleCategoryClick}>
    {product.category}
  </button>
  <ChevronRight className="h-4 w-4" />
  <span className="text-gray-900 font-medium">{product.name}</span>
</nav>
```

#### Badge stock
```tsx
{isOutOfStock ? (
  <Badge variant="destructive" className="text-sm">
    Rupture de stock
  </Badge>
) : isLowStock ? (
  <Badge variant="secondary" className="text-sm bg-orange-100 text-orange-800">
    Stock limité ({product.stock} restants)
  </Badge>
) : (
  <Badge variant="secondary" className="text-sm bg-green-100 text-green-800">
    En stock ({product.stock} disponibles)
  </Badge>
)}
```

#### Sélecteur quantité
```tsx
<div className="flex items-center space-x-4">
  <span className="text-sm font-medium text-gray-700">Quantité :</span>
  <div className="flex items-center border border-gray-300 rounded-md">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleQuantityChange(quantity - 1)}
      disabled={quantity <= 1}
    >
      <Minus className="h-4 w-4" />
    </Button>
    <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
      {quantity}
    </span>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleQuantityChange(quantity + 1)}
      disabled={quantity >= maxQuantity}
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>
</div>
```

#### Boutons d'action
```tsx
<div className="flex flex-col sm:flex-row gap-4">
  <Button
    size="lg"
    onClick={handleAddToCart}
    disabled={isOutOfStock || isAddingToCart}
    className="flex-1 h-12 text-lg"
  >
    {isAddingToCart ? (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="mr-2"
      >
        <ShoppingCart className="h-5 w-5" />
      </motion.div>
    ) : (
      <ShoppingCart className="h-5 w-5 mr-2" />
    )}
    {isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
  </Button>

  <Button
    size="lg"
    variant="outline"
    onClick={handleToggleFavorite}
    className="h-12 px-6"
  >
    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
  </Button>
</div>
```

### Boutons de partage

```tsx
<div className="space-y-2">
  <span className="text-sm font-medium text-gray-700">Partager :</span>
  <div className="flex items-center space-x-2">
    <Button
      size="sm"
      variant="outline"
      onClick={() => handleShare('facebook')}
    >
      <Facebook className="h-4 w-4" />
    </Button>
    <Button
      size="sm"
      variant="outline"
      onClick={() => handleShare('twitter')}
    >
      <Twitter className="h-4 w-4" />
    </Button>
    <Button
      size="sm"
      variant="outline"
      onClick={() => handleShare('linkedin')}
    >
      <Linkedin className="h-4 w-4" />
    </Button>
    <Button
      size="sm"
      variant="outline"
      onClick={() => handleShare('mail')}
    >
      <Mail className="h-4 w-4" />
    </Button>
    <Button
      size="sm"
      variant="outline"
      onClick={() => handleShare('copy')}
    >
      {isLinkCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  </div>
</div>
```

## Store du panier

### Interface CartItem

```typescript
interface CartItem {
  product: Product
  quantity: number
  addedAt: string
}
```

### Actions du store

```typescript
interface CartActions {
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}
```

### Utilisation du store

```tsx
const { addToCart, removeFromCart, updateQuantity, clearCart } = useCartStore()

// Ajouter au panier
addToCart(product, quantity)

// Mettre à jour la quantité
updateQuantity(productId, newQuantity)

// Retirer du panier
removeFromCart(productId)

// Vider le panier
clearCart()
```

## Animations Framer Motion

### Animation de la page

```tsx
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1
    }
  }
}

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
```

### Animation des sections

```tsx
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6 }}
>
```

### Animation de chargement

```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
>
  <ShoppingCart className="h-5 w-5" />
</motion.div>
```

## Gestion des événements

### Ajout au panier

```tsx
const handleAddToCart = async () => {
  if (isOutOfStock) return

  setIsAddingToCart(true)
  
  try {
    addToCart(product, quantity)
    
    toast({
      title: 'Produit ajouté au panier',
      description: `${product.name} (${quantity}x) a été ajouté à votre panier`,
      variant: 'default'
    })

    await new Promise(resolve => setTimeout(resolve, 1000))
    
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

### Partage social

```tsx
const handleShare = async (platform: string) => {
  const url = window.location.href
  const title = product.name
  const description = product.description

  try {
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        break
      case 'copy':
        await navigator.clipboard.writeText(url)
        setIsLinkCopied(true)
        setTimeout(() => setIsLinkCopied(false), 2000)
        break
    }
  } catch (error) {
    toast({
      title: 'Erreur',
      description: 'Impossible de partager le produit',
      variant: 'destructive'
    })
  }
}
```

## Spécifications techniques

### Tableau des spécifications

```tsx
<Card>
  <CardContent className="p-0">
    <div className="overflow-hidden">
      <table className="w-full">
        <tbody>
          {Object.entries(product.specifications).map(([key, value], index) => (
            <tr 
              key={key}
              className={`border-b border-gray-200 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <td className="px-6 py-4 font-medium text-gray-900 w-1/3">
                {key}
              </td>
              <td className="px-6 py-4 text-gray-700">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>
```

## Produits similaires

### Carrousel de produits

```tsx
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6 }}
>
  <h2 className="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {similarProducts.map((similarProduct) => (
      <motion.div
        key={similarProduct.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
      >
        <ProductCard product={similarProduct} />
      </motion.div>
    ))}
  </div>
</motion.section>
```

## Configuration des traductions

### Structure JSON

```json
{
  "products": {
    "detail": {
      "title": "Détails du produit",
      "breadcrumb": {
        "home": "Accueil",
        "products": "Produits",
        "category": "Catégorie"
      },
      "gallery": {
        "previous": "Image précédente",
        "next": "Image suivante",
        "image": "Image {index} de {total}"
      },
      "stock": {
        "inStock": "En stock ({count} disponibles)",
        "lowStock": "Stock limité ({count} restants)",
        "outOfStock": "Rupture de stock"
      },
      "quantity": {
        "label": "Quantité :",
        "min": "Quantité minimale : 1",
        "max": "Quantité maximale : {max}"
      },
      "actions": {
        "addToCart": "Ajouter au panier",
        "addToFavorites": "Ajouter aux favoris",
        "removeFromFavorites": "Retirer des favoris",
        "share": "Partager",
        "shareOn": "Partager sur {platform}",
        "copyLink": "Copier le lien",
        "linkCopied": "Lien copié !"
      },
      "specifications": {
        "title": "Spécifications techniques",
        "characteristic": "Caractéristique",
        "value": "Valeur"
      },
      "similar": {
        "title": "Produits similaires",
        "viewAll": "Voir tous les produits"
      }
    }
  }
}
```

## Responsive Design

### Breakpoints

```css
/* Mobile (par défaut) */
grid-cols-1

/* Tablet (md) */
md:grid-cols-2

/* Desktop (lg) */
lg:grid-cols-5  /* 2 colonnes pour galerie + 3 pour infos */
lg:grid-cols-4  /* 4 colonnes pour produits similaires */
```

### Adaptations

- **Mobile** : Layout vertical, galerie en haut
- **Tablet** : Layout vertical, galerie en haut
- **Desktop** : Layout horizontal, galerie à gauche

## Performance

### Optimisations

- **SSR** : Récupération des données côté serveur
- **Image lazy loading** : Chargement différé des images
- **Animations optimisées** : Utilisation de Framer Motion
- **Memoization** : Composants mémorisés

### Métriques attendues

- **First Contentful Paint** : < 1.0s
- **Largest Contentful Paint** : < 2.0s
- **Cumulative Layout Shift** : < 0.1
- **Time to Interactive** : < 2.5s

## Accessibilité

### ARIA Labels

```tsx
<Button
  aria-label="Image précédente"
  onClick={() => setSelectedImageIndex(prev => prev - 1)}
>
  <ChevronLeft className="h-4 w-4" />
</Button>

<Button
  aria-label="Ajouter au panier"
  onClick={handleAddToCart}
>
  <ShoppingCart className="h-5 w-5" />
</Button>
```

### Navigation clavier

- **Tab** : Navigation entre les éléments interactifs
- **Enter** : Activation des boutons
- **Espace** : Activation des boutons
- **Flèches** : Navigation dans les miniatures

### Contraste

- **Texte** : Contraste élevé sur fond clair
- **Boutons** : Couleurs contrastées
- **Badges** : Couleurs distinctes selon l'état

## Tests

### Tests unitaires

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import ProductDetailClient from './product-detail-client'

describe('ProductDetailClient', () => {
  const mockProduct = {
    id: 'prod_123',
    name: 'Test Product',
    description: 'Test Description',
    price: 2500,
    category: 'pvc-cards',
    image_url: '/test-image.jpg',
    stock: 10,
    specifications: { 'Matériau': 'PVC 0.76mm' },
    is_active: true,
    created_at: '2024-01-15T10:30:00Z'
  }

  test('should render product information', () => {
    render(<ProductDetailClient product={mockProduct} similarProducts={[]} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('2 500 XOF')).toBeInTheDocument()
  })

  test('should handle quantity change', () => {
    render(<ProductDetailClient product={mockProduct} similarProducts={[]} />)
    
    const plusButton = screen.getByRole('button', { name: /plus/i })
    fireEvent.click(plusButton)
    
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  test('should handle add to cart', () => {
    render(<ProductDetailClient product={mockProduct} similarProducts={[]} />)
    
    const addToCartButton = screen.getByRole('button', { name: /ajouter au panier/i })
    fireEvent.click(addToCartButton)
    
    expect(screen.getByText('Produit ajouté au panier')).toBeInTheDocument()
  })
})
```

### Tests d'intégration

- **Navigation** : Vérification des liens
- **Panier** : Test de l'ajout au panier
- **Partage** : Test des boutons de partage
- **Favoris** : Test de l'ajout aux favoris

## Dépannage

### Problèmes courants

1. **Produit non trouvé**
   ```tsx
   // Vérifier la requête Supabase
   const { data: product, error } = await supabase
     .from('products')
     .select('*')
     .eq('id', id)
     .single()
   ```

2. **Images ne s'affichent pas**
   ```tsx
   // Vérifier les URLs d'images
   const productImages = [
     product.image_url || '/placeholder-product.jpg',
     // ...
   ]
   ```

3. **Animations ne fonctionnent pas**
   ```tsx
   // Vérifier Framer Motion
   import { motion } from 'framer-motion'
   ```

4. **Store du panier ne fonctionne pas**
   ```tsx
   // Vérifier l'import du store
   import { useCartStore } from '@/lib/store/cart-store'
   ```

## Support

Pour toute question ou problème :

1. Vérifier la documentation Framer Motion
2. Consulter les logs de la console
3. Tester avec les exemples fournis
4. Créer une issue avec les détails du problème
