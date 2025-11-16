'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { PaymentProviderSelector } from './payment-provider-selector'
import { usePayment } from '@/lib/hooks/use-payment'
import type { PaymentProvider } from '@/lib/payments/types'

interface PaymentFlowProps {
  orderId: string
  amount: number
  currency?: string
  customer: {
    name: string
    email?: string
    phone: string
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function PaymentFlow({
  orderId,
  amount,
  currency = 'XOF',
  customer,
  onSuccess,
  onCancel
}: PaymentFlowProps) {
  const t = useTranslations('checkout.payment')
  const router = useRouter()
  const { initiatePayment, redirectToCheckout, isProcessing } = usePayment()
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null)
  const [paymentInitiated, setPaymentInitiated] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)

  const handleProviderSelect = (provider: PaymentProvider) => {
    setSelectedProvider(provider)
  }

  const handleInitiatePayment = async () => {
    if (!selectedProvider) return

    const result = await initiatePayment({
      order_id: orderId,
      provider: selectedProvider,
      customer,
      metadata: {
        initiated_at: new Date().toISOString()
      }
    })

    if (result) {
      setPaymentInitiated(true)
      setCheckoutUrl(result.checkout_url)
    }
  }

  const handleRedirectToCheckout = () => {
    if (checkoutUrl) {
      redirectToCheckout(checkoutUrl)
    }
  }

  // Auto-redirect when checkout URL is available
  useEffect(() => {
    if (checkoutUrl && paymentInitiated) {
      // Small delay for UX
      const timer = setTimeout(() => {
        redirectToCheckout(checkoutUrl)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [checkoutUrl, paymentInitiated, redirectToCheckout])

  if (paymentInitiated && checkoutUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            {t('redirecting')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{t('redirectingDescription')}</p>
          <Button
            onClick={handleRedirectToCheckout}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-600"
          >
            {t('continueToPayment')}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="w-full">
              {t('cancel')}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <PaymentProviderSelector
        amount={amount}
        currency={currency}
        onProviderSelect={handleProviderSelect}
        selectedProvider={selectedProvider}
        disabled={isProcessing}
      />

      {selectedProvider && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('amount')}</span>
                <span className="font-semibold text-lg">
                  {amount.toLocaleString()} {currency}
                </span>
              </div>

              <Button
                onClick={handleInitiatePayment}
                disabled={isProcessing || !selectedProvider}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-600"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  t('proceedToPayment')
                )}
              </Button>

              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="w-full"
                  disabled={isProcessing}
                >
                  {t('cancel')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

