import { NextRequest, NextResponse } from 'next/server'
import {
  handleOrangeMoneyWebhook,
  parseOrangeMoneyWebhook,
  verifyOrangeMoneyWebhook
} from '@/lib/payments/orange-money'
import { createPaymentAuditLog } from '@/lib/payments/supabase'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature =
    request.headers.get('x-callback-signature') ??
    request.headers.get('x-signature') ??
    request.headers.get('x-om-signature')

  if (!verifyOrangeMoneyWebhook(signature, rawBody)) {
    console.warn('Orange Money webhook invalid signature')
    await createPaymentAuditLog({
      eventType: 'orange_money.webhook.invalid_signature',
      provider: 'orange_money',
      payload: {
        signature,
        body: rawBody
      },
      source: 'webhook'
    })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const json = JSON.parse(rawBody || '{}')
    const payload = parseOrangeMoneyWebhook(json)

    await handleOrangeMoneyWebhook(payload)

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Orange Money webhook error:', error)

    await createPaymentAuditLog({
      eventType: 'orange_money.webhook.error',
      provider: 'orange_money',
      payload: {
        message: error?.message,
        stack: error?.stack,
        body: rawBody
      },
      source: 'webhook'
    })

    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

