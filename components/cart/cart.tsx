'use client'

import React from 'react'
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react'
import { useAppStore } from '@/lib/store/app-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CartProps {
  variant?: 'mini' | 'full'
  onClose?: () => void
}

export function Cart({ variant = 'mini', onClose }: CartProps) {
  // Pour l'instant, on simule un panier vide car le nouveau store ne gère que les produits
  const cart = { items: [], totalItems: 0, totalPrice: 0 }
  const addToCart = () => {}
  const removeFromCart = () => {}
  const updateQuantity = () => {}
  const clearCart = () => {}

  const formatPrice = (price: number, unit: string) => {
    if (unit === 'XOF') {
      return new Intl.NumberFormat('fr-FR').format(price) + ' XOF'
    }
    return `${price} ${unit}`
  }

  if (variant === 'mini') {
    return (
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />
        {cart.itemCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
            {cart.itemCount}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Panier ({cart.itemCount})
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Votre panier est vide
              </h3>
              <p className="text-gray-600">
                Ajoutez des produits pour commencer vos achats
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => {
                const product = getProductById(item.productId)
                if (!product) return null

                return (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      {product.mainImage ? (
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {product.brand}
                      </p>
                      <p className="text-lg font-bold text-orange-500">
                        {formatPrice(product.price, product.priceUnit)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">
                Total
              </span>
              <span className="text-2xl font-bold text-orange-500">
                {formatPrice(cart.total, 'XOF')}
              </span>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={clearCart}
                variant="outline"
                className="flex-1"
              >
                Vider le panier
              </Button>
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                Commander
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
