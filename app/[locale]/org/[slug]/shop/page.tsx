import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

interface ShopPageProps {
  params: {
    locale: string
    slug: string
  }
}

const MOOKTAR_ORG_ID = '0e973c3f-f507-4071-bb72-a01b92430186'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(price) + ' FCFA'
}

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string | null
    price: number
    image_url: string | null
    category: string | null
    brand: string | null
    stock: number | null
    is_featured: boolean | null
  }
  locale: string
  slug: string
}

function ProductCard({ product, locale, slug }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Pas d'image
          </div>
        )}
        
        {/* Badge Nouveau */}
        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Nouveau
          </span>
        )}
        
        {/* Bouton Wishlist */}
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-50">
          ❤️
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Catégorie et Stock */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
            {product.category || 'Non catégorisé'}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            (product.stock ?? 0) > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {(product.stock ?? 0) > 0 ? 'En stock' : 'Rupture'}
          </span>
        </div>

        {/* Nom */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Marque */}
        {product.brand && (
          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        )}

        {/* Étoiles (5 étoiles fixes pour l'instant) */}
        <div className="flex items-center mb-3">
          <span className="text-yellow-400">★★★★★</span>
          <span className="text-xs text-gray-500 ml-1">(127)</span>
        </div>

        {/* Prix */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-[#FF6B35]">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Boutons */}
        <div className="space-y-2">
          <button className="w-full bg-[#FF6B35] hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            🛒 Ajouter au panier
          </button>
          <Link 
            href={`/${locale}/org/${slug}/shop/${product.id}`}
            className="block text-center text-[#FF6B35] hover:text-orange-600 text-sm font-medium"
          >
            👁️ Voir détails
          </Link>
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

export default async function ShopPage({ params }: ShopPageProps) {
  const { locale, slug } = params

  // Vérifier que c'est mooktartech-com
  if (slug !== 'mooktartech-com') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h1 className="text-2xl font-bold">Boutique non disponible</h1>
            <p className="mt-2 text-gray-600">
              La boutique n'est disponible que pour mooktartech-com.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Récupérer les produits depuis Supabase
  const supabase = createSupabaseServerClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('organization_id', MOOKTAR_ORG_ID)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching products:', error)
  }

  const productsList = products || []

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🛍️ Boutique MOOKTAR</h1>
          <p className="text-gray-600">
            Découvrez notre sélection de produits de qualité
          </p>
        </div>

        {/* Stats */}
        {productsList.length > 0 && (
          <div className="mb-6 text-sm text-gray-600">
            {productsList.length} produit{productsList.length > 1 ? 's' : ''} disponible{productsList.length > 1 ? 's' : ''}
          </div>
        )}

        {/* Products Grid */}
        {productsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                slug={slug}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center shadow-md">
            <p className="text-gray-500 text-lg">Aucun produit disponible pour le moment.</p>
            <p className="text-gray-400 text-sm mt-2">
              Revenez bientôt pour découvrir nos produits !
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
