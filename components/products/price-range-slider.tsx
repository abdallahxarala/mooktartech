'use client'

import React from 'react'
import { useProductsStore } from '@/lib/store/products-store'

export default function PriceRangeSlider() {
  const { filters, setPriceRange } = useProductsStore()

  const formatPrice = (price: number) => {
    if (price === 0) return '0 XOF'
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M XOF`
    if (price >= 1000) return `${(price / 1000).toFixed(0)}K XOF`
    return `${price} XOF`
  }

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Gamme de prix</h3>
      
      {/* Affichage des valeurs */}
      <div className="flex justify-between text-sm text-gray-600 mb-3">
        <span>{formatPrice(filters.priceRange[0])}</span>
        <span>{formatPrice(filters.priceRange[1])}</span>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="2500000"
          step="10000"
          value={filters.priceRange[0]}
          onChange={(e) => setPriceRange(parseInt(e.target.value), filters.priceRange[1])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <input
          type="range"
          min="0"
          max="2500000"
          step="10000"
          value={filters.priceRange[1]}
          onChange={(e) => setPriceRange(filters.priceRange[0], parseInt(e.target.value))}
          className="absolute top-0 w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Boutons de prix prédéfinis */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          onClick={() => setPriceRange(0, 10000)}
          className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-colors"
        >
          Moins de 10K
        </button>
        <button
          onClick={() => setPriceRange(10000, 100000)}
          className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-colors"
        >
          10K - 100K
        </button>
        <button
          onClick={() => setPriceRange(100000, 1000000)}
          className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-colors"
        >
          100K - 1M
        </button>
        <button
          onClick={() => setPriceRange(1000000, 2500000)}
          className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-colors"
        >
          Plus de 1M
        </button>
      </div>
    </div>
  )
}
