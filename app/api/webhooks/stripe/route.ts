import { NextRequest, NextResponse } from 'next/server'
import {
  constructStripeEvent,
  handleStripeWebhook,
  parseStripeEvent
} from '@/lib/payments/stripe'
import { createPaymentAuditLog } from '@/lib/payments/supabase'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  try {
    const event = constructStripeEvent(Buffer.from(rawBody, 'utf8'), signature)
    const payload = parseStripeEvent(event)

    if (!payload) {
      await createPaymentAuditLog({
        eventType: `stripe.webhook.unhandled`,
        provider: 'stripe',
        payload: {
          type: event.type,
          id: event.id
        },
        source: 'webhook'
      })
      return NextResponse.json({ received: true, skipped: true })
    }

    await handleStripeWebhook(payload)

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Stripe webhook error:', error)

    await createPaymentAuditLog({
      eventType: 'stripe.webhook.error',
      provider: 'stripe',
      payload: {
        message: error?.message,
        stack: error?.stack
      },
      source: 'webhook'
    })

    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 })
  }
}

