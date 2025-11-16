'use client'

import React from 'react'
import { CreditCard, Printer, Wrench, Smartphone } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function CategoryIconVisualUltraUltraAdvancedFilters() {
  const { filters, setCategory } = useProductsStore()

  const categories = [
    { 
      name: 'Toutes les catégories', 
      icon: null, 
      count: 24,
      color: 'bg-gray-100 text-gray-700',
      borderColor: 'border-gray-500',
      iconColor: 'text-gray-600'
    },
    { 
      name: 'Cartes PVC', 
      icon: CreditCard, 
      count: 8,
      color: 'bg-blue-100 text-blue-700',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-600'
    },
    { 
      name: 'Imprimantes professionnelles', 
      icon: Printer, 
      count: 8,
      color: 'bg-green-100 text-green-700',
      borderColor: 'border-green-500',
      iconColor: 'text-green-600'
    },
    { 
      name: 'Accessoires', 
      icon: Wrench, 
      count: 4,
      color: 'bg-purple-100 text-purple-700',
      borderColor: 'border-purple-500',
      iconColor: 'text-purple-600'
    },
    { 
      name: 'Cartes virtuelles NFC', 
      icon: Smartphone, 
      count: 4,
      color: 'bg-orange-100 text-orange-700',
      borderColor: 'border-orange-500',
      iconColor: 'text-orange-600'
    }
  ]

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Catégories</h3>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setCategory(category.name)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
              filters.category === category.name
                ? `${category.color} border-2 ${category.borderColor}`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.icon && <category.icon className={`w-4 h-4 ${category.iconColor}`} />}
            <div className="flex-1 text-left">
              <div className="font-medium">{category.name}</div>
              <div className="text-xs opacity-75">({category.count})</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
