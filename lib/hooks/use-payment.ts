/**
 * Hook for managing payment flow
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { PaymentProvider } from '@/lib/payments/types'

interface InitiatePaymentParams {
  order_id: string
  provider: PaymentProvider
  customer: {
    name: string
    email?: string
    phone: string
  }
  metadata?: Record<string, unknown>
}

interface PaymentInitiationResult {
  payment_id: string
  checkout_url: string
  expires_at?: string
  qr_code?: string
}

export function usePayment() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initiatePayment = useCallback(
    async (params: InitiatePaymentParams): Promise<PaymentInitiationResult | null> => {
      setIsProcessing(true)
      setError(null)

      try {
        const response = await fetch('/api/payments/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          const errorMessage = data.error || 'Failed to initiate payment'
          setError(errorMessage)
          toast.error(errorMessage)
          return null
        }

        toast.success('Payment initiated successfully')
        return {
          payment_id: data.payment.id,
          checkout_url: data.payment.checkout_url,
          expires_at: data.payment.expires_at,
          qr_code: data.payment.qr_code
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        toast.error('Failed to initiate payment')
        console.error('Payment initiation error:', err)
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    []
  )

  const redirectToCheckout = useCallback(
    (checkoutUrl: string) => {
      // If it's an external URL, open in same window
      if (checkoutUrl.startsWith('http')) {
        window.location.href = checkoutUrl
      } else {
        // Internal route
        router.push(checkoutUrl)
      }
    },
    [router]
  )

  const pollPaymentStatus = useCallback(
    async (paymentId: string, maxAttempts = 30): Promise<boolean> => {
      // Poll payment status (for providers that don't use webhooks immediately)
      // This is a fallback mechanism
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const response = await fetch(`/api/payments/${paymentId}/status`)
          const data = await response.json()

          if (data.success && data.payment) {
            if (data.payment.status === 'completed') {
              return true
            }
            if (data.payment.status === 'failed' || data.payment.status === 'cancelled') {
              return false
            }
          }

          // Wait before next poll (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 10000))
          )
        } catch (err) {
          console.error('Payment status poll error:', err)
        }
      }

      return false
    },
    []
  )

  return {
    initiatePayment,
    redirectToCheckout,
    pollPaymentStatus,
    isProcessing,
    error
  }
}

