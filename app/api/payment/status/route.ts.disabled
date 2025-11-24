import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentId = searchParams.get('payment_id')

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID manquant' },
        { status: 400 }
      )
    }

    // Simulation status
    return NextResponse.json({
      paymentId,
      status: 'completed',
      transactionId: `TXN-${Date.now()}`,
      amount: 1200000,
      message: 'Paiement vérifié avec succès'
    })
  } catch (error) {
    console.error('Payment status error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}


