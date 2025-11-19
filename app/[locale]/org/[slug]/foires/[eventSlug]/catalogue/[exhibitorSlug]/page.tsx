import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Globe, Mail, Phone, Share2, QrCode, ArrowLeft } from 'lucide-react'

interface ExhibitorDetailPageProps {
  params: {
    locale: string
    slug: string
    eventSlug: string
    exhibitorSlug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function ExhibitorDetailPage({
  params,
}: ExhibitorDetailPageProps) {
  const supabase = await createSupabaseServerClient()

  // 1. Récupérer l'événement
  const { data: event } = await supabase
    .from('events')
    .select('id, name, slug')
    .eq('slug', params.eventSlug)
    .single()

  if (!event) {
    notFound()
  }

  // 2. Récupérer l'exposant
  const { data: exhibitor } = await supabase
    .from('exhibitors')
    .select('*')
    .eq('event_id', event.id)
    .eq('slug', params.exhibitorSlug)
    .single()

  // Vérifier que l'exposant est approuvé (utiliser approval_status si disponible, sinon status)
  const isApproved = (exhibitor as any).approval_status === 'approved' || exhibitor.status === 'approved'
  if (!exhibitor || !isApproved) {
    notFound()
  }

  // 3. Compter les produits et récupérer les stats
  const { count: productsCount } = await supabase
    .from('exhibitor_products')
    .select('*', { count: 'exact', head: true })
    .eq('exhibitor_id', exhibitor.id)

  // 4. Récupérer les interactions pour les stats
  const { data: interactions } = await supabase
    .from('exhibitor_interactions')
    .select('interaction_type')
    .eq('exhibitor_id', exhibitor.id)

  const pageViews = interactions?.filter(i => i.interaction_type === 'page_view').length || 0
  const qrScans = interactions?.filter(i => i.interaction_type === 'qr_scan').length || 0

  // 5. Récupérer les produits de l'exposant
  const { data: products } = await supabase
    .from('exhibitor_products')
    .select('*')
    .eq('exhibitor_id', exhibitor.id)
    .eq('is_available', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  // 6. Parser social links
  const socialLinks = (exhibitor.social_links as any) || {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* BANNIÈRE */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600">
        {exhibitor.banner_url ? (
          <img
            src={exhibitor.banner_url}
            alt={exhibitor.company_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
            🏢
          </div>
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container mx-auto px-4">
        {/* HEADER EXPOSANT */}
        <div className="bg-white rounded-lg shadow-lg -mt-16 relative z-10 p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-4 w-32 h-32 flex items-center justify-center">
                {exhibitor.logo_url ? (
                  <img
                    src={exhibitor.logo_url}
                    alt={exhibitor.company_name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-6xl">🏢</span>
                )}
              </div>
            </div>

            {/* Infos principales */}
            <div className="flex-1">
              {/* Breadcrumb */}
              <div className="mb-4">
                <Link
                  href={`/${params.locale}/org/${params.slug}/foires/${params.eventSlug}/catalogue`}
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-2 text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour au catalogue
                </Link>
              </div>

              <h1 className="text-4xl font-bold mb-3">{exhibitor.company_name}</h1>

              {exhibitor.category && (
                <span className="inline-block bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  {exhibitor.category}
                </span>
              )}

              {exhibitor.description && (
                <p className="text-gray-700 mb-6">{exhibitor.description}</p>
              )}

              {/* Localisation stand */}
              {exhibitor.booth_number && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Stand {exhibitor.booth_number}</span>
                  {exhibitor.booth_location && (
                    <span className="text-sm">• {exhibitor.booth_location}</span>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                {(productsCount || 0) > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {productsCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Produits</div>
                  </div>
                )}
                {pageViews > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {pageViews}
                    </div>
                    <div className="text-sm text-gray-600">Vues</div>
                  </div>
                )}
                {qrScans > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {qrScans}
                    </div>
                    <div className="text-sm text-gray-600">Scans QR</div>
                  </div>
                )}
              </div>

              {/* Contact & Liens */}
              <div className="flex flex-wrap gap-4">
                {exhibitor.website && (
                  <a
                    href={exhibitor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition"
                  >
                    <Globe className="h-5 w-5" />
                    <span>Site web</span>
                  </a>
                )}
                {exhibitor.contact_email && (
                  <a
                    href={`mailto:${exhibitor.contact_email}`}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Email</span>
                  </a>
                )}
                {exhibitor.contact_phone && (
                  <a
                    href={`tel:${exhibitor.contact_phone}`}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Téléphone</span>
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {exhibitor.qr_code_url && (
                <button className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                  <QrCode className="h-5 w-5" />
                  Voir QR Code
                </button>
              )}
              <button className="flex items-center justify-center gap-2 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg font-semibold transition">
                <Share2 className="h-5 w-5" />
                Partager
              </button>
            </div>
          </div>

          {/* Tags */}
          {exhibitor.tags && exhibitor.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {exhibitor.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PRODUITS */}
        <div className="mt-8 mb-16">
          <h2 className="text-3xl font-bold mb-6">
            Nos Produits {products && products.length > 0 && `(${products.length})`}
          </h2>

          {!products || products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 text-lg">
                Aucun produit disponible pour le moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  {/* Image produit */}
                  <div className="relative h-48 bg-gray-100">
                    {product.featured_image || (product.images && product.images[0]) ? (
                      <img
                        src={product.featured_image || product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        📦
                      </div>
                    )}
                    {product.is_featured && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        ⭐ Vedette
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>

                    {product.category && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mb-3">
                        {product.category}
                      </span>
                    )}

                    {product.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {product.description}
                      </p>
                    )}

                    {/* Prix */}
                    {product.price_on_request ? (
                      <div className="text-lg font-semibold text-purple-600 mb-4">
                        Prix sur demande
                      </div>
                    ) : product.price ? (
                      <div className="text-2xl font-bold text-purple-600 mb-4">
                        {new Intl.NumberFormat('fr-FR').format(product.price)}{' '}
                        <span className="text-sm">{product.currency || 'FCFA'}</span>
                      </div>
                    ) : null}

                    {/* Stock */}
                    {!product.unlimited_stock && product.stock_quantity !== null && (
                      <div className="text-sm text-gray-600 mb-4">
                        {product.stock_quantity > 0 ? (
                          <span className="text-green-600">
                            ✓ En stock ({product.stock_quantity} disponible{product.stock_quantity > 1 ? 's' : ''})
                          </span>
                        ) : (
                          <span className="text-red-600">✗ Rupture de stock</span>
                        )}
                      </div>
                    )}

                    {/* Tags produits */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.tags.slice(0, 3).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Boutons */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm">
                        Plus d&apos;infos
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition">
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA CONTACT */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Intéressé par nos produits ?</h2>
          <p className="text-xl mb-6">
            Contactez-nous pour plus d&apos;informations ou visitez notre stand
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {exhibitor.contact_email && (
              <a
                href={`mailto:${exhibitor.contact_email}`}
                className="bg-white hover:bg-gray-100 text-purple-600 px-8 py-3 rounded-full font-semibold transition"
              >
                📧 Envoyer un email
              </a>
            )}
            {exhibitor.contact_phone && (
              <a
                href={`tel:${exhibitor.contact_phone}`}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition"
              >
                📞 Appeler
              </a>
            )}
            {exhibitor.booth_number && (
              <Link
                href={`/${params.locale}/org/${params.slug}/foires/${params.eventSlug}/catalogue`}
                className="border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-full font-semibold transition"
              >
                📍 Voir le plan
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

