'use client'

import React, { useState } from 'react'
import { Filter, X } from 'lucide-react'
import FiltersSidebar from './filters-sidebar'

export default function MobileFilters() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Bouton pour ouvrir les filtres */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors mb-4"
      >
        <Filter className="w-4 h-4" />
        Filtres
      </button>

      {/* Modal des filtres */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel des filtres */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              {/* Contenu des filtres */}
              <FiltersSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
