'use client'

import React from 'react'
import { CreditCard, Printer, Wrench, Smartphone } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function CategoryFilters() {
  const { filters, setCategory } = useProductsStore()

  const categories = [
    { 
      name: 'Toutes les catégories', 
      icon: null, 
      count: 24,
      color: 'text-gray-600'
    },
    { 
      name: 'Cartes PVC', 
      icon: CreditCard, 
      count: 8,
      color: 'text-blue-600'
    },
    { 
      name: 'Imprimantes professionnelles', 
      icon: Printer, 
      count: 8,
      color: 'text-green-600'
    },
    { 
      name: 'Accessoires', 
      icon: Wrench, 
      count: 4,
      color: 'text-purple-600'
    },
    { 
      name: 'Cartes virtuelles NFC', 
      icon: Smartphone, 
      count: 4,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Catégories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setCategory(category.name)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
              filters.category === category.name
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {category.icon && <category.icon className={`w-4 h-4 ${category.color}`} />}
            <span className="flex-1 text-left">{category.name}</span>
            <span className="text-xs text-gray-500">({category.count})</span>
          </button>
        ))}
      </div>
    </div>
  )
}
