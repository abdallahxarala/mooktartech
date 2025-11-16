/**
 * Client component pour l'achat de tickets
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TicketSelector } from '@/components/ticket-purchase/ticket-selector'
import { VisitorForm } from '@/components/ticket-purchase/visitor-form'
import { PaymentFlow } from '@/components/ticket-purchase/payment-flow'
import { TicketConfirmation } from '@/components/ticket-purchase/ticket-confirmation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTicketPurchase } from '@/lib/hooks/use-ticket-purchase'
import type { TicketType, VisitorInfo, TicketPurchase } from '@/lib/types/ticket'
import { motion, AnimatePresence } from 'framer-motion'

interface TicketsClientProps {
  organizationSlug: string
  eventId: string
  eventName: string
  ticket?: TicketPurchase | null
}

type Step = 'select' | 'info' | 'payment' | 'confirmation'

export function TicketsClient({
  organizationSlug,
  eventId,
  eventName,
  ticket: initialTicket,
}: TicketsClientProps) {
  const [currentStep, setCurrentStep] = useState<Step>(
    initialTicket ? 'confirmation' : 'select'
  )
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null)
  const [visitorInfo, setVisitorInfo] = useState<Partial<VisitorInfo>>({})
  const [purchasedTicket, setPurchasedTicket] = useState<TicketPurchase | null>(
    initialTicket || null
  )

  const { initiatePayment, isProcessing } = useTicketPurchase({
    eventId,
    onSuccess: () => {
      // Le paiement redirige vers Wave, donc on ne fait rien ici
    },
    onError: (error) => {
      console.error('Payment error:', error)
    },
  })

  const handleTicketSelect = (type: TicketType) => {
    setSelectedTicketType(type)
    setCurrentStep('info')
  }

  const handleVisitorSubmit = (info: VisitorInfo) => {
    setVisitorInfo(info)
    setCurrentStep('payment')
  }

  const handlePayment = async () => {
    if (!selectedTicketType || !visitorInfo.first_name || !visitorInfo.last_name || !visitorInfo.phone) {
      return
    }

    await initiatePayment()
  }

  const steps = [
    { id: 'select', title: 'Choix du ticket' },
    { id: 'info', title: 'Informations' },
    { id: 'payment', title: 'Paiement' },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 pb-24 pt-24">
      <div className="container mx-auto max-w-4xl px-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Acheter un ticket
          </h1>
          <p className="text-lg text-gray-600">{eventName}</p>
        </div>

        {/* Progress */}
        {currentStep !== 'confirmation' && (
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      index <= currentStepIndex
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Choisissez votre ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <TicketSelector
                    selectedType={selectedTicketType}
                    onSelect={handleTicketSelect}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <VisitorForm
                    initialData={visitorInfo}
                    onSubmit={handleVisitorSubmit}
                  />
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('select')}
                      className="h-12 px-6"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Retour
                    </Button>
                    <Button
                      onClick={() => {
                        const form = document.querySelector('form')
                        form?.requestSubmit()
                      }}
                      className="h-12 px-8 bg-orange-500 hover:bg-orange-600"
                    >
                      Continuer
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 'payment' && selectedTicketType && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <VisitorForm
                  initialData={visitorInfo}
                  onSubmit={(info) => setVisitorInfo(info)}
                />
                <PaymentFlow
                  eventId={eventId}
                  ticketType={selectedTicketType}
                  visitorInfo={visitorInfo as VisitorInfo}
                  onSuccess={() => {
                    // Redirection gérée par Wave
                  }}
                />
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('info')}
                  className="h-12 px-6"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Retour
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 'confirmation' && purchasedTicket && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <TicketConfirmation ticket={purchasedTicket} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

