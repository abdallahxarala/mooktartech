# Page de Liste des Produits - Xarala Solutions

## Vue d'ensemble

La page de liste des produits de Xarala Solutions offre une expérience de navigation moderne et intuitive pour découvrir et filtrer les solutions d'identification professionnelle. Elle utilise le store Zustand pour la gestion d'état, des filtres avancés, et des animations fluides.

## Fonctionnalités

### 🏪 Gestion des produits
- **Récupération** : Chargement depuis Supabase via le store Zustand
- **Affichage** : Grille responsive avec cartes produits
- **Pagination** : 12 produits par page avec navigation
- **États** : Loading, erreur, et état vide gérés

### 🔍 Système de filtres avancé
- **Sidebar** : Filtres dans une sidebar collante (25% de largeur)
- **Catégories** : Radio buttons pour sélectionner la catégorie
- **Prix** : Dual range slider pour la plage de prix
- **Recherche** : Input avec debounce de 300ms
- **Reset** : Bouton pour réinitialiser tous les filtres

### 🎨 Interface utilisateur
- **Layout responsive** : Sidebar + main content (25% + 75%)
- **Grille adaptative** : 3 colonnes → 2 → 1 selon l'écran
- **Animations** : Framer Motion avec stagger effects
- **Skeleton loading** : Placeholders pendant le chargement

### 🔗 URL et partageabilité
- **Paramètres URL** : Filtres synchronisés avec l'URL
- **Partageabilité** : Liens partageables avec filtres
- **Navigation** : Retour en arrière fonctionnel
- **SEO** : Métadonnées optimisées

## Structure des fichiers

```
app/[locale]/products/
├── page.tsx                    # Page serveur avec métadonnées
└── products-client.tsx         # Composant client interactif

components/products/
├── product-card.tsx            # Carte produit individuelle
└── product-card-skeleton.tsx   # Skeleton de chargement
```

## Utilisation

### Import et utilisation basique

```tsx
import ProductsPageClient from './products-client'

export default function ProductsPage() {
  return <ProductsPageClient />
}
```

### Avec métadonnées SEO

```tsx
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('products')
  
  return {
    title: t('title'),
    description: t('metaDescription'),
    openGraph: {
      title: t('title'),
      description: t('metaDescription'),
      type: 'website',
    },
  }
}
```

## Layout et Design

### Structure de la page

```tsx
<div className="min-h-screen bg-gray-50">
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Sidebar - Filtres (25%) */}
      <aside className="w-full lg:w-1/4">
        <Card className="sticky top-8">
          {/* Filtres */}
        </Card>
      </aside>

      {/* Main Content (75%) */}
      <main className="w-full lg:w-3/4">
        {/* Header + Grille + Pagination */}
      </main>
      
    </div>
  </div>
</div>
```

### Sidebar des filtres

#### Filtre 1 - Catégories (Radio buttons)
```tsx
<RadioGroup value={filters.category} onValueChange={handleCategoryChange}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="all" id="all" />
    <Label htmlFor="all">Toutes les catégories</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="pvc-cards" id="pvc-cards" />
    <Label htmlFor="pvc-cards">Cartes PVC</Label>
  </div>
  {/* Autres catégories... */}
</RadioGroup>
```

#### Filtre 2 - Prix (Dual range slider)
```tsx
<div className="space-y-4">
  <div className="flex items-center justify-between text-sm text-gray-600">
    <span>{priceMin.toLocaleString()} XOF</span>
    <span>{priceMax.toLocaleString()} XOF</span>
  </div>
  <div className="relative">
    <input
      type="range"
      min={priceRange[0]}
      max={priceRange[1]}
      value={priceMax}
      onChange={(e) => handlePriceRangeChange(priceMin, parseInt(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
  </div>
</div>
```

#### Filtre 3 - Recherche (Input avec debounce)
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
  <Input
    type="text"
    placeholder="Rechercher un produit..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-10"
  />
</div>
```

### Main Content

#### Header avec tri
```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-2">Nos Produits</h1>
    <p className="text-gray-600">
      {filteredCount} produit(s) trouvé(s) sur {totalProducts}
    </p>
  </div>
  
  <Select value={sortBy} onValueChange={handleSortChange}>
    <SelectTrigger className="w-48">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="name-asc">Nom A-Z</SelectItem>
      <SelectItem value="name-desc">Nom Z-A</SelectItem>
      <SelectItem value="price-asc">Prix croissant</SelectItem>
      <SelectItem value="price-desc">Prix décroissant</SelectItem>
    </SelectContent>
  </Select>
</div>
```

#### Grille des produits
```tsx
<motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  <AnimatePresence mode="popLayout">
    {currentProducts.map((product, index) => (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        layout
      >
        <ProductCard product={product} />
      </motion.div>
    ))}
  </AnimatePresence>
</motion.div>
```

#### Pagination
```tsx
<div className="flex items-center justify-center gap-2">
  <Button
    variant="outline"
    size="sm"
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    <ChevronLeft className="h-4 w-4 mr-1" />
    Précédent
  </Button>
  
  <div className="flex items-center gap-1">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <Button
        key={page}
        variant={currentPage === page ? "default" : "outline"}
        size="sm"
        onClick={() => handlePageChange(page)}
        className="w-10 h-10"
      >
        {page}
      </Button>
    ))}
  </div>
  
  <Button
    variant="outline"
    size="sm"
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Suivant
    <ChevronRight className="h-4 w-4 ml-1" />
  </Button>
</div>
```

## Composant ProductCard

### Structure de la carte

```tsx
<Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
  <CardContent className="p-0">
    {/* Image du produit */}
    <div className="relative aspect-square overflow-hidden bg-gray-100">
      <Image
        src={product.image_url || '/placeholder-product.jpg'}
        alt={product.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      {/* Badges */}
      <div className="absolute top-3 left-3">
        {!isInStock && <Badge variant="destructive">Rupture de stock</Badge>}
        {isLowStock && <Badge variant="secondary">Stock faible</Badge>}
      </div>
      
      {/* Actions rapides */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100">
        <Button size="sm" variant="secondary">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>

    {/* Contenu */}
    <div className="p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 line-clamp-2">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2">
        {product.description}
      </p>
      <div className="text-lg font-bold text-primary-600">
        {formatPrice(product.price)}
      </div>
      <Button className="w-full" disabled={!isInStock}>
        <ShoppingCart className="h-4 w-4 mr-2" />
        {isInStock ? 'Voir le produit' : 'Rupture de stock'}
      </Button>
    </div>
  </CardContent>
</Card>
```

### Fonctionnalités de la carte

- **Image responsive** : Aspect ratio carré avec zoom au hover
- **Badges** : Rupture de stock, stock faible
- **Actions rapides** : Voir détails, ajouter aux favoris
- **Prix formaté** : Format XOF avec séparateurs
- **Spécifications** : Affichage des 2 premières spécifications
- **État du stock** : Gestion des états de stock
- **Animations** : Hover effects et transitions

## Gestion d'état avec Zustand

### Hooks utilisés

```tsx
// Hook complet
const {
  products, filteredProducts, isLoading, error, categories, priceRange,
  totalProducts, filteredCount, hasFilters
} = useProducts()

// Actions
const {
  fetchProducts, setCategory, setPriceRange, setSearch, setSortBy, reset
} = useProductsActions()

// Filtres
const { filters, sortBy } = useProductsFilters()
```

### Synchronisation URL

```tsx
// Mise à jour de l'URL
const updateURL = useCallback((params: Record<string, string | number>) => {
  const newSearchParams = new URLSearchParams(searchParams.toString())
  
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== 'all' && value !== '') {
      newSearchParams.set(key, value.toString())
    } else {
      newSearchParams.delete(key)
    }
  })
  
  router.push(`?${newSearchParams.toString()}`, { scroll: false })
}, [searchParams, router])
```

### Debounced search

```tsx
// Recherche avec debounce de 300ms
useEffect(() => {
  const timer = setTimeout(() => {
    if (searchQuery !== filters.search) {
      setSearch(searchQuery)
      updateURL({ search: searchQuery })
    }
  }, 300)

  return () => clearTimeout(timer)
}, [searchQuery, filters.search, setSearch])
```

## Animations Framer Motion

### Animations de la grille

```tsx
<motion.div
  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  <AnimatePresence mode="popLayout">
    {currentProducts.map((product, index) => (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.3, 
          delay: index * 0.05  // Stagger effect
        }}
        layout
      >
        <ProductCard product={product} />
      </motion.div>
    ))}
  </AnimatePresence>
</motion.div>
```

### Animations des cartes

```tsx
<motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.2 }}
  className="group"
>
  <Card className="hover:shadow-xl transition-all duration-300">
    {/* Contenu de la carte */}
  </Card>
</motion.div>
```

## Configuration des traductions

### Structure JSON

```json
{
  "products": {
    "title": "Nos Produits",
    "metaDescription": "Découvrez notre gamme complète...",
    "loading": "Chargement des produits...",
    "results": "{count} produit(s) trouvé(s) sur {total}",
    "empty": {
      "title": "Aucun produit trouvé",
      "description": "Aucun produit ne correspond...",
      "resetFilters": "Réinitialiser les filtres"
    },
    "filters": {
      "title": "Filtres",
      "categories": {
        "title": "Catégories",
        "all": "Toutes les catégories",
        "pvcCards": "Cartes PVC",
        "printers": "Imprimantes"
      }
    },
    "sort": {
      "title": "Trier par",
      "nameAsc": "Nom A-Z",
      "priceAsc": "Prix croissant"
    },
    "pagination": {
      "previous": "Précédent",
      "next": "Suivant"
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

/* Desktop (xl) */
xl:grid-cols-3

/* Sidebar */
w-full lg:w-1/4  /* Sidebar */
w-full lg:w-3/4  /* Main content */
```

### Adaptations

- **Mobile** : Sidebar en haut, grille 1 colonne
- **Tablet** : Sidebar à gauche, grille 2 colonnes
- **Desktop** : Layout complet, grille 3 colonnes

## Performance

### Optimisations

- **Debounced search** : Évite les requêtes excessives
- **Pagination** : Limite le nombre de produits affichés
- **Lazy loading** : Images chargées à la demande
- **Memoization** : Composants mémorisés

### Métriques attendues

- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1
- **Time to Interactive** : < 3.0s

## Accessibilité

### ARIA Labels

```tsx
<Button aria-label="Voir les détails">
  <Eye className="h-4 w-4" />
</Button>

<Button aria-label="Ajouter aux favoris">
  <Heart className="h-4 w-4" />
</Button>
```

### Navigation clavier

- **Tab** : Navigation entre les filtres et produits
- **Enter** : Activation des boutons et liens
- **Espace** : Sélection des radio buttons
- **Flèches** : Navigation dans les listes

### Contraste

- **Texte** : Contraste élevé sur fond clair
- **Boutons** : Couleurs contrastées
- **États** : Indicateurs visuels clairs

## Tests

### Tests unitaires

```typescript
import { render, screen } from '@testing-library/react'
import ProductsPageClient from './products-client'

describe('ProductsPageClient', () => {
  test('should render products list', () => {
    render(<ProductsPageClient />)
    expect(screen.getByText('Nos Produits')).toBeInTheDocument()
  })

  test('should show loading state', () => {
    // Mock loading state
    render(<ProductsPageClient />)
    expect(screen.getByText('Chargement des produits...')).toBeInTheDocument()
  })
})
```

### Tests d'intégration

- **Filtres** : Vérification du filtrage
- **Pagination** : Navigation entre les pages
- **Recherche** : Fonctionnement de la recherche
- **URL** : Synchronisation des paramètres

## Dépannage

### Problèmes courants

1. **Produits ne se chargent pas**
   ```typescript
   // Vérifier la configuration du store
   const { fetchProducts, error } = useProducts()
   console.log('Error:', error)
   ```

2. **Filtres ne fonctionnent pas**
   ```typescript
   // Vérifier la synchronisation URL
   console.log('Search params:', searchParams.toString())
   ```

3. **Animations ne s'affichent pas**
   ```typescript
   // Vérifier Framer Motion
   import { motion } from 'framer-motion'
   ```

## Support

Pour toute question ou problème :

1. Vérifier la documentation Zustand
2. Consulter les DevTools
3. Tester avec les exemples fournis
4. Créer une issue avec les détails du problème
