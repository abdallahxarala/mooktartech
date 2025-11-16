import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
// import { HeroCarousel } from './components/hero-carousel' // TEMPORAIREMENT DÉSACTIVÉ

interface OrgHomePageProps {
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

// Composant ProductCard simplifié
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
            Pas d&apos;image
          </div>
        )}
        
        {/* Badge Nouveau */}
        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Nouveau
          </span>
        )}
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

        {/* Prix */}
        <div className="mb-4 mt-2">
          <span className="text-2xl font-bold text-[#FF6B35]">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Bouton */}
        <Link
          href={`/${locale}/org/${slug}/shop/${product.id}`}
          className="block w-full text-center bg-[#FF6B35] hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Voir détails
        </Link>
      </div>
    </div>
  )
}

// Configuration des catégories avec emojis spécifiques
const CATEGORIES = [
  { name: 'Laptops', emoji: '💻', slug: 'laptops' },
  { name: 'Smartphones', emoji: '📱', slug: 'smartphones' },
  { name: 'Gaming', emoji: '🎮', slug: 'gaming' },
  { name: 'Imprimantes', emoji: '🖨️', slug: 'imprimantes' },
  { name: 'Autres', emoji: '🖥️', slug: 'autres' },
]

export const dynamic = 'force-dynamic'

export default async function OrgHomePage({ params }: OrgHomePageProps) {
  const { locale, slug } = params

  // Pour mooktartech-com : afficher la page e-commerce complète
  if (slug === 'mooktartech-com') {
    const supabase = createSupabaseServerClient()
    
    // Récupérer les produits featured pour le carousel (5 premiers)
    const { data: featuredProducts } = await supabase
      .from('products')
      .select('*')
      .eq('organization_id', MOOKTAR_ORG_ID)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(5)

    // Récupérer tous les produits pour extraire les catégories
    const { data: allProducts } = await supabase
      .from('products')
      .select('category')
      .eq('organization_id', MOOKTAR_ORG_ID)

    // Récupérer les 4 premiers produits featured pour bestsellers
    const { data: bestsellers } = await supabase
      .from('products')
      .select('*')
      .eq('organization_id', MOOKTAR_ORG_ID)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(4)

    const featuredList = featuredProducts || []
    const bestsellersList = bestsellers || []
    const categories = [...new Set((allProducts || []).map(p => p.category).filter(Boolean))]

    return (
      <div className="min-h-screen">
        {/* CAROUSEL TEMPORAIREMENT DÉSACTIVÉ
        <section className="h-[600px] relative">
          <HeroCarousel 
            products={featuredList.map(p => ({
              id: p.id,
              name: p.name,
              price: p.price,
              image_url: p.image_url
            }))}
            locale={locale}
            slug={slug}
            formatPrice={formatPrice}
          />
        </section>
        */}

        {/* 2. SECTION CATÉGORIES */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12">
            Nos Catégories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/${locale}/org/${slug}/shop`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center"
              >
                <div className="text-4xl mb-3">
                  {category.emoji}
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. SECTION BESTSELLERS */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold text-center mb-12">
              Nos Bestsellers
            </h2>
            {bestsellersList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestsellersList.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    slug={slug}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Aucun bestseller disponible pour le moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 4. SECTION CTA FINAL */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Découvrez Tous Nos Produits
          </h2>
          <Link
            href={`/${locale}/org/${slug}/shop`}
            className="inline-block bg-orange-500 text-white px-12 py-4 rounded-full text-xl hover:bg-orange-600 transition-all"
          >
            Voir la Boutique Complète
          </Link>
        </section>
      </div>
    )
  }

  // Pour les autres organisations : message simple
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-900">
        Page d'accueil {slug}
      </h1>
    </div>
  )
}
