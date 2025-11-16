/**
 * Grille de produits avec infinite scroll
 */

'use client'

import { useEffect, useRef } from 'react'
import { ProductCard } from './product-card'
import { useInView } from 'react-intersection-observer'
import { Loader2 } from 'lucide-react'
import type { ExhibitorProduct } from '@/lib/types/exhibitor-product'

interface ProductGridProps {
  products: (ExhibitorProduct & { exhibitor_name?: string; exhibitor_booth?: string })[]
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
  onViewDetail: (product: ExhibitorProduct) => void
  onOrder?: (product: ExhibitorProduct) => void
}

export function ProductGrid({
  products,
  isLoading,
  hasMore,
  onLoadMore,
  onViewDetail,
  onOrder,
}: ProductGridProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore()
    }
  }, [inView, hasMore, isLoading, onLoadMore])

  if (products.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
        <p className="text-gray-400 text-sm mt-2">
          Essayez de modifier vos filtres de recherche
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetail={onViewDetail}
            onOrder={onOrder}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={ref} className="flex justify-center py-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Chargement...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Tous les produits ont été chargés</p>
        </div>
      )}
    </div>
  )
}

