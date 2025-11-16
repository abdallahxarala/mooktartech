import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { initiateOrangeMoneyPayment } from '@/lib/payments/orange-money'
import { createPaymentAuditLog } from '@/lib/payments/supabase'

const paymentRequestSchema = z.object({
  orderId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().min(3),
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(6)
  }),
  deliveryMethod: z.enum(['pickup', 'delivery']).optional(),
  deliveryAddress: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        name: z.string().min(1),
        quantity: z.number().int().positive(),
        unitAmount: z.number().positive(),
        currency: z.string().min(3)
      })
    )
    .min(1),
  metadata: z.record(z.unknown()).optional(),
  returnUrl: z.string().url(),
  cancelUrl: z.string().url(),
  locale: z.string().min(2).optional()
})

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json()
    const parsed = paymentRequestSchema.parse(raw)

    const origin = request.nextUrl.origin
    const callbackUrl = `${origin}/api/webhooks/orange-money`

    const response = await initiateOrangeMoneyPayment({
      ...parsed,
      callbackUrl
    })

    return NextResponse.json({
      success: true,
      ...response
    })
  } catch (error: any) {
    const message = error instanceof z.ZodError ? 'Données de paiement invalides.' : error.message
    console.error('Orange Money payment error:', error)

    await createPaymentAuditLog({
      eventType: 'orange_money.initiation.error',
      provider: 'orange_money',
      payload: {
        message: error?.message,
        stack: error?.stack
      },
      source: 'api'
    })

    return NextResponse.json(
      {
        success: false,
        message
      },
      { status: error instanceof z.ZodError ? 400 : 500 }
    )
  }
}

