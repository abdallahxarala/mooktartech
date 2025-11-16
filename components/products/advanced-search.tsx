'use client'

import React, { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function AdvancedSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const { filters, setSearch, setCategory, setPriceRange, toggleBrand, setStockStatus } = useProductsStore()

  return (
    <div className="mb-8">
      {/* Barre de recherche principale */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Recherche avancée */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recherche avancée</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={filters.category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Toutes les catégories">Toutes les catégories</option>
                <option value="Cartes PVC">Cartes PVC</option>
                <option value="Imprimantes professionnelles">Imprimantes professionnelles</option>
                <option value="Accessoires">Accessoires</option>
                <option value="Cartes virtuelles NFC">Cartes virtuelles NFC</option>
              </select>
            </div>

            {/* Prix min */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix minimum</label>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => setPriceRange(parseInt(e.target.value) || 0, filters.priceRange[1])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Prix max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix maximum</label>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => setPriceRange(filters.priceRange[0], parseInt(e.target.value) || 2500000)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="2500000"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
