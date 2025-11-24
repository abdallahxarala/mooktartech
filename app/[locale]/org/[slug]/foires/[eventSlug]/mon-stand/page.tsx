'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Building, 
  Package, 
  Users, 
  BarChart3, 
  Download,
  Eye,
  QrCode,
  MapPin,
  Edit,
  Plus,
  TrendingUp,
  ShoppingBag
} from 'lucide-react'

export default function MonStandPage({
  params,
}: {
  params: { locale: string; slug: string; eventSlug: string }
}) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  
  const [loading, setLoading] = useState(true)
  const [exhibitor, setExhibitor] = useState<any>(null)
  const [event, setEvent] = useState<any>(null)
  const [stats, setStats] = useState({
    products: 0,
    staff: 0,
    pageViews: 0,
    qrScans: 0,
    uniqueVisitors: 0,
  })
  const [recentProducts, setRecentProducts] = useState<any[]>([])
  const [staffMembers, setStaffMembers] = useState<any[]>([])
  const [orgSlug, setOrgSlug] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [params.eventSlug])

  async function loadDashboard() {
    setLoading(true)

    try {
      // 1. Récupérer l'événement avec l'organisation
      const { data: eventData } = await supabase
        .from('events')
        .select('*, organizations(slug)')
        .eq('slug', params.eventSlug)
        .single()

      setEvent(eventData)

      if (!eventData) {
        setLoading(false)
        return
      }

      // Extraire le slug de l'organisation
      const orgSlugValue = (eventData as any).organizations?.slug || params.slug
      setOrgSlug(orgSlugValue)

      // 2. Récupérer l'exposant
      // TODO: Filtrer par user authentifié
      // Pour l'instant, on prend le premier exposant de l'event
      const { data: exhibitorData } = await supabase
        .from('exhibitors_with_stats')
        .select('*')
        .eq('event_id', (eventData as any).id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      setExhibitor(exhibitorData)

      if (!exhibitorData) {
        setLoading(false)
        return
      }

      // 3. Charger les stats
      setStats({
        products: (exhibitorData as any).products_count || 0,
        staff: 0, // Sera mis à jour après
        pageViews: (exhibitorData as any).page_views || 0,
        qrScans: (exhibitorData as any).qr_scans || 0,
        uniqueVisitors: (exhibitorData as any).unique_visitors || 0,
      })

      // 4. Produits récents
      const { data: productsData } = await supabase
        .from('exhibitor_products')
        .select('*')
        .eq('exhibitor_id', (exhibitorData as any).id)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentProducts(productsData || [])

      // 5. Staff
      const { data: staffData } = await supabase
        .from('exhibitor_staff')
        .select('*')
        .eq('exhibitor_id', (exhibitorData as any).id)
        .order('created_at', { ascending: false })

      setStaffMembers(staffData || [])
      setStats(prev => ({ ...prev, staff: staffData?.length || 0 }))

    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre dashboard...</p>
        </div>
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

  if (!exhibitor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-2xl font-bold mb-4">Aucun stand trouvé</h2>
          <p className="text-gray-600 mb-6">
            Vous n&apos;avez pas encore de stand pour cet événement.
          </p>
          <Link
            href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/inscription`}
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Réserver un stand
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mon Stand</h1>
              <p className="text-lg opacity-90">{exhibitor.company_name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/catalogue/${exhibitor.slug}`}
                target="_blank"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition"
              >
                <Eye className="h-5 w-5" />
                Voir ma page
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* STATUT INSCRIPTION */}
        {((exhibitor as any).approval_status || exhibitor.status) === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⏳</div>
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">Inscription en attente</h3>
                <p className="text-yellow-800 mb-4">
                  Votre inscription est en cours de validation. Vous recevrez un email de confirmation
                  dès que votre stand sera approuvé.
                </p>
                {exhibitor.payment_status === 'unpaid' && (
                  <p className="text-yellow-800">
                    <strong>Paiement en attente :</strong> {new Intl.NumberFormat('fr-FR').format(exhibitor.payment_amount || 0)} FCFA
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">{stats.products}</div>
                <div className="text-sm text-gray-600">Produits</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{stats.staff}</div>
                <div className="text-sm text-gray-600">Exposants</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{stats.pageViews}</div>
                <div className="text-sm text-gray-600">Vues</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <QrCode className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">{stats.qrScans}</div>
                <div className="text-sm text-gray-600">Scans QR</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">{stats.uniqueVisitors}</div>
                <div className="text-sm text-gray-600">Visiteurs uniques</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-2 space-y-8">
            {/* INFORMATIONS DU STAND */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Building className="h-6 w-6 text-purple-600" />
                  Informations du stand
                </h2>
                <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold">
                  <Edit className="h-4 w-4" />
                  Modifier
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Entreprise</label>
                  <p className="font-semibold">{exhibitor.company_name}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Catégorie</label>
                  <p className="font-semibold">{exhibitor.category || 'Non renseigné'}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Emplacement</label>
                  <p className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    {exhibitor.booth_number ? `Stand ${exhibitor.booth_number}` : 'En attente d&apos;attribution'}
                    {exhibitor.booth_location && ` - ${exhibitor.booth_location}`}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Statut</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    ((exhibitor as any).approval_status || exhibitor.status) === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : ((exhibitor as any).approval_status || exhibitor.status) === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {((exhibitor as any).approval_status || exhibitor.status) === 'approved' && '✅ Approuvé'}
                    {((exhibitor as any).approval_status || exhibitor.status) === 'pending' && '⏳ En attente'}
                    {((exhibitor as any).approval_status || exhibitor.status) === 'rejected' && '❌ Rejeté'}
                  </span>
                </div>
              </div>

              {exhibitor.description && (
                <div className="mt-6">
                  <label className="text-sm text-gray-600 block mb-2">Description</label>
                  <p className="text-gray-700">{exhibitor.description}</p>
                </div>
              )}

              {exhibitor.tags && exhibitor.tags.length > 0 && (
                <div className="mt-6">
                  <label className="text-sm text-gray-600 block mb-2">Mots-clés</label>
                  <div className="flex flex-wrap gap-2">
                    {exhibitor.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PRODUITS RÉCENTS */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <ShoppingBag className="h-6 w-6 text-purple-600" />
                  Mes produits
                </h2>
                <Link
                  href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/produits`}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Link>
              </div>

              {recentProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucun produit ajouté</p>
                  <Link
                    href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/produits`}
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Ajouter mon premier produit
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProducts.map((product: any) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition"
                    >
                      {product.featured_image ? (
                        <img
                          src={product.featured_image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="text-right">
                        {product.price && (
                          <p className="font-bold text-purple-600">
                            {new Intl.NumberFormat('fr-FR').format(product.price)} FCFA
                          </p>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.is_available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.is_available ? 'Disponible' : 'Indisponible'}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Link
                      href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/produits`}
                      className="text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      Voir tous mes produits →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COLONNE DROITE */}
          <div className="space-y-8">
            {/* ACTIONS RAPIDES */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
              <div className="space-y-3">
                <Link
                  href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/produits`}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition"
                >
                  <Package className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Gérer mes produits</span>
                </Link>

                <Link
                  href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/exposants`}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition"
                >
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Gérer mes exposants</span>
                </Link>

                <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition">
                  <QrCode className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Télécharger QR Code</span>
                </button>

                <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Voir les statistiques</span>
                </button>
              </div>
            </div>

            {/* EXPOSANTS */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Mes exposants
                </h2>
                <Link
                  href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/exposants`}
                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                >
                  Voir tout
                </Link>
              </div>

              {staffMembers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-4">Aucun exposant enregistré</p>
                  <Link
                    href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/exposants`}
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
                  >
                    Ajouter un exposant
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {staffMembers.slice(0, 3).map((staff: any) => (
                    <div
                      key={staff.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      {staff.badge_photo_url ? (
                        <img
                          src={staff.badge_photo_url}
                          alt={`${staff.first_name} ${staff.last_name}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {staff.first_name} {staff.last_name}
                        </p>
                        <p className="text-xs text-gray-600">{staff.function || 'Exposant'}</p>
                      </div>
                      {staff.badge_printed && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          ✓ Badge imprimé
                        </span>
                      )}
                    </div>
                  ))}
                  {staffMembers.length > 3 && (
                    <Link
                      href={`/${params.locale}/org/${orgSlug}/foires/${params.eventSlug}/mon-stand/exposants`}
                      className="block text-center text-purple-600 hover:text-purple-700 font-semibold text-sm pt-2"
                    >
                      Voir les {staffMembers.length - 3} autres →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

