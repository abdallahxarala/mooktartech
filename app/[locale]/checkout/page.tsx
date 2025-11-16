'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Loader2,
  Smartphone,
  Wallet
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useContentStore } from '@/lib/store/content-store'
import toast from 'react-hot-toast'

interface CheckoutFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  quarter: string
  additionalInfo: string
  paymentMethod: 'cash' | 'transfer' | 'mobile'
  notes: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const { items, getSubtotal, getTaxAmount, getTotalWithTax, clearCart } = useCartStore()
  const { contactInfo } = useContentStore()

  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: 'Dakar', quarter: '', additionalInfo: '',
    paymentMethod: 'cash', notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && items.length === 0) router.push(`/${locale}/cart`)
  }, [mounted, items, router, locale])

  const subtotal = mounted ? getSubtotal() : 0
  const taxAmount = mounted ? getTaxAmount() : 0
  const totalWithTax = mounted ? getTotalWithTax() : 0
  const shippingCost = subtotal >= 500000 ? 0 : 5000
  const finalTotal = totalWithTax + shippingCost

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreedToTerms) {
      toast.error('Veuillez accepter les conditions générales')
      return
    }

    setIsSubmitting(true)
    try {
      const orderData = {
        customer: formData,
        items: items.map(item => ({
          product: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        totals: {
          subtotal: subtotal,
          tax: taxAmount,
          totalWithTax: totalWithTax,
          shipping: shippingCost,
          total: finalTotal
        },
        timestamp: new Date().toISOString()
      }

      console.log('📤 Sending order:', orderData)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      console.log('📥 Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ API Error:', errorData)
        throw new Error(errorData.error || 'Erreur serveur')
      }

      const data = await response.json()
      console.log('✅ Order created:', data)

      const orderId = data.orderId
      if (!orderId) throw new Error('Order ID manquant')

      if (formData.paymentMethod === 'mobile') {
        console.log('💳 Redirecting to payment page...')
        toast.success('Redirection vers le paiement...')
        router.push(`/${locale}/payment?order_id=${orderId}`)
        return
      }

      const msg = generateWhatsAppMessage(orderData)
      const wa = `https://wa.me/${contactInfo.whatsapp.replace(/\s|\+/g, '')}?text=${encodeURIComponent(msg)}`
      toast.success('Commande enregistrée !')
      clearCart()
      window.open(wa, '_blank')
      setTimeout(() => { router.push(`/${locale}/order-confirmation`) }, 1000)
    } catch (error: any) {
      console.error('❌ Checkout error:', error)
      toast.error(error.message || 'Erreur lors de la commande. Contactez-nous directement.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateWhatsAppMessage = (orderData: any) => {
    let message = `🛍️ *NOUVELLE COMMANDE XARALA SOLUTIONS*\n\n`
    message += `👤 *Client:* ${formData.firstName} ${formData.lastName}\n`
    message += `📧 *Email:* ${formData.email}\n`
    message += `📱 *Téléphone:* ${formData.phone}\n\n`
    message += `📍 *Livraison:*\n${formData.address}, ${formData.quarter}\n${formData.city}\n\n`
    message += `📦 *Articles:*\n`
    items.forEach((item, i) => {
      message += `${i + 1}. ${item.name}\n   Qté: ${item.quantity} × ${item.price.toLocaleString()} FCFA\n   = ${(item.price * item.quantity).toLocaleString()} FCFA\n\n`
    })
    message += `💰 *Totaux:*\nSous-total HT: ${subtotal.toLocaleString()} FCFA\nTVA (18%): ${taxAmount.toLocaleString()} FCFA\nSous-total TTC: ${totalWithTax.toLocaleString()} FCFA\nLivraison: ${shippingCost === 0 ? 'Gratuite' : shippingCost.toLocaleString() + ' FCFA'}\n*TOTAL: ${finalTotal.toLocaleString()} FCFA*\n\n`
    message += `💳 *Paiement:* ${formData.paymentMethod === 'cash' ? 'Espèces à la livraison' : formData.paymentMethod === 'transfer' ? 'Virement bancaire' : 'Mobile Money'}\n`
    if (formData.notes) message += `\n📝 *Notes:* ${formData.notes}\n`
    return message
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (items.length === 0) return null
  
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <Link href={`/${locale}/cart`} className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 font-semibold mb-4 transition-colors"><ArrowLeft className="w-5 h-5" /><span>Retour au panier</span></Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Finaliser la commande</h1>
          <p className="text-gray-600 text-lg">Remplissez vos informations pour recevoir votre commande</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600"><User className="w-6 h-6" /></div><span>Vos informations</span></h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Prénom *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors" placeholder="Amadou" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Nom *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors" placeholder="Diallo" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors" placeholder="amadou@exemple.com" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Téléphone *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors" placeholder="+221 77 123 45 67" /></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><Truck className="w-6 h-6" /></div><span>Adresse de livraison</span></h2>
                <div className="space-y-6">
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Adresse complète *</label><input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors" placeholder="Villa N°123, Rue 45" /></div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Ville *</label><select name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors"><option value="Dakar">Dakar</option><option value="Pikine">Pikine</option><option value="Guédiawaye">Guédiawaye</option><option value="Rufisque">Rufisque</option><option value="Thiès">Thiès</option><option value="Autre">Autre ville</option></select></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Quartier *</label><input type="text" name="quarter" value={formData.quarter} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors" placeholder="Sicap Liberté 6" /></div>
                  </div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Informations supplémentaires</label><textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors resize-none" placeholder="Point de repère, code d'accès, étage, etc." /></div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span>Mode de paiement</span>
                </h2>

                <div className="space-y-4">
                  {[
                    { 
                      value: 'mobile', 
                      label: 'Mobile Money (Wave, Orange, Free)', 
                      desc: 'Paiement en ligne sécurisé',
                      icon: <Smartphone className="w-5 h-5" />,
                      popular: true
                    },
                    { 
                      value: 'cash', 
                      label: 'Espèces à la livraison', 
                      desc: 'Payez en espèces lors de la réception',
                      icon: <Wallet className="w-5 h-5" />
                    },
                    { 
                      value: 'transfer', 
                      label: 'Virement bancaire', 
                      desc: 'Paiement par virement avant livraison',
                      icon: <CreditCard className="w-5 h-5" />
                    }
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === method.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleChange}
                        className="mt-1 text-orange-500 focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {method.icon}
                          <span className="font-bold text-gray-900">{method.label}</span>
                          {method.popular && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
                              POPULAIRE
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{method.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Notes (optionnel)</h2>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-colors resize-none" placeholder="Informations supplémentaires concernant votre commande..." />
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 text-orange-500 focus:ring-orange-500 rounded" />
                  <span className="text-sm text-gray-700">J'accepte les <Link href={`/${locale}/terms`} className="text-orange-500 font-semibold hover:underline">conditions générales de vente</Link> et la <Link href={`/${locale}/privacy`} className="text-orange-500 font-semibold hover:underline">politique de confidentialité</Link></span>
                </label>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 sticky top-32">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Votre commande</h2>
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                        <div className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.quantity} × {item.price.toLocaleString()} FCFA</div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600"><span>Sous-total HT</span><span className="font-bold">{subtotal.toLocaleString()} FCFA</span></div>
                  <div className="flex justify-between text-gray-600"><span>TVA (18%)</span><span className="font-bold">{taxAmount.toLocaleString()} FCFA</span></div>
                  <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-200"><span>Sous-total TTC</span><span className="font-bold">{totalWithTax.toLocaleString()} FCFA</span></div>
                  <div className="flex justify-between text-gray-600"><span>Livraison</span><span className="font-bold">{shippingCost === 0 ? 'Gratuite' : shippingCost.toLocaleString() + ' FCFA'}</span></div>
                </div>
                <div className="flex justify-between items-center mb-8"><span className="text-xl font-black text-gray-900">Total</span><span className="text-3xl font-black text-gray-900">{finalTotal.toLocaleString()}<span className="text-lg text-gray-600 ml-2">FCFA</span></span></div>
                <button type="submit" disabled={isSubmitting || !agreedToTerms} className="flex items-center justify-center gap-2 w-full px-8 py-5 bg-gradient-to-r from-orange-500 to-pink-500 disabled:from-gray-400 disabled:to-gray-400 text-white text-lg font-black rounded-xl hover:from-orange-600 hover:to-pink-600 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105">
                  {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Traitement...</span></>) : (<><CheckCircle className="w-5 h-5" /><span>Confirmer la commande</span></>)}
                </button>
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-600" /><span>Paiement sécurisé</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-600" /><span>Livraison sous 24-48h</span></div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

 