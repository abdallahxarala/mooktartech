'use client'

import React from 'react'
import { RotateCcw } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'
import { categories, brands } from '@/lib/data/products'

export default function FiltersSidebar() {
  const { filters, setCategory, setPriceRange, toggleBrand, setStockStatus, resetFilters } = useProductsStore()

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </button>
      </div>

      {/* Catégories */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Catégories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Prix</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{filters.priceRange[0].toLocaleString('fr-FR')} XOF</span>
            <span>{filters.priceRange[1].toLocaleString('fr-FR')} XOF</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="2500000"
              step="10000"
              value={filters.priceRange[0]}
              onChange={(e) => setPriceRange(parseInt(e.target.value), filters.priceRange[1])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="range"
              min="0"
              max="2500000"
              step="10000"
              value={filters.priceRange[1]}
              onChange={(e) => setPriceRange(filters.priceRange[0], parseInt(e.target.value))}
              className="absolute top-0 w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Marques */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Marques</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="text-orange-500 focus:ring-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Disponibilité</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"
              value="all"
              checked={filters.stockStatus === 'all'}
              onChange={(e) => setStockStatus(e.target.value as any)}
              className="text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Tous</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"
              value="inStock"
              checked={filters.stockStatus === 'inStock'}
              onChange={(e) => setStockStatus(e.target.value as any)}
              className="text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">En stock uniquement</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"
              value="onOrder"
              checked={filters.stockStatus === 'onOrder'}
              onChange={(e) => setStockStatus(e.target.value as any)}
              className="text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Sur commande</span>
          </label>
        </div>
      </div>
    </div>
  )
}
