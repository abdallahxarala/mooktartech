import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    if (!orderData.customer || !orderData.items || !orderData.totals) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Données de commande invalides' 
        },
        { status: 400 }
      )
    }

    const orderId = `XAR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    console.log('📦 NEW ORDER:', {
      orderId,
      customer: orderData.customer.firstName + ' ' + orderData.customer.lastName,
      items: orderData.items.length,
      total: orderData.totals.total
    })

    return NextResponse.json(
      { 
        success: true,
        orderId: orderId,
        message: 'Commande enregistrée'
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('❌ ORDER ERROR:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Erreur serveur' 
      },
      { status: 500 }
    )
  }
}

