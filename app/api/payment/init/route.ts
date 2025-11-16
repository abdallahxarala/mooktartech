import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { method, amount, phone, orderId, customerName, customerEmail } = body

    if (!method || !amount || !orderId) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    if (method === 'wave') {
      return await initiateWavePayment({ amount, phone, orderId, customerName, customerEmail })
    } else if (method === 'orange_money') {
      return await initiateOrangeMoneyPayment({ amount, phone, orderId, customerName, customerEmail })
    } else if (method === 'free_money') {
      return await initiateFreeMoneyPayment({ amount, phone, orderId, customerName, customerEmail })
    } else {
      return NextResponse.json(
        { error: 'Méthode de paiement non supportée' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment init error:', error)
    return NextResponse.json(
      { error: "Erreur lors de l'initialisation du paiement" },
      { status: 500 }
    )
  }
}

async function initiateWavePayment(data: any) {
  const { amount, phone, orderId, customerName, customerEmail } = data
  const paymentId = `WAVE-${Date.now()}`
  return NextResponse.json({
    success: true,
    paymentId,
    checkoutUrl: `/fr/payment/wave?payment_id=${paymentId}&amount=${amount}&phone=${phone}`,
    qrCode: null,
    message: 'Paiement Wave initié'
  })
}

async function initiateOrangeMoneyPayment(data: any) {
  const { amount, phone, orderId, customerName } = data
  const paymentId = `OM-${Date.now()}`
  return NextResponse.json({
    success: true,
    paymentId,
    checkoutUrl: `/fr/payment/orange?payment_id=${paymentId}&amount=${amount}&phone=${phone}`,
    message: 'Paiement Orange Money initié'
  })
}

async function initiateFreeMoneyPayment(data: any) {
  const { amount, phone, orderId } = data
  const paymentId = `FREE-${Date.now()}`
  return NextResponse.json({
    success: true,
    paymentId,
    checkoutUrl: `/fr/payment/free?payment_id=${paymentId}&amount=${amount}&phone=${phone}`,
    message: 'Paiement Free Money initié'
  })
}


