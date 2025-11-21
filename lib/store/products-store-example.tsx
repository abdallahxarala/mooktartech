'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { useProducts, useProductsActions, useProductsFilters } from './products-store'

/**
 * Exemple d'utilisation du store des produits
 * Composant de démonstration des fonctionnalités
 */
export default function ProductsStoreExample() {
  const { 
    products, 
    filteredProducts, 
    isLoading, 
    error, 
    categories, 
    priceRange, 
    totalProducts, 
    filteredCount, 
    hasFilters 
  } = useProducts()
  
  const { 
    fetchProducts, 
    setCategory, 
    setPriceRange, 
    setSearch, 
    setSortBy, 
    reset, 
    clearError 
  } = useProductsActions()
  
  const { filters, sortBy } = useProductsFilters()

  // Charger les produits au montage
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Store des Produits - Exemple
      </h1>

      {/* État de chargement et erreurs */}
      <div className="space-y-4">
        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">Chargement des produits...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total produits</h3>
          <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Produits filtrés</h3>
          <p className="text-2xl font-bold text-gray-900">{filteredCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Catégories</h3>
          <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Plage de prix</h3>
          <p className="text-sm font-bold text-gray-900">
            {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} XOF
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtres</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtre par catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={filters.category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix maximum: {filters.priceRange[1].toLocaleString()} XOF
            </label>
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={filters.priceRange[1]}
              onChange={(e) => setPriceRange(0, parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{priceRange[0].toLocaleString()}</span>
              <span>{priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Tri */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trier par
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="name-asc">Nom A-Z</option>
            <option value="name-desc">Nom Z-A</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>

        {/* Boutons d'action */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Réinitialiser
          </button>
          <button
            onClick={() => fetchProducts()}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Recharger
          </button>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Produits ({filteredCount})
          </h2>
          {hasFilters && (
            <span className="text-sm text-gray-500">
              Filtres actifs
            </span>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {isLoading ? 'Chargement...' : 'Aucun produit trouvé'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-9 mb-3">
                  <Image
                    src={product.image_url || '/placeholder-product.jpg'}
                    alt={product.name}
                    width={400}
                    height={200}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary-600">
                    {product.price.toLocaleString()} XOF
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Stock: {product.stock} unités
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debug info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h3>
        <pre className="text-xs text-gray-600 overflow-auto">
          {JSON.stringify({
            totalProducts,
            filteredCount,
            hasFilters,
            filters,
            sortBy,
            isLoading,
            error: error ? 'Yes' : 'No'
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}
