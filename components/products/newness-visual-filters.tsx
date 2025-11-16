'use client'

import React from 'react'
import { Sparkles, Star } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function NewnessVisualFilters() {
  const { filteredProducts } = useProductsStore()

  const newProducts = filteredProducts.filter(product => product.isNew).length
  const allProducts = filteredProducts.length

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Nouveautés</h3>
      <div className="space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded-lg transition-colors hover:bg-orange-200">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="flex-1 text-left">Nouveaux produits</span>
          <span className="text-xs opacity-75">({newProducts})</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg transition-colors hover:bg-gray-200">
          <Star className="w-4 h-4 text-gray-500" />
          <span className="flex-1 text-left">Tous les produits</span>
          <span className="text-xs opacity-75">({allProducts})</span>
        </button>
      </div>
    </div>
  )
}
