'use client'

import React from 'react'
import { useProductsStore } from '@/lib/store/products-store'

export default function QuickFilters() {
  const { setCategory, setStockStatus } = useProductsStore()

  const quickFilters = [
    { label: 'Tous', value: 'Toutes les catégories', category: 'all' },
    { label: 'Cartes PVC', value: 'Cartes PVC', category: 'pvc' },
    { label: 'Imprimantes', value: 'Imprimantes professionnelles', category: 'printers' },
    { label: 'Accessoires', value: 'Accessoires', category: 'accessories' },
    { label: 'NFC', value: 'Cartes virtuelles NFC', category: 'nfc' }
  ]

  const stockFilters = [
    { label: 'En stock', value: 'inStock' },
    { label: 'Sur commande', value: 'onOrder' }
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* Filtres de catégorie */}
      {quickFilters.map((filter) => (
        <button
          key={filter.category}
          onClick={() => setCategory(filter.value)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:border-orange-500 hover:text-orange-600 transition-colors"
        >
          {filter.label}
        </button>
      ))}
      
      {/* Séparateur */}
      <div className="w-px h-6 bg-gray-300 mx-2" />
      
      {/* Filtres de stock */}
      {stockFilters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setStockStatus(filter.value as any)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:border-orange-500 hover:text-orange-600 transition-colors"
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
