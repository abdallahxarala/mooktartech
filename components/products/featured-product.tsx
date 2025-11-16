'use client'

import React from 'react'
import { Star } from 'lucide-react'
import { Product } from '@/lib/data/products'
import { formatPrice } from '@/lib/store/products-store'

interface FeaturedProductProps {
  product: Product
}

export default function FeaturedProduct({ product }: FeaturedProductProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badge Featured */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-lg">
            En vedette
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-semibold text-gray-900">{product.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-orange-600">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-gray-500">
            {product.brand}
          </span>
        </div>
      </div>
    </div>
  )
}
