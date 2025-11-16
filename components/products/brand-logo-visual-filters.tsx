'use client'

import React from 'react'
import { useProductsStore } from '@/lib/store/products-store'

export default function BrandLogoVisualFilters() {
  const { filters, toggleBrand } = useProductsStore()

  const brands = [
    { 
      name: 'Evolis', 
      logo: '🖨️', 
      color: 'bg-blue-100 text-blue-700',
      borderColor: 'border-blue-500',
      count: 8
    },
    { 
      name: 'Zebra', 
      logo: '🦓', 
      color: 'bg-green-100 text-green-700',
      borderColor: 'border-green-500',
      count: 6
    },
    { 
      name: 'Fargo', 
      logo: '🏭', 
      color: 'bg-purple-100 text-purple-700',
      borderColor: 'border-purple-500',
      count: 5
    },
    { 
      name: 'Datacard', 
      logo: '💳', 
      color: 'bg-orange-100 text-orange-700',
      borderColor: 'border-orange-500',
      count: 4
    },
    { 
      name: 'Xarala', 
      logo: '⭐', 
      color: 'bg-yellow-100 text-yellow-700',
      borderColor: 'border-yellow-500',
      count: 4
    }
  ]

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Marques</h3>
      <div className="grid grid-cols-2 gap-2">
        {brands.map((brand) => (
          <button
            key={brand.name}
            onClick={() => toggleBrand(brand.name)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
              filters.brands.includes(brand.name)
                ? `${brand.color} border-2 ${brand.borderColor}`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-lg">{brand.logo}</span>
            <div className="flex-1 text-left">
              <div className="font-medium">{brand.name}</div>
              <div className="text-xs opacity-75">({brand.count})</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
