'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useProductsStore } from '@/lib/store/products-store'

export default function Pagination() {
  const { currentPage, setCurrentPage, filteredProducts, itemsPerPage } = useProductsStore()
  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startPage = Math.max(1, currentPage - 2)
  const endPage = Math.min(totalPages, currentPage + 2)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, filteredProducts.length)

  if (totalPages <= 1) return null

  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="mt-12">
      {/* Informations sur les résultats */}
      <div className="text-center text-sm text-gray-600 mb-4">
        Affichage de {startItem} à {endItem} sur {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
      {/* Bouton Précédent */}
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Précédent
      </button>

      {/* Numéros de page */}
      <div className="flex gap-1">
        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-3 py-2 text-sm text-gray-400">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-3 py-2 text-sm text-gray-400">...</span>
            )}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Bouton Suivant */}
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Suivant
        <ChevronRight className="w-4 h-4" />
      </button>
      </div>
    </div>
  )
}
