/**
 * Modal de détail produit
 */

'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, MapPin, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useFavoritesStore } from '@/lib/store/favorites-store'
import { cn } from '@/lib/utils'
import type { ExhibitorProduct } from '@/lib/types/exhibitor-product'

interface ProductDetailProps {
  product: (ExhibitorProduct & { exhibitor_name?: string; exhibitor_booth?: string }) | null
  isOpen: boolean
  onClose: () => void
  onOrder?: (product: ExhibitorProduct) => void
}

export function ProductDetail({ product, isOpen, onClose, onOrder }: ProductDetailProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!product) return null

  const isFav = isFavorite(product.id)
  const images = product.images && product.images.length > 0 ? product.images : [product.featured_image || '/placeholder-product.png']
  const currentImage = images[selectedImageIndex] || images[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">{product.name}</DialogTitle>
              <DialogDescription>
                {product.exhibitor_name && (
                  <span className="text-base text-gray-700">
                    Par {product.exhibitor_name}
                    {product.exhibitor_booth && ` • Stand ${product.exhibitor_booth}`}
                  </span>
                )}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(isFav && 'text-red-500')}
              onClick={() => toggleFavorite(product.id)}
            >
              <Heart className={cn('w-6 h-6', isFav && 'fill-current')} />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Galerie images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                      selectedImageIndex === index
                        ? 'border-orange-500'
                        : 'border-transparent hover:border-gray-300'
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div className="space-y-4">
            {/* Prix */}
            <div>
              {product.price_on_request ? (
                <Badge variant="outline" className="text-lg px-3 py-1">
                  Prix sur demande
                </Badge>
              ) : product.price ? (
                <div className="text-3xl font-black text-orange-600">
                  {Number(product.price).toLocaleString()} {product.currency || 'XOF'}
                </div>
              ) : (
                <span className="text-gray-500">Prix non disponible</span>
              )}
            </div>

            {/* Catégorie et tags */}
            <div className="flex flex-wrap gap-2">
              {product.category && (
                <Badge variant="secondary">{product.category}</Badge>
              )}
              {product.tags && product.tags.length > 0 &&
                product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* Stock */}
            <div>
              {product.unlimited_stock ? (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Stock illimité
                </Badge>
              ) : (
                <div>
                  <span className="text-sm text-gray-600">Stock disponible: </span>
                  <span className="font-semibold">{product.stock_quantity || 0}</span>
                </div>
              )}
            </div>

            {/* Stand */}
            {product.exhibitor_booth && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>Stand {product.exhibitor_booth}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Fermer
              </Button>
              {onOrder && (
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    onOrder(product)
                    onClose()
                  }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Commander
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

