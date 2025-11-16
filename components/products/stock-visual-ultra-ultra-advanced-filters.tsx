'use client'

import React from 'react'
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function StockVisualUltraUltraAdvancedFilters() {
  const { filters, setStockStatus } = useProductsStore()

  const stockOptions = [
    { 
      value: 'all', 
      label: 'Tous les produits', 
      icon: null,
      color: 'bg-gray-100 text-gray-700',
      borderColor: 'border-gray-500',
      iconColor: 'text-gray-600',
      count: 24
    },
    { 
      value: 'inStock', 
      label: 'En stock', 
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700',
      borderColor: 'border-green-500',
      iconColor: 'text-green-600',
      count: 18
    },
    { 
      value: 'onOrder', 
      label: 'Sur commande', 
      icon: Clock,
      color: 'bg-orange-100 text-orange-700',
      borderColor: 'border-orange-500',
      iconColor: 'text-orange-600',
      count: 6
    }
  ]

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Disponibilité</h3>
      <div className="space-y-2">
        {stockOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setStockStatus(option.value as any)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
              filters.stockStatus === option.value
                ? `${option.color} border-2 ${option.borderColor}`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.icon && <option.icon className={`w-4 h-4 ${option.iconColor}`} />}
            <span className="flex-1 text-left">{option.label}</span>
            <span className="text-xs opacity-75">({option.count})</span>
          </button>
        ))}
      </div>
    </div>
  )
}
