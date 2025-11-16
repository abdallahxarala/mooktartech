'use client'

import React from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function SortDropdown() {
  const { sortBy, setSortBy } = useProductsStore()

  const sortOptions = [
    { value: 'relevance', label: 'Pertinence', icon: ArrowUpDown },
    { value: 'price-asc', label: 'Prix croissant', icon: ArrowUp },
    { value: 'price-desc', label: 'Prix décroissant', icon: ArrowDown },
    { value: 'name-asc', label: 'Nom A-Z', icon: ArrowUp },
    { value: 'newest', label: 'Nouveautés', icon: ArrowUpDown }
  ]

  const currentOption = sortOptions.find(option => option.value === sortBy)

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Trier par:</label>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {currentOption && <currentOption.icon className="w-4 h-4 text-gray-600" />}
        </div>
      </div>
    </div>
  )
}
