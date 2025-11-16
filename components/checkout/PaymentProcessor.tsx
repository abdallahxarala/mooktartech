'use client'

import { useCallback, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { ArrowRight, CheckCircle, Loader2, ShieldCheck, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { useCartStore } from '@/lib/store/cart-store'
import type { PaymentInitiationRequest, PaymentMethod, PaymentProvider } from '@/types/payment'

const stripePromise =
  typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null

interface PaymentProcessorProps {
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  delivery: {
    method: 'pickup' | 'delivery'
    address?: string | null
  }
  totals: {
    subtotal: number
    tax: number
    shipping: number
    total: number
    currency: string
  }
  locale?: string
  onCashSelected?: () => void | Promise<void>
  onBankTransferSelected?: () => void | Promise<void>
}

const PROVIDER_ENDPOINTS: Record<PaymentProvider, string> = {
  orange_money: '/api/payments/orange-money',
  wave: '/api/payments/wave',
  stripe: '/api/payments/stripe'
}

export function PaymentProcessor({
  customer,
  delivery,
  totals,
  locale = 'fr',
  onCashSelected,
  onBankTransferSelected
}: PaymentProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod)
  const items = useCartStore((state) => state.items)

  const paymentProvider = useMemo(() => {
    if (paymentMethod === 'orange_money' || paymentMethod === 'wave' || paymentMethod === 'stripe') {
      return paymentMethod
    }
    return null
  }, [paymentMethod])

  const initiatePayment = useCallback(
    async (provider: PaymentProvider) => {
      const endpoint = PROVIDER_ENDPOINTS[provider]

      const baseSuccessUrl = `${window.location.origin}/${locale}/payment/success?provider=${provider}`
      const payload: PaymentInitiationRequest = {
        amount: totals.total,
        currency: totals.currency,
        customer,
        deliveryMethod: delivery.method,
        deliveryAddress: delivery.address ?? null,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitAmount: item.price,
          currency: totals.currency
        })),
        metadata: {
          subtotal: totals.subtotal,
          tax: totals.tax,
          shipping: totals.shipping,
          delivery,
          locale
        },
        returnUrl:
          provider === 'stripe'
            ? `${baseSuccessUrl}${baseSuccessUrl.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`
            : baseSuccessUrl,
        cancelUrl: `${window.location.origin}/${locale}/payment/cancel?provider=${provider}`,
        locale
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error?.message ?? 'Erreur paiement')
      }

      return response.json()
    },
    [customer, delivery, items, locale, totals]
  )

  const handleProcess = useCallback(async () => {
    if (!paymentMethod) {
      toast.error('Veuillez sélectionner une méthode de paiement.')
      return
    }

    if (paymentMethod === 'cash') {
      await onCashSelected?.()
      if (!onCashSelected) {
        toast.success('Commande confirmée - Paiement à la livraison.')
      }
      return
    }

    if (paymentMethod === 'bank_transfer') {
      await onBankTransferSelected?.()
      if (!onBankTransferSelected) {
        toast.success('Instructions de virement envoyées par email.')
      }
      return
    }

    if (!paymentProvider) {
      toast.error('Méthode de paiement non supportée.')
      return
    }

    try {
      setIsProcessing(true)
      const data = await initiatePayment(paymentProvider)

      if (paymentProvider === 'stripe') {
        if (!stripePromise) {
          throw new Error('Stripe non configuré côté client.')
        }
        const stripe = await stripePromise
        if (!stripe) {
          throw new Error('Impossible de charger Stripe.')
        }
        const { sessionId, redirectUrl } = data
        if (redirectUrl) {
          window.location.href = redirectUrl
          return
        }
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw error
        }
        return
      }

      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl
        return
      }

      toast.success('Paiement initié avec succès.')
    } catch (error: any) {
      console.error('Payment processing error:', error)
      toast.error(error.message ?? 'Échec du paiement')
    } finally {
      setIsProcessing(false)
    }
  }, [initiatePayment, onBankTransferSelected, onCashSelected, paymentMethod, paymentProvider])

  return (
    <motion.div
      key="payment-processor"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="rounded-2xl border border-orange-100/80 bg-white p-6 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Procéder au paiement</h3>
          <p className="text-sm text-muted-foreground">
            La transaction est chiffrée et sécurisée. Aucun numéro de carte n’est stocké sur nos
            serveurs.
          </p>
        </div>
        <ShieldCheck className="h-6 w-6 text-emerald-500" />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        {paymentMethod === 'cash' && (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-sm">
            <Wallet className="h-4 w-4 text-gray-500" />
            <span>Réglez le montant total à la livraison auprès de notre livreur.</span>
          </div>
        )}
        {paymentMethod === 'bank_transfer' && (
          <p>
            Vous recevrez un email avec le RIB et la procédure à suivre. La commande sera expédiée à
            réception du paiement.
          </p>
        )}
        {paymentProvider === 'orange_money' && (
          <p>
            Vous serez redirigé vers Orange Money WebPay pour confirmer le paiement sur votre numéro
            mobile.
          </p>
        )}
        {paymentProvider === 'wave' && (
          <p>
            Un QR Code Wave ou un code marchand sera généré. Confirmez la transaction dans votre
            application Wave.
          </p>
        )}
        {paymentProvider === 'stripe' && (
          <p>
            Vous serez redirigé vers Stripe Checkout pour un paiement carte bancaire sécurisé (Visa,
            Mastercard).
          </p>
        )}
      </div>

      <Button
        onClick={handleProcess}
        disabled={isProcessing}
        className="mt-6 flex w-full items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:from-orange-600 hover:to-pink-600"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Initialisation du paiement...</span>
          </>
        ) : (
          <>
            <span>Lancer le paiement</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          Support 24/7
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          Transactions chiffrées
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          Reçus automatiques
        </span>
      </div>
    </motion.div>
  )
}

