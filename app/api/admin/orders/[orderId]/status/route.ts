import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin, createPaymentAuditLog } from '@/lib/payments/supabase'

const schema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
})

interface RouteParams {
  params: {
    orderId: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { status } = schema.parse(await request.json())
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.orderId)
      .select()
      .single()

    if (error) {
      throw error
    }

    await createPaymentAuditLog({
      eventType: 'order.status.updated',
      provider: 'system',
      orderId: params.orderId,
      metadata: {
        status
      },
      source: 'api'
    })

    return NextResponse.json({ success: true, order: data })
  } catch (error: any) {
    console.error('Admin order status update failed:', error)
    const status = error instanceof z.ZodError ? 400 : 500
    return NextResponse.json(
      { success: false, message: error?.message ?? 'Une erreur est survenue' },
      { status }
    )
  }
}

