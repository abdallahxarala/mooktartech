'use client'

import React from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function PriceSortButtons() {
  const { sortBy, setSortBy } = useProductsStore()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Prix:</span>
      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => setSortBy('price-asc')}
          className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
            sortBy === 'price-asc'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ArrowUp className="w-3 h-3" />
          Croissant
        </button>
        <button
          onClick={() => setSortBy('price-desc')}
          className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors border-l border-gray-300 ${
            sortBy === 'price-desc'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ArrowDown className="w-3 h-3" />
          Décroissant
        </button>
      </div>
    </div>
  )
}
