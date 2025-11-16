/**
 * Webhook Wave pour les tickets
 * Gère les callbacks de paiement Wave pour les tickets
 */

import { NextRequest, NextResponse } from 'next/server'
import { parseWaveWebhook, verifyWaveWebhook } from '@/lib/payments/wave-helpers'
import { updateVisitorPaymentStatus } from '@/lib/services/visitor.service'
import { sendTicketConfirmationSMS } from '@/lib/services/sms.service'
import { getVisitorByBadgeId } from '@/lib/services/visitor.service'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature =
    request.headers.get('x-wave-signature') ?? request.headers.get('x-signature') ?? null

  if (!verifyWaveWebhook(signature, rawBody)) {
    console.warn('Wave webhook invalid signature for tickets')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const json = JSON.parse(rawBody || '{}')
    const payload = parseWaveWebhook(json)

    // Vérifier si c'est un paiement pour un ticket (via metadata)
    const metadata = payload.metadata as any
    if (!metadata?.ticket_id || !metadata?.badge_id) {
      // Ce n'est pas un webhook de ticket, laisser le handler principal le gérer
      return NextResponse.json({ received: true, handled: false })
    }

    const badgeId = metadata.badge_id as string
    const ticketId = metadata.ticket_id as string
    const eventId = metadata.event_id as string
    const ticketType = metadata.ticket_type as string

    // Récupérer le visiteur
    const { visitor, error: visitorError } = await getVisitorByBadgeId(badgeId)

    if (visitorError || !visitor) {
      console.error('Visitor not found for badge:', badgeId)
      return NextResponse.json({ error: 'Visitor not found' }, { status: 404 })
    }

    // Traiter selon le statut du paiement
    if (payload.status === 'SUCCESS' || payload.status === 'COMPLETED') {
      // Mettre à jour le statut de paiement
      await updateVisitorPaymentStatus(badgeId, payload.payment_id || ticketId, 'paid')

      // Envoyer le SMS de confirmation avec QR code
      const visitorMetadata = visitor.metadata as any || {}
      const qrCodeData = metadata.qr_code_data

      await sendTicketConfirmationSMS(visitor.phone || '', {
        badgeId,
        ticketType,
        eventName: 'Foire Internationale de Dakar 2025', // TODO: Récupérer depuis event_id
        qrCodeUrl: qrCodeData, // On pourrait envoyer l'URL du QR code
      })

      console.log(`Ticket ${ticketId} confirmed for badge ${badgeId}`)
    } else if (payload.status === 'FAILED') {
      await updateVisitorPaymentStatus(badgeId, payload.payment_id || ticketId, 'failed')
      console.log(`Ticket ${ticketId} payment failed for badge ${badgeId}`)
    }

    return NextResponse.json({
      received: true,
      handled: true,
      ticket_id: ticketId,
      badge_id: badgeId,
    })
  } catch (error: any) {
    console.error('Wave tickets webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', message: error.message },
      { status: 500 }
    )
  }
}

