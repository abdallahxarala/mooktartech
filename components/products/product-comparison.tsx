'use client'

import React, { useState } from 'react'
import { X, GitCompare } from 'lucide-react'
import { Product } from '@/lib/data/products'
import { formatPrice } from '@/lib/store/products-store'

interface ProductComparisonProps {
  products: Product[]
  onRemove: (productId: string) => void
  onClear: () => void
}

export default function ProductComparison({ products, onRemove, onClear }: ProductComparisonProps) {
  if (products.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Comparaison</h3>
            <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full">
              {products.length}/3
            </span>
          </div>
          <button
            onClick={onClear}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Liste des produits */}
        <div className="space-y-2 mb-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-xs text-orange-600 font-semibold">
                  {formatPrice(product.price)}
                </p>
              </div>
              <button
                onClick={() => onRemove(product.id)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Vider
          </button>
          <button
            disabled={products.length < 2}
            className="flex-1 px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Comparer
          </button>
        </div>
      </div>
    </div>
  )
}
