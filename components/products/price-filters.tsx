'use client'

import React from 'react'
import { useProductsStore } from '@/lib/store/products-store'

export default function PriceFilters() {
  const { setPriceRange } = useProductsStore()

  const priceRanges = [
    { label: 'Tous les prix', min: 0, max: 2500000 },
    { label: 'Moins de 1 000 XOF', min: 0, max: 1000 },
    { label: '1 000 - 10 000 XOF', min: 1000, max: 10000 },
    { label: '10 000 - 100 000 XOF', min: 10000, max: 100000 },
    { label: '100 000 - 1 000 000 XOF', min: 100000, max: 1000000 },
    { label: 'Plus de 1 000 000 XOF', min: 1000000, max: 2500000 }
  ]

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Gamme de prix</h3>
      <div className="space-y-2">
        {priceRanges.map((range, index) => (
          <button
            key={index}
            onClick={() => setPriceRange(range.min, range.max)}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  )
}
