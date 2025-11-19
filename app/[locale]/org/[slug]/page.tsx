import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { HeroCarousel } from './components/hero-carousel'
import { notFound } from 'next/navigation'
import type { Database } from '@/lib/supabase/database.types'

type Product = Database['public']['Tables']['products']['Row']
type Event = Database['public']['Tables']['events']['Row']
type Exhibitor = Database['public']['Tables']['exhibitors']['Row']
type Organization = Database['public']['Tables']['organizations']['Row']

interface OrgHomePageProps {
  params: {
    locale: string
    slug: string
  }
}

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
    featured: boolean
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
        {product.featured && (
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
  const supabase = await createSupabaseServerClient()

  // ====================================
  // ÉTAPE 1 : RÉCUPÉRER L'ORGANIZATION
  // ====================================
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()

  if (orgError || !organization) {
    console.error('❌ Organization not found:', { slug, error: orgError })
    notFound()
  }

  const orgData = organization as Pick<Organization, 'id' | 'name' | 'slug'>
  const orgId = orgData.id

  // Debug log pour vérification
  console.log('✅ Organization found:', { id: orgId, name: orgData.name, slug: orgData.slug })

  // Pour mooktartech-com : afficher la page e-commerce complète
  if (slug === 'mooktartech-com') {
    // ====================================
    // ÉTAPE 2 : TOUTES LES REQUÊTES MÉTIER
    // DOIVENT FILTRER PAR organization_id
    // ====================================
    
    // Récupérer les produits featured pour le carousel (5 premiers)
    const { data: featuredProducts, error: errorFeatured } = await supabase
      .from('products')
      .select('*')
      .eq('organization_id', orgId) // ✅ CRITIQUE : Filtrer par orgId dynamique
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(5)

    // Récupérer tous les produits pour extraire les catégories
    const { data: allProducts, error: errorAll } = await supabase
      .from('products')
      .select('category')
      .eq('organization_id', orgId) // ✅ CRITIQUE : Filtrer par orgId dynamique

    // Récupérer les 4 premiers produits featured pour bestsellers
    const { data: bestsellers } = await supabase
      .from('products')
      .select('*')
      .eq('organization_id', orgId) // ✅ CRITIQUE : Filtrer par orgId dynamique
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(4)

    const featuredList = (featuredProducts as Product[] | null)?.slice(0, 5) || [] // Limiter à 5 pour le carousel
    const bestsellersList = (bestsellers as Product[] | null)?.slice(0, 4) || [] // Limiter à 4 pour bestsellers
    const categories = Array.from(new Set((allProducts as Pick<Product, 'category'>[] | null)?.map(p => p.category).filter((cat): cat is string => Boolean(cat)) || []))

    // Debug logs pour vérification multitenant
    console.log('🔍 ===== DEBUG HOME PAGE (MOOKTARTECH) =====')
    console.log('Organization ID:', orgId)
    console.log('Organization Name:', orgData.name)
    console.log('Organization Slug:', orgData.slug)
    console.log('Featured products count:', featuredProducts?.length || 0)
    console.log('All products count:', allProducts?.length || 0)
    console.log('Bestsellers count:', bestsellers?.length || 0)
    console.log('Categories extracted:', categories)
    if (errorFeatured) console.error('❌ Error featured products:', errorFeatured)
    if (errorAll) console.error('❌ Error all products:', errorAll)

    return (
      <div className="min-h-screen">
        {/* 1. HERO CAROUSEL */}
        <HeroCarousel 
          products={featuredList.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image_url: p.image_url
          }))}
          locale={locale}
          slug={slug}
        />

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

  // Pour xarala-solutions : page d'accueil complète
  if (slug === 'xarala-solutions') {
    // Debug log pour vérification multitenant
    console.log('🔍 ===== DEBUG HOME PAGE (XARALA) =====')
    console.log('Organization ID:', orgId)
    console.log('Organization Name:', orgData.name)
    console.log('Organization Slug:', orgData.slug)
    
    // Vérifier qu'il n'y a pas de produits (normal pour Xarala)
    const { data: productsCheck } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', orgId) // ✅ CRITIQUE : Filtrer par orgId
    console.log('Products count (should be 0):', productsCheck?.length || 0)
    
    // Vérifier les événements
    const { data: eventsCheck } = await supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', orgId) // ✅ CRITIQUE : Filtrer par orgId
    console.log('Events count:', eventsCheck?.length || 0)
    return (
      <div className="min-h-screen">
        {/* HERO SECTION */}
        <section className="relative h-[600px] bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h1 className="text-5xl font-bold mb-6">
                Solutions d&apos;Identification Professionnelle
              </h1>
              <p className="text-xl mb-8">
                Cartes NFC, Badges et solutions d&apos;identification au Sénégal
              </p>
              <Link 
                href={`/${locale}/org/${slug}/products`}
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
              >
                Découvrir nos produits
              </Link>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">🎴</div>
              <h3 className="text-2xl font-bold mb-4">Cartes NFC</h3>
              <p className="text-gray-600 mb-6">
                Cartes de visite NFC professionnelles et personnalisables
              </p>
              <Link href={`/${locale}/org/${slug}/nfc`} className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                En savoir plus →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">🏷️</div>
              <h3 className="text-2xl font-bold mb-4">Badges</h3>
              <p className="text-gray-600 mb-6">
                Badges professionnels pour événements et entreprises
              </p>
              <Link href={`/${locale}/org/${slug}/badges`} className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                En savoir plus →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-2xl font-bold mb-4">Produits</h3>
              <p className="text-gray-600 mb-6">
                Large gamme de solutions d&apos;identification
              </p>
              <Link href={`/${locale}/org/${slug}/products`} className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                En savoir plus →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Prêt à démarrer ?</h2>
          <p className="text-xl mb-8">Contactez-nous pour un devis gratuit</p>
          <Link 
            href={`/${locale}/org/${slug}/quote`}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-full text-xl font-semibold transition-colors"
          >
            Devis gratuit
          </Link>
        </section>
      </div>
    )
  }

  // Pour foire-dakar-2025 : page d'accueil événement dynamique
  if (slug === 'foire-dakar-2025') {
    // Debug log pour vérification multitenant
    console.log('🔍 ===== DEBUG HOME PAGE (FOIRE DAKAR) =====')
    console.log('Organization ID:', orgId)
    console.log('Organization Name:', orgData.name)
    console.log('Organization Slug:', orgData.slug)

    // ====================================
    // ÉTAPE 2 : TOUTES LES REQUÊTES MÉTIER
    // DOIVENT FILTRER PAR organization_id
    // ====================================

    // 1. Récupérer l'événement principal (foire)
    const { data: foireEvent } = await supabase
      .from('events')
      .select('*')
      .eq('organization_id', orgId) // ✅ CRITIQUE : Filtrer par orgId dynamique
      .eq('event_type', 'foire')
      .eq('status', 'published')
      .order('start_date', { ascending: false })
      .limit(1)
      .maybeSingle()

    const foireEventData = foireEvent as Event | null

    if (!foireEventData) {
      console.log('⚠️ No event found for organization:', orgId)
    } else {
      console.log('✅ Event found:', { id: foireEventData.id, name: foireEventData.name })
    }

    // 2. Statistiques - Filtrer via event_id (qui est déjà filtré par organization_id)
    const { count: exhibitorsCount } = await supabase
      .from('exhibitors')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', foireEventData?.id || '')
      .eq('status', 'approved')

    // 3. Pour les produits, récupérer d'abord les IDs des exposants
    // Note: Les exhibitors sont déjà isolés via event_id (qui est filtré par organization_id)
    let productsCount = 0
    if (foireEventData?.id) {
      const { data: exhibitors } = await supabase
        .from('exhibitors')
        .select('id')
        .eq('event_id', foireEventData.id) // ✅ Isolé via event (déjà filtré par orgId)
        .eq('status', 'approved')

      const exhibitorsData = exhibitors as Pick<Exhibitor, 'id'>[] | null

      if (exhibitorsData && exhibitorsData.length > 0) {
        const exhibitorIds = exhibitorsData.map(e => e.id)
        const { count } = await supabase
          .from('exhibitor_products')
          .select('*', { count: 'exact', head: true })
          .in('exhibitor_id', exhibitorIds) // ✅ Isolé via exhibitor (qui est isolé via event)
        productsCount = count || 0
      }
    }

    // 4. Exposants featured - Filtrer via event_id (qui est déjà filtré par organization_id)
    const { data: featuredExhibitors } = await supabase
      .from('exhibitors')
      .select('id, company_name, slug, logo_url, category, booth_number')
      .eq('event_id', foireEventData?.id || '') // ✅ Isolé via event (déjà filtré par orgId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(6)

    // Debug logs pour vérification multitenant
    console.log('Exhibitors count:', exhibitorsCount || 0)
    console.log('Products count:', productsCount)
    console.log('Featured exhibitors count:', featuredExhibitors?.length || 0)

    const featuredExhibitorsData = featuredExhibitors as Pick<Exhibitor, 'id' | 'company_name' | 'slug' | 'logo_url' | 'category' | 'booth_number'>[] | null

    // 5. Calculs
    const startDate = foireEventData?.start_date ? new Date(foireEventData.start_date) : null
    const endDate = foireEventData?.end_date ? new Date(foireEventData.end_date) : null
    const durationDays = startDate && endDate
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 15

    const foireConfig = (foireEventData?.foire_config as any) || {}

    return (
      <div className="min-h-screen">
        {/* 1. HERO SECTION */}
        <section
          className="relative h-[600px] bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500"
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-3xl">
              <h1 className="text-6xl font-bold mb-6">
                {foireEventData?.name || 'Foire Internationale de Dakar 2025'}
              </h1>

              {startDate && endDate && (
                <p className="text-2xl mb-4">
                  {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} -{' '}
                  {endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {' • '}
                  {foireEventData?.location || foireConfig.lieu || 'CICES Dakar'}
                </p>
              )}

              <p className="text-xl mb-8">
                {foireEventData?.description || 'Le plus grand événement commercial et culturel du Sénégal'}
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link
                  href={`/${locale}/org/${slug}/foires/${foireEventData?.slug || 'dakar-2025'}/tickets`}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition"
                >
                  🎟️ Acheter des billets
                </Link>
                <Link
                  href={`/${locale}/org/${slug}/foires/${foireEventData?.slug || 'dakar-2025'}/inscription`}
                  className="bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold transition"
                >
                  🏢 Devenir exposant
                </Link>
                <Link
                  href={`/${locale}/org/${slug}/foires/${foireEventData?.slug || 'dakar-2025'}/catalogue`}
                  className="border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-full text-lg font-semibold transition"
                >
                  📦 Voir le catalogue
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. STATISTIQUES EN TEMPS RÉEL */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {exhibitorsCount || 0}
                </div>
                <p className="text-xl text-gray-600">Exposants confirmés</p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {productsCount || 0}
                </div>
                <p className="text-xl text-gray-600">Produits exposés</p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-5xl font-bold text-pink-600 mb-2">
                  {foireConfig.superficie_totale || '15 000'} {foireConfig.unite || 'm²'}
                </div>
                <p className="text-xl text-gray-600">Surface d&apos;exposition</p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-5xl font-bold text-orange-600 mb-2">
                  {durationDays}
                </div>
                <p className="text-xl text-gray-600">Jours d&apos;événement</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PAVILLONS */}
        {foireConfig.pavillons && Object.keys(foireConfig.pavillons).length > 0 && (
          <section className="py-16 container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">Nos Pavillons</h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Des espaces thématiques pour tous les secteurs d&apos;activité
            </p>

            {/* Pavillons Principaux */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Pavillons Principaux</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(foireConfig.pavillons)
                  .filter(([key, p]: [string, any]) => p.type === 'pavillon_principal')
                  .map(([key, pavillon]: [string, any]) => (
                    <div
                      key={key}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-4xl">🏛️</div>
                        <div>
                          <h4 className="text-xl font-bold group-hover:text-purple-600 transition">
                            {pavillon.nom}
                          </h4>
                          <span className="text-xs text-gray-500 font-mono">{pavillon.code}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">{pavillon.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-purple-50 p-2 rounded">
                          <div className="text-xs text-gray-500">Superficie</div>
                          <div className="font-semibold text-purple-600">{pavillon.superficie} m²</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="text-xs text-gray-500">Capacité</div>
                          <div className="font-semibold text-blue-600">{pavillon.capacite} stands</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Pavillon International */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Pavillon International</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(foireConfig.pavillons)
                  .filter(([key, p]: [string, any]) => p.type === 'pavillon_international')
                  .map(([key, pavillon]: [string, any]) => (
                    <div
                      key={key}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg shadow-md hover:shadow-xl transition"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-4xl">🌍</div>
                        <div>
                          <h4 className="text-xl font-bold text-green-700">{pavillon.nom}</h4>
                          <span className="text-xs text-gray-500 font-mono">{pavillon.code}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">{pavillon.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-white p-2 rounded">
                          <div className="text-xs text-gray-500">Superficie</div>
                          <div className="font-semibold text-green-600">{pavillon.superficie} m²</div>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <div className="text-xs text-gray-500">Capacité</div>
                          <div className="font-semibold text-green-600">{pavillon.capacite} stands</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Esplanades */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Esplanades Extérieures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(foireConfig.pavillons)
                  .filter(([key, p]: [string, any]) => p.type === 'esplanade')
                  .map(([key, pavillon]: [string, any]) => (
                    <div
                      key={key}
                      className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-md hover:shadow-xl transition"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-4xl">☀️</div>
                        <div>
                          <h4 className="text-lg font-bold text-orange-700">{pavillon.nom}</h4>
                          <span className="text-xs text-gray-500 font-mono">{pavillon.code}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">{pavillon.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-white p-2 rounded">
                          <div className="text-xs text-gray-500">Superficie</div>
                          <div className="font-semibold text-orange-600">{pavillon.superficie} m²</div>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <div className="text-xs text-gray-500">Capacité</div>
                          <div className="font-semibold text-orange-600">{pavillon.capacite} stands</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Espace Restauration */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Espace Restauration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(foireConfig.pavillons)
                  .filter(([key, p]: [string, any]) => p.type === 'espace_restauration')
                  .map(([key, pavillon]: [string, any]) => (
                    <div
                      key={key}
                      className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-lg shadow-md hover:shadow-xl transition"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-5xl">🍽️</div>
                        <div>
                          <h4 className="text-2xl font-bold text-pink-700">{pavillon.nom}</h4>
                          <span className="text-xs text-gray-500 font-mono">{pavillon.code}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-6">{pavillon.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Superficie</div>
                          <div className="font-bold text-pink-600 text-lg">{pavillon.superficie} m²</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Emplacements</div>
                          <div className="font-bold text-pink-600 text-lg">{pavillon.capacite}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Stats globales */}
            <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Surface Totale d&apos;Exposition</h3>
              <div className="text-6xl font-bold mb-2">
                {foireConfig.superficie_totale?.toLocaleString('fr-FR') || '25 100'} {foireConfig.unite || 'm²'}
              </div>
              <p className="text-lg">
                Répartis sur {Object.keys(foireConfig.pavillons).length} espaces distincts
              </p>
            </div>
          </section>
        )}

        {/* 4. EXPOSANTS VEDETTES */}
        {featuredExhibitorsData && featuredExhibitorsData.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-4">Exposants Vedettes</h2>
              <p className="text-center text-gray-600 mb-12 text-lg">
                Découvrez quelques-uns de nos exposants confirmés
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {featuredExhibitorsData.map((exhibitor) => (
                  <Link
                    key={exhibitor.id}
                    href={`/${locale}/org/${slug}/foires/${foireEventData?.slug || 'dakar-2025'}/catalogue/${exhibitor.slug}`}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition text-center group"
                  >
                    {exhibitor.logo_url ? (
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <img
                          src={exhibitor.logo_url}
                          alt={exhibitor.company_name}
                          className="w-full h-full object-contain group-hover:scale-110 transition"
                        />
                      </div>
                    ) : (
                      <div className="text-5xl mb-4">🏢</div>
                    )}
                    <h3 className="font-semibold text-sm mb-1">{exhibitor.company_name}</h3>
                    {exhibitor.booth_number && (
                      <p className="text-xs text-gray-500">Stand {exhibitor.booth_number}</p>
                    )}
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href={`/${locale}/org/${slug}/foires/${foireEventData?.slug || 'dakar-2025'}/catalogue`}
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition"
                >
                  Voir tous les exposants →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 5. COMMENT PARTICIPER */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Comment Participer ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-lg">
              <div className="text-6xl mb-4">🎟️</div>
              <h3 className="text-2xl font-bold mb-4">En tant que Visiteur</h3>
              <p className="text-gray-700 mb-6">
                Achetez votre billet en ligne et profitez de {durationDays} jours d&apos;exposition,
                découvrez des milliers de produits et rencontrez des exposants de tous secteurs.
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Accès à tous les pavillons</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Catalogue digital inclus</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Animations et démonstrations</span>
                </li>
              </ul>
              <Link
                href={`/${locale}/org/${slug}/foires/${foireEventData?.slug || 'dakar-2025'}/tickets`}
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Acheter un billet →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold mb-4">En tant qu&apos;Exposant</h3>
              <p className="text-gray-700 mb-6">
                Réservez votre stand et exposez vos produits devant des milliers de visiteurs.
                Profitez d&apos;une visibilité unique et développez votre réseau.
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Stand équipé et personnalisable</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Page catalogue digital dédiée</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Outils de suivi des visiteurs</span>
                </li>
              </ul>
              <Link
                href={`/${locale}/org/${slug}/foires/${foireEventData?.slug || 'dakar-2025'}/inscription`}
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Devenir exposant →
              </Link>
            </div>
          </div>
        </section>

        {/* 6. INFORMATIONS PRATIQUES */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Informations Pratiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-bold mb-2">Lieu</h3>
                <p className="text-gray-700">
                  {foireConfig.lieu || foireEventData?.location || 'CICES Dakar'}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  {foireConfig.adresse || foireEventData?.location_address || 'Route de l\'Aéroport, Dakar'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">🕐</div>
                <h3 className="text-xl font-bold mb-2">Horaires</h3>
                {foireConfig.horaires ? (
                  <>
                    <p className="text-gray-700">
                      {foireConfig.horaires.ouverture} - {foireConfig.horaires.fermeture}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      {foireConfig.horaires.jours?.join(', ')}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-700">8h - 18h tous les jours</p>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-bold mb-2">Contact</h3>
                {foireConfig.contact ? (
                  <>
                    <p className="text-gray-700 text-sm">{foireConfig.contact.email}</p>
                    <p className="text-gray-700 text-sm mt-1">{foireConfig.contact.telephone}</p>
                  </>
                ) : (
                  <p className="text-gray-700 text-sm">contact@foire-dakar.com</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 7. CTA FINAL */}
        <section className="py-16 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 text-center text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6">Rejoignez-nous !</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Ne manquez pas le plus grand événement économique et culturel de l&apos;année
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href={`/${locale}/org/${slug}/foires/${foireEventData?.slug || 'dakar-2025'}/tickets`}
                className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-full text-xl font-semibold transition"
              >
                🎟️ Réserver mon billet
              </Link>
              <Link
                href={`/${locale}/org/${slug}/foires/${foireEventData?.slug || 'dakar-2025'}/inscription`}
                className="bg-white hover:bg-gray-100 text-purple-600 px-12 py-4 rounded-full text-xl font-semibold transition"
              >
                🏢 Réserver mon stand
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Pour les autres organisations : message simple
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-900">
        Page d&apos;accueil {slug}
      </h1>
    </div>
  )
}
