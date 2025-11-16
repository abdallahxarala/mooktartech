import { NextRequest, NextResponse } from 'next/server'
import { handleWaveWebhook, parseWaveWebhook, verifyWaveWebhook } from '@/lib/payments/wave'
import { createPaymentAuditLog } from '@/lib/payments/supabase'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature =
    request.headers.get('x-wave-signature') ?? request.headers.get('x-signature') ?? null

  if (!verifyWaveWebhook(signature, rawBody)) {
    console.warn('Wave webhook invalid signature')
    await createPaymentAuditLog({
      eventType: 'wave.webhook.invalid_signature',
      provider: 'wave',
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
    const payload = parseWaveWebhook(json)

    await handleWaveWebhook(payload)

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Wave webhook error:', error)

    await createPaymentAuditLog({
      eventType: 'wave.webhook.error',
      provider: 'wave',
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

