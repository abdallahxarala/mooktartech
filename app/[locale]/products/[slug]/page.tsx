'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react'
import { SEOHead } from '@/components/seo-head'
import { ProductPlaceholder } from '@/components/product-placeholder'
import { useProduct } from '@/hooks/use-products'

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] || ''
  const { product, isLoading, error } = useProduct(slug)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Produit non trouvé</h1>
          <p className="text-gray-600 mb-8">Ce produit n'existe pas ou a été supprimé</p>
          <Link
            href="/fr/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au catalogue</span>
          </Link>
        </div>
      </div>
    )
  }

  const displayImage = product.image_url || product.gallery?.[0]
  const galleryImages = product.gallery || []

  return (
    <>
      {/* SEO Head */}
      {(product.meta_title || product.meta_description) && (
        <SEOHead
          title={product.meta_title || product.name}
          description={product.meta_description || product.short_description || product.description || ''}
          keywords={product.meta_keywords || []}
          ogTitle={product.og_title || product.meta_title || product.name}
          ogDescription={product.og_description || product.meta_description || product.short_description || ''}
          canonicalUrl={product.canonical_url || `/fr/products/${product.slug}`}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 py-6">
            <Link
              href="/fr/products"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour au catalogue</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="sticky top-6">
                <div className="aspect-square bg-white rounded-2xl border-2 border-gray-200 overflow-hidden mb-4">
                  {displayImage && !displayImage.includes('placeholder') ? (
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : null}

                  <ProductPlaceholder
                    productName={product.name}
                    productId={product.id}
                    className="w-full h-full"
                  />
                </div>

                {/* Miniatures */}
                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {galleryImages.map((img: any, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-white rounded-lg border-2 border-gray-200 hover:border-orange-500 cursor-pointer overflow-hidden transition-all"
                      >
                        {img && !img.includes('placeholder') ? (
                          <img
                            src={img}
                            alt={`${product.name} ${i + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : null}

                        <ProductPlaceholder
                          productName={`${product.name} ${i + 1}`}
                          productId={`${product.id}-${i}`}
                          className="w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div>
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product.is_featured && (
                  <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">
                    ⭐ Produit Phare
                  </span>
                )}
                {product.is_new && (
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                    ✨ Nouveau
                  </span>
                )}
              </div>

              {/* Marque */}
              {product.brand && (
                <div className="text-sm text-gray-500 mb-2">{product.brand}</div>
              )}

              {/* Nom */}
              <h1 className="text-4xl font-black text-gray-900 mb-4">{product.name}</h1>

              {/* Description courte */}
              {product.short_description && (
                <p className="text-xl text-gray-600 mb-6">{product.short_description}</p>
              )}

              {/* Prix */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white mb-8">
                <div className="text-sm opacity-80 mb-2">Prix</div>
                <div className="text-5xl font-black mb-2">
                  {product.price.toLocaleString()}
                </div>
                <div className="text-xl">{product.price_unit || 'XOF'}</div>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-3 mb-8">
                {product.stock > 0 ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-lg font-semibold text-green-600">
                      En stock ({product.stock} unités disponibles)
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <span className="text-lg font-semibold text-red-600">Rupture de stock</span>
                  </>
                )}
              </div>

              {/* CTA */}
              <div className="space-y-4 mb-12">
                <Link
                  href={`/fr/contact?product=${encodeURIComponent(product.name)}`}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-orange-500 text-white text-lg font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>Demander un devis</span>
                </Link>

                <a
                  href="tel:+221775398139"
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-200 text-gray-900 text-lg font-semibold rounded-xl hover:border-orange-500 transition-all"
                >
                  📞 Appeler : +221 77 539 81 39
                </a>
              </div>

              {/* Description complète */}
              {product.description && (
                <div className="prose max-w-none mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                  <div className="text-gray-700 whitespace-pre-line">{product.description}</div>
                </div>
              )}

              {/* Caractéristiques */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Caractéristiques principales
                  </h2>
                  <div className="grid gap-3">
                    {product.features.map((feature: any, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200"
                      >
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications */}
              {product.applications && product.applications.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Applications</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.applications.map((app: any, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Spécifications techniques */}
              {product.specifications && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Spécifications techniques
                  </h2>
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <tbody className="divide-y divide-gray-200">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <tr key={key}>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
