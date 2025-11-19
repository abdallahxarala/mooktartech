'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CreditCard, Smartphone, Building2, Loader2 } from 'lucide-react'

interface PaymentPageClientProps {
  ticket: any
  locale: string
  slug: string
  eventSlug: string
}

export function PaymentPageClient({ 
  ticket, 
  locale, 
  slug,
  eventSlug 
}: PaymentPageClientProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange_money' | 'free_money' | 'cash'>('wave')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const paymentMethods = [
    {
      id: 'wave',
      name: 'Wave',
      icon: Smartphone,
      color: 'bg-blue-500',
      description: 'Paiement mobile instantané',
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      icon: Smartphone,
      color: 'bg-orange-500',
      description: 'Paiement Orange Money',
    },
    {
      id: 'free_money',
      name: 'Free Money',
      icon: Smartphone,
      color: 'bg-red-500',
      description: 'Paiement Free Money',
    },
    {
      id: 'cash',
      name: 'Espèces',
      icon: Building2,
      color: 'bg-green-500',
      description: 'Payer sur place',
    },
  ]

  const handlePayment = async () => {
    if (paymentMethod !== 'cash' && !phoneNumber.trim()) {
      setError('Veuillez entrer votre numéro de téléphone')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      // Pour MVP : marquer comme payé directement
      // En production : intégrer vraie API Wave/Orange Money
      
      const { error: updateError } = await supabase
        .from('tickets')
        .update({
          payment_status: 'paid',
          payment_method: paymentMethod,
          payment_reference: `REF-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          payment_date: new Date().toISOString(),
        })
        .eq('id', ticket.id)

      if (updateError) throw updateError

      // Rediriger vers confirmation
      router.push(`/${locale}/org/${slug}/foires/${eventSlug}/tickets/${ticket.id}/confirmation`)
      
    } catch (err) {
      console.error('Erreur paiement:', err)
      setError('Erreur lors du paiement. Veuillez réessayer.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Paiement</h1>
          <p className="text-gray-600 mb-8">
            Finalisez votre achat de billets
          </p>

          {/* Résumé commande */}
          <div className="border-b pb-6 mb-6">
            <h2 className="font-semibold mb-4">Résumé de la commande</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Événement</span>
                <span className="font-medium">{ticket.event.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type de billet</span>
                <span className="font-medium capitalize">{ticket.ticket_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantité</span>
                <span className="font-medium">{ticket.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Acheteur</span>
                <span className="font-medium">{ticket.buyer_name}</span>
              </div>
              <div className="flex justify-between pt-4 border-t">
                <span className="font-bold">Total</span>
                <span className="font-bold text-green-600 text-xl">
                  {ticket.total_price.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div className="mb-6">
            <h2 className="font-semibold mb-4">Méthode de paiement</h2>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`${method.color} p-3 rounded-full text-white`}>
                      <method.icon className="h-6 w-6" />
                    </div>
                    <div className="font-semibold">{method.name}</div>
                    <div className="text-xs text-gray-500 text-center">
                      {method.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Numéro de téléphone pour mobile money */}
          {paymentMethod !== 'cash' && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Numéro de téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="+221 77 XXX XX XX"
                required
              />
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Bouton payer */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || (paymentMethod !== 'cash' && !phoneNumber.trim())}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 ${
              isProcessing || (paymentMethod !== 'cash' && !phoneNumber.trim())
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Traitement en cours...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>
                  Payer {ticket.total_price.toLocaleString()} FCFA
                </span>
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Paiement sécurisé • Vos données sont protégées
          </p>
        </div>
      </div>
    </div>
  )
}

