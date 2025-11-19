'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useProductsSync } from '@/hooks/use-products-sync'
import { generateUniqueKey } from '@/lib/utils/brutal-sync'

export function FeaturedProducts() {
  const { products, isHydrated, lastUpdate } = useProductsSync()
  const params = useParams()
  const pathname = usePathname()
  
  // Détecter le contexte multitenant
  const locale = (params?.locale as string) || 'fr'
  const slug = params?.slug as string | undefined
  const isMultitenant = pathname?.includes('/org/') && slug
  const basePath = isMultitenant ? `/${locale}/org/${slug}` : `/${locale}`
  
  const featuredProducts = products.filter(p => p.featured).slice(0, 3)

  useEffect(() => {
    console.log('⭐ [FEATURED] Produits phares:', featuredProducts.length)
    console.log('📅 [FEATURED] Dernière update:', new Date(lastUpdate).toLocaleTimeString())
  }, [featuredProducts.length, lastUpdate])

  if (!isHydrated) {
    return (
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des produits phares...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Nos solutions phares
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Des produits professionnels adaptés à vos besoins d'identification
          </p>
        </div>

             {/* Products Grid */}
             <div className="grid md:grid-cols-3 gap-6 mb-12">
               {featuredProducts.map((product) => {
                 const uniqueKey = generateUniqueKey(`featured-${product.id}`)
                 return (
                   <Link
                     key={uniqueKey}
                     href={`${basePath}/shop`}
                     className="group relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-orange-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                   >
                     {/* Image avec key unique */}
                     <div className="mb-6 group-hover:scale-110 transition-transform">
                       {product.mainImage ? (
                         <img
                           key={generateUniqueKey(`featured-img-${product.id}`)}
                           src={product.mainImage}
                           alt={product.name}
                           className="w-20 h-20 object-cover rounded-xl"
                           loading="lazy"
                         />
                       ) : (
                         <div className="text-6xl">💳</div>
                       )}
                     </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h3>
              
              <p className="text-gray-600 mb-8">
                {product.shortDescription}
              </p>

              {/* Price & Arrow */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-4xl font-black text-gray-900">
                    {product.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">{product.priceUnit}</div>
                </div>
                
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-6 h-6 text-gray-600 group-hover:text-white" />
                </div>
                     </div>
                   </Link>
                 )
               })}
             </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={`${basePath}/shop`}
            className="inline-flex items-center gap-2 text-lg font-semibold text-orange-500 hover:text-orange-600 group"
          >
            <span>Voir tous les produits ({products.length})</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}