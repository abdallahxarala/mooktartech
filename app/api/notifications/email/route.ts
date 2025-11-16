import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendOrderConfirmationEmail } from '@/lib/notifications/email'

const schema = z.object({
  orderId: z.string().min(1)
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const { orderId } = schema.parse(json)
    await sendOrderConfirmationEmail(orderId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    const status = error instanceof z.ZodError ? 400 : 500
    console.error('Email notification error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error?.message ?? 'Une erreur est survenue'
      },
      { status }
    )
  }
}

