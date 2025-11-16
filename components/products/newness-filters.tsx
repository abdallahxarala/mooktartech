'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function NewnessFilters() {
  const { filteredProducts } = useProductsStore()

  const newProducts = filteredProducts.filter(product => product.isNew).length
  const allProducts = filteredProducts.length

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Nouveautés</h3>
      <div className="space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="flex-1 text-left">Nouveaux produits</span>
          <span className="text-xs text-gray-500">({newProducts})</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          <span className="w-4 h-4 text-gray-400">●</span>
          <span className="flex-1 text-left">Tous les produits</span>
          <span className="text-xs text-gray-500">({allProducts})</span>
        </button>
      </div>
    </div>
  )
}
