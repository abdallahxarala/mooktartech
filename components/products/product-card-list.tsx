'use client'

import React from 'react'
import Image from 'next/image'
import { Star, ShoppingCart, Eye, GitCompare } from 'lucide-react'
import { Product } from '@/lib/data/products'
import { formatPrice, getStockStatus, useProductsStore } from '@/lib/store/products-store'

interface ProductCardListProps {
  product: Product
}

export default function ProductCardList({ product }: ProductCardListProps) {
  const stockInfo = getStockStatus(product.stock)
  const { addToComparison, comparisonProducts } = useProductsStore()
  
  const isInComparison = comparisonProducts.find(p => p.id === product.id)
  const canAddToComparison = comparisonProducts.length < 3 && !isInComparison

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in-up">
      <div className="flex gap-6">
        {/* Image */}
        <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-lg">
              {product.category}
            </span>
          </div>
          
          {product.isNew && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg">
                Nouveau
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${stockInfo.color}`}>
              {stockInfo.status}
            </span>
          </div>

          <p className="text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating et marque */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                ({product.rating}) {product.reviewCount} avis
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {product.brand}
            </span>
          </div>

          {/* Prix et actions */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            
            <div className="flex items-center gap-2">
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={() => addToComparison(product)}
                disabled={!canAddToComparison}
                className={`p-2 rounded-lg transition-colors ${
                  isInComparison 
                    ? 'bg-green-500 text-white' 
                    : canAddToComparison 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <GitCompare className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
