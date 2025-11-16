/**
 * Carte produit pour le catalogue
 */

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useFavoritesStore } from '@/lib/store/favorites-store'
import { cn } from '@/lib/utils'
import type { ExhibitorProduct } from '@/lib/types/exhibitor-product'

interface ProductCardProps {
  product: ExhibitorProduct & { exhibitor_name?: string; exhibitor_booth?: string }
  onViewDetail: (product: ExhibitorProduct) => void
  onOrder?: (product: ExhibitorProduct) => void
}

export function ProductCard({ product, onViewDetail, onOrder }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore()

  const isFav = isFavorite(product.id)
  const imageUrl = product.featured_image || product.images?.[0] || '/placeholder-product.png'

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badge favoris */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute top-2 right-2 z-10 bg-white/90 hover:bg-white',
            isFav && 'text-red-500'
          )}
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(product.id)
          }}
        >
          <Heart className={cn('w-5 h-5', isFav && 'fill-current')} />
        </Button>
        {/* Badge exposant */}
        {product.exhibitor_name && (
          <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
            {product.exhibitor_name}
          </Badge>
        )}
        {/* Badge featured */}
        {product.is_featured && (
          <Badge className="absolute bottom-2 left-2 bg-purple-500 text-white">
            En vedette
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between mb-3">
          <div>
            {product.price_on_request ? (
              <Badge variant="outline">Prix sur demande</Badge>
            ) : product.price ? (
              <span className="text-xl font-black text-orange-600">
                {Number(product.price).toLocaleString()} {product.currency || 'XOF'}
              </span>
            ) : (
              <span className="text-sm text-gray-500">Prix non disponible</span>
            )}
          </div>
          {product.category && (
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          )}
        </div>
        {product.exhibitor_booth && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span>Stand {product.exhibitor_booth}</span>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetail(product)}
          >
            Voir détails
          </Button>
          {onOrder && (
            <Button
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={() => onOrder?.(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Commander
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

