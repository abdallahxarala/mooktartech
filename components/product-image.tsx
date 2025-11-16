'use client'

import React from 'react'
import { ProductPlaceholder } from './product-placeholder'

interface ProductImageProps {
  src?: string
  alt?: string
  productId?: string
  productName?: string
  brand?: string
  className?: string
  product?: any
  renderKey?: number
}

export function ProductImage({ 
  src, 
  alt, 
  productId, 
  productName, 
  brand, 
  className = '', 
  product,
  renderKey 
}: ProductImageProps) {
  // Si product est passé, utiliser ses propriétés
  const imageSrc = src || product?.mainImage
  const imageAlt = alt || product?.name
  const id = productId || product?.id
  const name = productName || product?.name

  const displayImage = imageSrc 
    ? `${imageSrc.split('?')[0]}${renderKey ? `?v=${renderKey}` : ''}`
    : null

  return (
    <div className={`relative ${className}`}>
      {displayImage && !displayImage.includes('placeholder') ? (
        <img
          src={displayImage}
          alt={imageAlt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : null}
      
      <ProductPlaceholder
        productName={name || 'Produit'}
        productId={id || 'unknown'}
        brand={brand || product?.brand}
        className="w-full h-full"
      />
    </div>
  )
}
