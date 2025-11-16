'use client'

import React from 'react'
import { useProductsStore } from '@/lib/store/products-store'

export default function PriceVisualAdvancedFilters() {
  const { setPriceRange } = useProductsStore()

  const priceRanges = [
    { 
      label: 'Tous les prix', 
      min: 0, 
      max: 2500000,
      color: 'bg-gray-100 text-gray-700',
      borderColor: 'border-gray-500',
      icon: '💰'
    },
    { 
      label: 'Moins de 1K', 
      min: 0, 
      max: 1000,
      color: 'bg-green-100 text-green-700',
      borderColor: 'border-green-500',
      icon: '💚'
    },
    { 
      label: '1K - 10K', 
      min: 1000, 
      max: 10000,
      color: 'bg-blue-100 text-blue-700',
      borderColor: 'border-blue-500',
      icon: '💙'
    },
    { 
      label: '10K - 100K', 
      min: 10000, 
      max: 100000,
      color: 'bg-purple-100 text-purple-700',
      borderColor: 'border-purple-500',
      icon: '💜'
    },
    { 
      label: '100K - 1M', 
      min: 100000, 
      max: 1000000,
      color: 'bg-orange-100 text-orange-700',
      borderColor: 'border-orange-500',
      icon: '🧡'
    },
    { 
      label: 'Plus de 1M', 
      min: 1000000, 
      max: 2500000,
      color: 'bg-red-100 text-red-700',
      borderColor: 'border-red-500',
      icon: '❤️'
    }
  ]

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Gamme de prix</h3>
      <div className="grid grid-cols-2 gap-2">
        {priceRanges.map((range, index) => (
          <button
            key={index}
            onClick={() => setPriceRange(range.min, range.max)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors hover:opacity-80 ${range.color}`}
          >
            <span className="text-lg">{range.icon}</span>
            <span className="flex-1 text-left">{range.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
