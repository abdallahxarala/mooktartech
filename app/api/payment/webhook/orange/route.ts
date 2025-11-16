import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { status, order_id, pay_token, txnid } = body

    if (status === 'SUCCESS') {
      console.log('Orange Money payment success:', { orderId: order_id, transactionId: txnid })
      return NextResponse.json({ status: 'OK' })
    }

    return NextResponse.json({ status: 'OK' })
  } catch (error) {
    console.error('Orange webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 500 }
    )
  }
}


