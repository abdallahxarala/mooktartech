'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function SearchBar() {
  const { filters, setSearch, filteredProducts } = useProductsStore()

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
      {/* Barre de recherche */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Nombre de résultats */}
      <div className="text-sm text-gray-600">
        {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
      </div>

      {/* Dropdown de tri */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Trier par:</label>
        <select
          value={useProductsStore.getState().sortBy}
          onChange={(e) => useProductsStore.getState().setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        >
          <option value="relevance">Pertinence</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name-asc">Nom A-Z</option>
          <option value="newest">Nouveautés</option>
        </select>
      </div>
    </div>
  )
}
