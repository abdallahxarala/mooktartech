'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  Package,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import toast from 'react-hot-toast'

interface CartPageProps {
  params: {
    locale: string
    slug: string
  }
}

export default function CartPage({ params }: CartPageProps) {
  const { locale, slug } = params
  const [mounted, setMounted] = useState(false)
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTaxAmount,
    getTotalWithTax,
    clearCart
  } = useCartStore()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const subtotal = mounted ? getSubtotal() : 0
  const taxAmount = mounted ? getTaxAmount() : 0
  const totalWithTax = mounted ? getTotalWithTax() : 0
  const itemCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0
  const shippingCost = subtotal >= 500000 ? 0 : 5000
  const finalTotal = totalWithTax + shippingCost

  const handleQuantityChange = (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change
    if (newQuantity < 1) {
      if (confirm('Retirer cet article du panier ?')) {
        removeItem(productId)
        toast.success('Article retiré du panier')
      }
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  if (!mounted) {
    // Rendu serveur : afficher loader
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du panier...</p>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-16 h-16 text-gray-400" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-4">Votre panier est vide</h1>
              <p className="text-gray-600 mb-8 text-lg">Découvrez nos produits</p>
              <Link
                href={`/${locale}/org/${slug}/shop`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg"
              >
                <Package className="w-5 h-5" />
                <span>Voir nos produits</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <Link href={`/${locale}/org/${slug}/shop`} className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 font-semibold mb-4 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Continuer mes achats</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Mon panier</h1>
          <p className="text-gray-600 text-lg">{itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-orange-500 transition-all">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {item.mainImage || item.image ? (
                      <img
                        src={item.mainImage || item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {item.brand && (
                      <div className="text-sm font-bold text-orange-600 mb-1">{item.brand}</div>
                    )}
                    <Link href={`/${locale}/org/${slug}/shop/${item.productId}`} className="text-xl font-black text-gray-900 hover:text-orange-500 transition-colors line-clamp-2 mb-3">
                      {item.name}
                    </Link>
                    {item.shortDescription && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.shortDescription}</p>
                    )}
                    {item.stock !== undefined && (
                      item.stock > 0 ? (
                        <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          <span>En stock ({item.stock} disponibles)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-red-600 font-semibold">
                          <AlertCircle className="w-4 h-4" />
                          <span>Rupture de stock</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right mb-4">
                      <div className="text-2xl font-black text-gray-900">{(item.price * item.quantity).toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{item.price.toLocaleString()} FCFA × {item.quantity}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleQuantityChange(item.productId, item.quantity, -1)} className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <Minus className="w-5 h-5 text-gray-700" />
                      </button>
                      <span className="w-12 text-center font-black text-gray-900 text-lg">{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.productId, item.quantity, 1)} disabled={item.stock !== undefined && item.quantity >= item.stock} className="w-10 h-10 rounded-lg bg-orange-100 hover:bg-orange-200 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                        <Plus className="w-5 h-5 text-orange-600" />
                      </button>
                      <button onClick={() => { removeItem(item.productId); toast.success('Article retiré du panier') }} className="w-10 h-10 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors ml-2">
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => { if (confirm('Vider complètement le panier ?')) { clearCart(); toast.success('Panier vidé') } }} className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors">
              <Trash2 className="w-5 h-5" />
              <span>Vider le panier</span>
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 sticky top-32">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Récapitulatif</h2>
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between"><span className="text-gray-600">Sous-total HT</span><span className="font-bold text-gray-900">{subtotal.toLocaleString()} FCFA</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-600">TVA (18%)</span><span className="font-bold text-gray-900">{taxAmount.toLocaleString()} FCFA</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-600">Sous-total TTC</span><span className="font-bold text-gray-900">{totalWithTax.toLocaleString()} FCFA</span></div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200"><span className="text-gray-600">Livraison</span>{shippingCost === 0 ? (<span className="font-bold text-green-600">Gratuite</span>) : (<span className="font-bold text-gray-900">{shippingCost.toLocaleString()} FCFA</span>)}</div>
              </div>
              {shippingCost > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-bold text-blue-900 mb-1">Livraison gratuite à partir de 500 000 FCFA</div>
                      <div className="text-blue-700">Plus que {(500000 - subtotal).toLocaleString()} FCFA pour en profiter !</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
                <span className="text-xl font-black text-gray-900">Total</span>
                <span className="text-3xl font-black text-gray-900">{finalTotal.toLocaleString()}<span className="text-lg text-gray-600 ml-2">FCFA</span></span>
              </div>
              <Link href={`/${locale}/org/${slug}/checkout`} className="flex items-center justify-center gap-2 w-full px-8 py-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-lg font-black rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 mb-4">
                <span>Passer la commande</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href={`/${locale}/org/${slug}/shop`} className="block text-center px-8 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all">
                Continuer mes achats
              </Link>
              <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600"><CheckCircle className="w-5 h-5 text-green-600" /><span>Livraison sous 24-48h à Dakar</span></div>
                <div className="flex items-center gap-3 text-sm text-gray-600"><CheckCircle className="w-5 h-5 text-green-600" /><span>Paiement sécurisé</span></div>
                <div className="flex items-center gap-3 text-sm text-gray-600"><CheckCircle className="w-5 h-5 text-green-600" /><span>Garantie constructeur incluse</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

