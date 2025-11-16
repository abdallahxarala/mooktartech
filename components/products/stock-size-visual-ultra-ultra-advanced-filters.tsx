'use client'

import React from 'react'
import { Package, AlertTriangle, Clock, XCircle } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function StockSizeVisualUltraUltraAdvancedFilters() {
  const { filteredProducts } = useProductsStore()

  const stockSizes = [
    { 
      label: 'Stock élevé (50+)', 
      icon: Package, 
      color: 'bg-green-100 text-green-700',
      borderColor: 'border-green-500',
      iconColor: 'text-green-600',
      count: filteredProducts.filter(p => p.stock > 50).length
    },
    { 
      label: 'Stock moyen (10-50)', 
      icon: AlertTriangle, 
      color: 'bg-yellow-100 text-yellow-700',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-600',
      count: filteredProducts.filter(p => p.stock >= 10 && p.stock <= 50).length
    },
    { 
      label: 'Stock faible (1-9)', 
      icon: Clock, 
      color: 'bg-orange-100 text-orange-700',
      borderColor: 'border-orange-500',
      iconColor: 'text-orange-600',
      count: filteredProducts.filter(p => p.stock >= 1 && p.stock < 10).length
    },
    { 
      label: 'Sur commande (0)', 
      icon: XCircle, 
      color: 'bg-red-100 text-red-700',
      borderColor: 'border-red-500',
      iconColor: 'text-red-600',
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
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors hover:opacity-80 ${size.color}`}
          >
            <size.icon className={`w-4 h-4 ${size.iconColor}`} />
            <span className="flex-1 text-left">{size.label}</span>
            <span className="text-xs opacity-75">({size.count})</span>
          </button>
        ))}
      </div>
    </div>
  )
}
