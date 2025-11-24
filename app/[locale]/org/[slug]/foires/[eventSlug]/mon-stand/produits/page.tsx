'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Star,
  ArrowLeft
} from 'lucide-react'

export default function ProduitsPage({
  params,
}: {
  params: { locale: string; slug: string; eventSlug: string }
}) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  
  const [loading, setLoading] = useState(true)
  const [exhibitor, setExhibitor] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'unavailable'>('all')
  const [orgSlug, setOrgSlug] = useState('')

  useEffect(() => {
    loadProducts()
  }, [params.eventSlug])

  useEffect(() => {
    filterProducts()
  }, [searchQuery, filterStatus, products])

  async function loadProducts() {
    setLoading(true)

    try {
      // Récupérer l'événement avec l'organisation
      const { data: eventData } = await supabase
        .from('events')
        .select('id, organization_id, organizations(slug)')
        .eq('slug', params.eventSlug)
        .single()

      if (!eventData) return

      // Extraire le slug de l'organisation
      const orgSlugValue = (eventData as any).organizations?.slug || params.slug
      setOrgSlug(orgSlugValue)

      // Récupérer l'exposant (TODO: filtrer par user)
      const { data: exhibitorData } = await supabase
        .from('exhibitors')
        .select('*')
        .eq('event_id', (eventData as any).id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      setExhibitor(exhibitorData)

      if (!exhibitorData) return

      // Récupérer tous les produits
      const { data: productsData } = await supabase
        .from('exhibitor_products')
        .select('*')
        .eq('exhibitor_id', (exhibitorData as any).id)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      setProducts(productsData || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterProducts() {
    let filtered = [...products]

    // Filtre recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      )
    }

    // Filtre statut
    if (filterStatus === 'available') {
      filtered = filtered.filter((p) => p.is_available)
    } else if (filterStatus === 'unavailable') {
      filtered = filtered.filter((p) => !p.is_available)
    }

    setFilteredProducts(filtered)
  }

  async function toggleAvailability(productId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('exhibitor_products')
      .update({ is_available: !currentStatus })
      .eq('id', productId)

    if (!error) {
      setProducts(products.map((p: any) => 
        p.id === productId ? { ...p, is_available: !currentStatus } : p
      ))
    }
  }

  async function toggleFeatured(productId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('exhibitor_products')
      .update({ is_featured: !currentStatus })
      .eq('id', productId)

    if (!error) {
      setProducts(products.map((p: any) => 
        p.id === productId ? { ...p, is_featured: !currentStatus } : p
      ))
    }
  }

  async function deleteProduct(productId: string, productName: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
      return
    }

    const { error } = await supabase
      .from('exhibitor_products')
      .delete()
      .eq('id', productId)

    if (!error) {
      setProducts(products.filter(p => p.id !== productId))
      alert('Produit supprimé avec succès')
    } else {
      alert('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!orgSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link
            href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand`}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mes Produits</h1>
              <p className="text-lg opacity-90">{exhibitor?.company_name}</p>
            </div>
            <Link
              href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/produits/nouveau`}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              <Plus className="h-5 w-5" />
              Nouveau produit
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* FILTRES */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Filtre statut */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                  filterStatus === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tous ({products.length})
              </button>
              <button
                onClick={() => setFilterStatus('available')}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                  filterStatus === 'available'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Disponibles ({products.filter(p => p.is_available).length})
              </button>
              <button
                onClick={() => setFilterStatus('unavailable')}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                  filterStatus === 'unavailable'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Indisponibles ({products.filter(p => !p.is_available).length})
              </button>
            </div>
          </div>
        </div>

        {/* LISTE PRODUITS */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Aucun produit trouvé</h2>
            <p className="text-gray-600 mb-6">
              {products.length === 0
                ? 'Commencez par ajouter votre premier produit'
                : 'Essayez de modifier vos filtres de recherche'
              }
            </p>
            {products.length === 0 && (
              <Link
                href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/produits/nouveau`}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                <Plus className="h-5 w-5" />
                Ajouter mon premier produit
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product: any) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <div className="flex items-center gap-6 p-6">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {product.featured_image || (product.images && product.images[0]) ? (
                      <img
                        src={product.featured_image || product.images[0]}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                        {product.category && (
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            {product.category}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {product.is_featured && (
                          <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Vedette
                          </span>
                        )}
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          product.is_available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_available ? '✓ Disponible' : '✗ Indisponible'}
                        </span>
                      </div>
                    </div>

                    {product.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-purple-600">
                        {product.price_on_request ? (
                          'Prix sur demande'
                        ) : (
                          <>
                            {new Intl.NumberFormat('fr-FR').format(product.price || 0)}{' '}
                            <span className="text-sm">{product.currency || 'FCFA'}</span>
                          </>
                        )}
                      </div>

                      {!product.unlimited_stock && product.stock_quantity !== null && (
                        <div className="text-sm text-gray-600">
                          Stock: {product.stock_quantity}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    <button
                      onClick={() => toggleFeatured(product.id, product.is_featured)}
                      className={`p-2 rounded-lg transition ${
                        product.is_featured
                          ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={product.is_featured ? 'Retirer la vedette' : 'Mettre en vedette'}
                    >
                      <Star className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => toggleAvailability(product.id, product.is_available)}
                      className={`p-2 rounded-lg transition ${
                        product.is_available
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                      title={product.is_available ? 'Marquer indisponible' : 'Marquer disponible'}
                    >
                      {product.is_available ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>

                    <Link
                      href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/produits/${product.id}`}
                      className="p-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-lg transition"
                      title="Modifier"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>

                    <button
                      onClick={() => deleteProduct(product.id, product.name)}
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

