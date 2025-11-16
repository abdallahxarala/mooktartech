'use client'

import React from 'react'
import { Star } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function RatingFilters() {
  const { filteredProducts } = useProductsStore()

  const ratingOptions = [
    { value: 5, label: '5 étoiles', count: 0 },
    { value: 4, label: '4 étoiles et plus', count: 0 },
    { value: 3, label: '3 étoiles et plus', count: 0 },
    { value: 2, label: '2 étoiles et plus', count: 0 },
    { value: 1, label: '1 étoile et plus', count: 0 }
  ]

  // Calculer le nombre de produits pour chaque note
  const ratingCounts = ratingOptions.map(option => ({
    ...option,
    count: filteredProducts.filter(product => product.rating >= option.value).length
  }))

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Note des clients</h3>
      <div className="space-y-2">
        {ratingCounts.map((option) => (
          <button
            key={option.value}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < option.value
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="flex-1 text-left">{option.label}</span>
            <span className="text-xs text-gray-500">({option.count})</span>
          </button>
        ))}
      </div>
    </div>
  )
}
