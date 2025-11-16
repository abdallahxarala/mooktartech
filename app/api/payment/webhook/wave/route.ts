import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_type, data } = body

    if (event_type === 'checkout.completed') {
      const { id, amount, metadata } = data
      console.log('Payment completed:', { paymentId: id, orderId: metadata?.order_id, amount })
      return NextResponse.json({ received: true })
    }

    if (event_type === 'checkout.failed') {
      console.log('Payment failed:', data)
      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}


