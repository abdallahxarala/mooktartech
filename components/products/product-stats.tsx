'use client'

import React from 'react'
import { useProductsStore } from '@/lib/store/products-store'

export default function ProductStats() {
  const { filteredProducts, products } = useProductsStore()
  
  const totalProducts = products.length
  const filteredCount = filteredProducts.length
  const categories = [...new Set(products.map(p => p.category))].length
  const brands = [...new Set(products.map(p => p.brand))].length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
        <div className="text-2xl font-bold text-orange-600">{totalProducts}</div>
        <div className="text-sm text-gray-600">Produits total</div>
      </div>
      <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
        <div className="text-2xl font-bold text-orange-600">{filteredCount}</div>
        <div className="text-sm text-gray-600">Résultats</div>
      </div>
      <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
        <div className="text-2xl font-bold text-orange-600">{categories}</div>
        <div className="text-sm text-gray-600">Catégories</div>
      </div>
      <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
        <div className="text-2xl font-bold text-orange-600">{brands}</div>
        <div className="text-sm text-gray-600">Marques</div>
      </div>
    </div>
  )
}
