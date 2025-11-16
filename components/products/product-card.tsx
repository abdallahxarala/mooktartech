'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/data/products'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ShoppingCart, Eye, Star, Package, Zap } from 'lucide-react'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'featured'
  onAddToCart?: () => void
}

export function ProductCard({ product, variant = 'default', onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number, unit: string) => {
    if (unit === 'XOF') {
      return new Intl.NumberFormat('fr-FR').format(price) + ' XOF'
    }
    return `${price} ${unit}`
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      'imprimantes': '🖨️',
      'cartes-pvc': '💳',
      'cartes-magnetiques': '🧲',
      'cartes-puce': '🔒',
      'cartes-rfid': '📡',
      'cartes-nfc': '📱',
      'accessoires': '🔧',
    }
    return icons[category as keyof typeof icons] || '📦'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'imprimantes': 'bg-blue-100 text-blue-800',
      'cartes-pvc': 'bg-gray-100 text-gray-800',
      'cartes-magnetiques': 'bg-red-100 text-red-800',
      'cartes-puce': 'bg-green-100 text-green-800',
      'cartes-rfid': 'bg-purple-100 text-purple-800',
      'cartes-nfc': 'bg-orange-100 text-orange-800',
      'accessoires': 'bg-yellow-100 text-yellow-800',
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (variant === 'compact') {
    return (
      <Link href={`/fr/products/${product.slug}`}>
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <Badge className={`ml-2 ${getCategoryColor(product.category)}`}>
                    {getCategoryIcon(product.category)}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.shortDescription}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">
                    {formatPrice(product.price, product.priceUnit)}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Package className="w-4 h-4" />
                    <span>{product.stock} en stock</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/fr/products/${product.slug}`}>
        <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-orange-200">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            {product.featured && (
              <Badge className="bg-orange-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Vedette
              </Badge>
            )}
            {product.new && (
              <Badge className="bg-green-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                Nouveau
              </Badge>
            )}
          </div>

          <CardHeader className="p-0">
            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
              <Image
                src={product.mainImage}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <Badge className={`${getCategoryColor(product.category)}`}>
                {getCategoryIcon(product.category)} {product.brand}
              </Badge>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {product.description}
            </p>

            <div className="space-y-2 mb-4">
              {product.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price, product.priceUnit)}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Package className="w-4 h-4" />
                  <span>{product.stock} en stock</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={onAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ajouter au panier
                </Button>
                <Button variant="outline" size="icon">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    )
  }

  // Variant par défaut
  return (
    <Link href={`/fr/products/${product.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <CardHeader className="p-0">
          <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100">
            <Image
              src={product.mainImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              {product.featured && (
                <Badge className="bg-orange-500 text-white text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Vedette
                </Badge>
              )}
              {product.new && (
                <Badge className="bg-green-500 text-white text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Nouveau
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <Badge className={`text-xs ${getCategoryColor(product.category)}`}>
              {getCategoryIcon(product.category)} {product.brand}
            </Badge>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.shortDescription}
          </p>

          <div className="space-y-1 mb-3">
            {product.features.slice(0, 2).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-orange-500 rounded-full" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price, product.priceUnit)}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Package className="w-3 h-3" />
                <span>{product.stock}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={onAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ajouter au panier
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}