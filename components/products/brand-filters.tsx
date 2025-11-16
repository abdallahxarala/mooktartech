'use client'

import React from 'react'
import { useProductsStore } from '@/lib/store/products-store'

export default function BrandFilters() {
  const { filters, toggleBrand } = useProductsStore()

  const brands = [
    { name: 'Evolis', logo: '🖨️', count: 8 },
    { name: 'Zebra', logo: '🦓', count: 6 },
    { name: 'Fargo', logo: '🏭', count: 5 },
    { name: 'Datacard', logo: '💳', count: 4 },
    { name: 'Xarala', logo: '⭐', count: 4 }
  ]

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Marques</h3>
      <div className="space-y-2">
        {brands.map((brand) => (
          <label key={brand.name} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.brands.includes(brand.name)}
              onChange={() => toggleBrand(brand.name)}
              className="text-orange-500 focus:ring-orange-500 rounded"
            />
            <span className="text-lg">{brand.logo}</span>
            <div className="flex-1">
              <span className="text-sm text-gray-700">{brand.name}</span>
              <span className="text-xs text-gray-500 ml-2">({brand.count})</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
