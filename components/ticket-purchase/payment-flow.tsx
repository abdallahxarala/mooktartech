/**
 * Composant de flow de paiement Wave
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, CheckCircle2 } from 'lucide-react'
import { useTicketPurchase } from '@/lib/hooks/use-ticket-purchase'
import type { TicketType, VisitorInfo } from '@/lib/types/ticket'
import { TICKET_TYPES } from '@/lib/types/ticket'

interface PaymentFlowProps {
  eventId: string
  ticketType: TicketType
  visitorInfo: VisitorInfo
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PaymentFlow({
  eventId,
  ticketType,
  visitorInfo,
  onSuccess,
  onError,
}: PaymentFlowProps) {
  const { initiatePayment, isProcessing } = useTicketPurchase({
    eventId,
    onSuccess: () => {
      onSuccess?.()
    },
    onError,
  })

  const ticket = TICKET_TYPES[ticketType]
  const totalAmount = ticket.price

  const handlePay = async () => {
    await initiatePayment()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Récapitulatif</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ticket sélectionné */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg">{ticket.name}</div>
              <div className="text-sm text-gray-600">{ticket.description}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black">{totalAmount.toLocaleString()} XOF</div>
            </div>
          </div>
        </div>

        {/* Informations visiteur */}
        <div className="space-y-2">
          <h3 className="font-semibold">Informations visiteur</h3>
          <div className="text-sm text-gray-600">
            <p>
              {visitorInfo.first_name} {visitorInfo.last_name}
            </p>
            <p>{visitorInfo.phone}</p>
            {visitorInfo.email && <p>{visitorInfo.email}</p>}
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total</span>
            <span className="text-2xl text-orange-600">
              {totalAmount.toLocaleString()} XOF
            </span>
          </div>
        </div>

        {/* Bouton paiement */}
        <Button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full h-14 text-base font-semibold bg-orange-500 hover:bg-orange-600"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Redirection vers Wave...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Payer avec Wave
            </>
          )}
        </Button>

        <p className="text-xs text-center text-gray-500">
          Vous serez redirigé vers la page de paiement sécurisée Wave
        </p>
      </CardContent>
    </Card>
  )
}

