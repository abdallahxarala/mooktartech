/**
 * Hook pour gérer l'achat de tickets
 */

'use client'

import { useState, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import type {
  TicketType,
  VisitorInfo,
  TicketPurchase,
  WavePaymentResponse,
} from '@/lib/types/ticket'

export interface UseTicketPurchaseOptions {
  eventId: string
  onSuccess?: (ticket: TicketPurchase) => void
  onError?: (error: string) => void
}

export interface UseTicketPurchaseReturn {
  // State
  selectedTicketType: TicketType | null
  visitorInfo: Partial<VisitorInfo>
  isProcessing: boolean
  paymentUrl: string | null

  // Actions
  selectTicketType: (type: TicketType) => void
  updateVisitorInfo: (info: Partial<VisitorInfo>) => void
  initiatePayment: () => Promise<void>
  reset: () => void
}

export function useTicketPurchase({
  eventId,
  onSuccess,
  onError,
}: UseTicketPurchaseOptions): UseTicketPurchaseReturn {
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null)
  const [visitorInfo, setVisitorInfo] = useState<Partial<VisitorInfo>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const selectTicketType = useCallback((type: TicketType) => {
    setSelectedTicketType(type)
  }, [])

  const updateVisitorInfo = useCallback((info: Partial<VisitorInfo>) => {
    setVisitorInfo((prev) => ({ ...prev, ...info }))
  }, [])

  const initiatePayment = useCallback(async () => {
    if (!selectedTicketType) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez sélectionner un type de ticket',
      })
      return
    }

    if (!visitorInfo.first_name || !visitorInfo.last_name || !visitorInfo.phone) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
      })
      return
    }

    setIsProcessing(true)

    try {
      const baseUrl = window.location.origin
      const returnUrl = `${baseUrl}/org/${eventId}/foires/tickets/success`
      const cancelUrl = `${baseUrl}/org/${eventId}/foires/tickets`

      const response = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          ticket_type: selectedTicketType,
          visitor_info: {
            first_name: visitorInfo.first_name,
            last_name: visitorInfo.last_name,
            phone: visitorInfo.phone,
            email: visitorInfo.email || '',
          },
          return_url: returnUrl,
          cancel_url: cancelUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'initiation du paiement')
      }

      const data: WavePaymentResponse = await response.json()

      if (data.checkout_url) {
        setPaymentUrl(data.checkout_url)
        // Rediriger vers Wave checkout
        window.location.href = data.checkout_url
      } else {
        throw new Error('URL de paiement non reçue')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: errorMessage,
      })
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }, [selectedTicketType, visitorInfo, eventId, toast, onError])

  const reset = useCallback(() => {
    setSelectedTicketType(null)
    setVisitorInfo({})
    setPaymentUrl(null)
  }, [])

  return {
    selectedTicketType,
    visitorInfo,
    isProcessing,
    paymentUrl,
    selectTicketType,
    updateVisitorInfo,
    initiatePayment,
    reset,
  }
}

