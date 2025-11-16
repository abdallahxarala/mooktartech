/**
 * API Route pour initier l'achat d'un ticket
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { initiateWavePayment } from '@/lib/payments/wave-helpers'
import { createVisitor } from '@/lib/services/visitor.service'
import { generateTicketQR, generateTicketId } from '@/lib/services/qr.service'
import { TICKET_TYPES } from '@/lib/types/ticket'
import type { CreateTicketPurchaseParams } from '@/lib/types/ticket'

const purchaseRequestSchema = z.object({
  event_id: z.string().uuid(),
  ticket_type: z.enum(['standard', 'vip']),
  visitor_info: z.object({
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    phone: z.string().min(9),
    email: z.string().email().optional(),
  }),
  return_url: z.string().url(),
  cancel_url: z.string().url(),
})

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json()
    const parsed = purchaseRequestSchema.parse(raw)

    const ticketConfig = TICKET_TYPES[parsed.ticket_type]
    const amount = ticketConfig.price

    // Générer un ID de ticket unique
    const ticketId = generateTicketId()

    // Créer le visiteur (sans paiement confirmé pour l'instant)
    const visitorResult = await createVisitor({
      event_id: parsed.event_id,
      first_name: parsed.visitor_info.first_name,
      last_name: parsed.visitor_info.last_name,
      email: parsed.visitor_info.email || `${parsed.visitor_info.first_name}.${parsed.visitor_info.last_name}@temp.com`,
      phone: parsed.visitor_info.phone,
      ticket_type: parsed.ticket_type,
    })

    if (visitorResult.error || !visitorResult.visitor) {
      return NextResponse.json(
        { error: visitorResult.error || 'Erreur lors de la création du visiteur' },
        { status: 500 }
      )
    }

    // Générer le QR code
    const qrResult = await generateTicketQR({
      ticketId,
      badgeId: visitorResult.visitor.badge_id,
      eventId: parsed.event_id,
      ticketType: parsed.ticket_type,
      visitorName: `${parsed.visitor_info.first_name} ${parsed.visitor_info.last_name}`,
    })

    // Initier le paiement Wave
    const origin = request.nextUrl.origin
    const callbackUrl = `${origin}/api/webhooks/wave/tickets`

    const paymentResult = await initiateWavePayment({
      orderId: ticketId,
      amount,
      currency: ticketConfig.currency,
      customer: {
        firstName: parsed.visitor_info.first_name,
        lastName: parsed.visitor_info.last_name,
        email: parsed.visitor_info.email || '',
        phone: parsed.visitor_info.phone,
      },
      items: [
        {
          productId: ticketId,
          name: ticketConfig.name,
          quantity: 1,
          unitAmount: amount,
          currency: ticketConfig.currency,
        },
      ],
      metadata: {
        ticket_id: ticketId,
        badge_id: visitorResult.visitor.badge_id,
        event_id: parsed.event_id,
        ticket_type: parsed.ticket_type,
        qr_code_data: qrResult.qrCodeData,
      },
      returnUrl: parsed.return_url,
      cancelUrl: parsed.cancel_url,
      locale: 'fr',
    })

    if (!paymentResult.checkout_url) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'initiation du paiement Wave' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      checkout_url: paymentResult.checkout_url,
      payment_id: paymentResult.payment_id,
      ticket_id: ticketId,
      badge_id: visitorResult.visitor.badge_id,
      status: 'pending',
    })
  } catch (error: any) {
    console.error('Error initiating ticket purchase:', error)
    const message =
      error instanceof z.ZodError
        ? 'Données invalides'
        : error.message || 'Erreur lors de l\'achat du ticket'

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: error instanceof z.ZodError ? 400 : 500 }
    )
  }
}

