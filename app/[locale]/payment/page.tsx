'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Smartphone,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Shield,
  Lock
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { usePaymentStore } from '@/lib/store/payment-store'
import toast from 'react-hot-toast'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  
  const { getTotal, items } = useCartStore()
  const { createPayment } = usePaymentStore()
  
  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'orange_money' | 'free_money' | null>(null)
  const [phone, setPhone] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const total = getTotal()
  const shippingCost = total >= 500000 ? 0 : 5000
  const finalTotal = total + shippingCost

  const paymentMethods = [
    { id: 'wave' as const, name: 'Wave', icon: '📱', description: 'Paiement instantané via Wave', color: 'from-blue-500 to-cyan-500', popular: true, fees: 0 },
    { id: 'orange_money' as const, name: 'Orange Money', icon: '🟠', description: 'Paiement via Orange Money', color: 'from-orange-500 to-red-500', popular: true, fees: 0 },
    { id: 'free_money' as const, name: 'Free Money', icon: '🔵', description: 'Paiement via Free Money', color: 'from-purple-500 to-pink-500', popular: false, fees: 0 }
  ]

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Veuillez sélectionner une méthode de paiement')
      return
    }
    if (!phone || phone.length < 9) {
      toast.error('Veuillez entrer un numéro de téléphone valide')
      return
    }

    setIsProcessing(true)
    try {
      const payment = createPayment({
        orderId: orderId || `ORD-${Date.now()}`,
        amount: finalTotal,
        method: selectedMethod,
        status: 'pending',
        phone,
        metadata: {
          customerName: 'Client',
          items: items.map(item => ({ name: item.product.name, quantity: item.quantity, price: item.product.price }))
        }
      })

      const response = await fetch('/api/payment/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: selectedMethod,
          amount: finalTotal,
          phone,
          orderId: payment.orderId,
          customerName: 'Client',
          customerEmail: 'client@example.com'
        })
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error || 'Erreur paiement')
      toast.success('Redirection vers le paiement...')
      window.location.href = data.checkoutUrl
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Erreur lors du paiement. Réessayez.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <Link href="/fr/checkout" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 font-semibold mb-4 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au checkout</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Paiement sécurisé</h1>
          <p className="text-gray-600 text-lg">Choisissez votre mode de paiement</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-green-900 mb-1">Paiement 100% sécurisé</h3>
                  <p className="text-sm text-green-700">Vos données sont cryptées et protégées. Aucune information bancaire n'est stockée.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Modes de paiement</h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full text-left p-6 rounded-xl border-2 transition-all ${selectedMethod === method.id ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                          {method.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-lg font-black text-gray-900">{method.name}</span>
                            {method.popular && (<span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">POPULAIRE</span>)}
                          </div>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                        {selectedMethod === method.id && (<div className="w-3 h-3 rounded-full bg-white" />)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedMethod && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Numéro de téléphone *</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="77 123 45 67"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Entrez le numéro {selectedMethod === 'wave' ? 'Wave' : selectedMethod === 'orange_money' ? 'Orange Money' : 'Free Money'} sur lequel effectuer le paiement</p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={!selectedMethod || !phone || isProcessing}
                className="w-full mt-6 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-500 to-pink-500 disabled:from-gray-400 disabled:to-gray-400 text-white text-lg font-black rounded-xl hover:from-orange-600 hover:to-pink-600 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Traitement...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-6 h-6" />
                    <span>Payer {finalTotal.toLocaleString()} FCFA</span>
                    <ChevronRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-100 sticky top-32">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Récapitulatif</h2>
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {items.slice(0, 3).map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.product.name.slice(0, 30)}...</span>
                    <span className="font-bold text-gray-900">{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="text-sm text-gray-500">+{items.length - 3} autre{items.length - 3 > 1 ? 's' : ''} produit{items.length - 3 > 1 ? 's' : ''}</div>
                )}
              </div>
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600"><span>Sous-total</span><span className="font-bold">{total.toLocaleString()} FCFA</span></div>
                <div className="flex justify-between text-gray-600"><span>Livraison</span><span className="font-bold">{shippingCost === 0 ? 'Gratuite' : shippingCost.toLocaleString() + ' FCFA'}</span></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-black text-gray-900">Total</span>
                <span className="text-3xl font-black text-gray-900">{finalTotal.toLocaleString()}<span className="text-lg text-gray-600 ml-2">FCFA</span></span>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-600" /><span>Paiement sécurisé SSL</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-600" /><span>Confirmation instantanée</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-600" /><span>Support 24/7</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


