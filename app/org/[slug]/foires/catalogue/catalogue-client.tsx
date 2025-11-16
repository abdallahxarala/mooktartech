/**
 * Client component pour le catalogue produits
 */

'use client'

import { useState } from 'react'
import { ProductGrid } from '@/components/catalog/product-grid'
import { ProductFilters } from '@/components/catalog/product-filters'
import { ProductDetail } from '@/components/catalog/product-detail'
import { useCatalogProducts, type ProductFilters as ProductFiltersType } from '@/lib/hooks/use-catalog-products'
import type { ExhibitorProduct } from '@/lib/types/exhibitor-product'
import { Card, CardContent } from '@/components/ui/card'
import { Package, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CatalogueClientProps {
  organizationSlug: string
  eventId: string
  eventName: string
  categories: string[]
  exhibitors: { id: string; name: string }[]
  priceRange?: { min: number; max: number }
}

export function CatalogueClient({
  organizationSlug,
  eventId,
  eventName,
  categories,
  exhibitors,
  priceRange,
}: CatalogueClientProps) {
  const [filters, setFilters] = useState<ProductFiltersType>({})
  const [selectedProduct, setSelectedProduct] = useState<
    (ExhibitorProduct & { exhibitor_name?: string; exhibitor_booth?: string }) | null
  >(null)
  const [showFilters, setShowFilters] = useState(false)

  const { products, isLoading, error, hasMore, loadMore, total } = useCatalogProducts({
    eventId,
    filters,
  })

  const handleViewDetail = (product: ExhibitorProduct) => {
    const fullProduct = products.find((p) => p.id === product.id)
    setSelectedProduct(fullProduct || null)
  }

  const handleOrder = (product: ExhibitorProduct) => {
    // TODO: Implémenter la commande
    console.log('Order product:', product)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 pb-24 pt-24">
      <div className="container mx-auto max-w-7xl px-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Catalogue Produits
          </h1>
          <p className="text-lg text-gray-600">{eventName}</p>
          {total > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {total} produit{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Filters toggle (mobile) */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Masquer' : 'Afficher'} les filtres
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <div className={showFilters ? 'block' : 'hidden lg:block'}>
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
              exhibitors={exhibitors}
              priceRange={priceRange}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {error ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-red-500 mb-2">Erreur</p>
                    <p className="text-gray-600">{error}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ProductGrid
                products={products}
                isLoading={isLoading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                onViewDetail={handleViewDetail}
                onOrder={handleOrder}
              />
            )}
          </div>
        </div>

        {/* Product detail modal */}
        <ProductDetail
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOrder={handleOrder}
        />
      </div>
    </div>
  )
}

