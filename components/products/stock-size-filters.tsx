'use client'

import React from 'react'
import { Package, AlertTriangle, Clock } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function StockSizeFilters() {
  const { filteredProducts } = useProductsStore()

  const stockSizes = [
    { 
      label: 'Stock élevé (50+)', 
      icon: Package, 
      color: 'text-green-600',
      count: filteredProducts.filter(p => p.stock > 50).length
    },
    { 
      label: 'Stock moyen (10-50)', 
      icon: AlertTriangle, 
      color: 'text-yellow-600',
      count: filteredProducts.filter(p => p.stock >= 10 && p.stock <= 50).length
    },
    { 
      label: 'Stock faible (1-9)', 
      icon: Clock, 
      color: 'text-orange-600',
      count: filteredProducts.filter(p => p.stock >= 1 && p.stock < 10).length
    },
    { 
      label: 'Sur commande (0)', 
      icon: Clock, 
      color: 'text-red-600',
      count: filteredProducts.filter(p => p.stock === 0).length
    }
  ]

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Taille du stock</h3>
      <div className="space-y-2">
        {stockSizes.map((size, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <size.icon className={`w-4 h-4 ${size.color}`} />
            <span className="flex-1 text-left">{size.label}</span>
            <span className="text-xs text-gray-500">({size.count})</span>
          </button>
        ))}
      </div>
    </div>
  )
}
