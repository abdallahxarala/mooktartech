import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { PaymentServiceFactory } from '@/lib/payments/factory'
import type { ErrorResponse } from '@/lib/types/leads'

interface WebhookResponse {
  success: true
  message: string
}

/**
 * POST /api/payments/webhook/wave
 * Handles Wave payment webhooks
 * 
 * Features:
 * - Webhook signature verification
 * - Idempotency handling
 * - Payment status updates
 * - Order status updates
 * - Audit logging
 */
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    // Get webhook signature from headers
    const signature = request.headers.get('x-wave-signature') || 
                     request.headers.get('x-signature') ||
                     null

    // Parse webhook payload
    let payload: unknown
    try {
      payload = await request.json()
    } catch {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Invalid JSON payload'
        },
        { status: 400 }
      )
    }

    // Get Wave provider for verification
    const waveProvider = PaymentServiceFactory.getProvider('wave')

    // Verify webhook signature
    if (!waveProvider.verifyWebhook(payload, signature)) {
      console.error('Wave webhook signature verification failed')
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Invalid signature'
        },
        { status: 401 }
      )
    }

    // Parse and validate webhook payload
    const webhookData = waveProvider.parseWebhook(payload)
    const providerPaymentId = webhookData.payment_id

    if (!providerPaymentId) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Missing payment ID'
        },
        { status: 400 }
      )
    }

    // Check idempotency - has this webhook been processed?
    const { data: existingLog } = await supabase
      .from('audit_logs')
      .select('id')
      .eq('provider', 'wave')
      .eq('payment_id', providerPaymentId)
      .eq('event_type', webhookData.event_type)
      .single()

    if (existingLog) {
      // Already processed, return success (idempotent)
      console.log('Webhook already processed (idempotency):', {
        paymentId: providerPaymentId,
        eventType: webhookData.event_type
      })
      return NextResponse.json<WebhookResponse>(
        {
          success: true,
          message: 'Webhook already processed'
        },
        { status: 200 }
      )
    }

    // Find payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('id, order_id, status, amount')
      .eq('provider', 'wave')
      .eq('provider_payment_id', providerPaymentId)
      .single()

    if (paymentError || !payment) {
      console.error('Payment not found for webhook:', {
        providerPaymentId,
        error: paymentError?.message
      })
      
      // Log webhook even if payment not found (for debugging)
      await supabase.from('audit_logs').insert({
        event_type: webhookData.event_type,
        provider: 'wave',
        payment_id: providerPaymentId,
        payload: payload as Record<string, unknown>,
        metadata: {
          error: 'Payment not found',
          webhook_data: webhookData
        }
      })

      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Payment not found'
        },
        { status: 404 }
      )
    }

    // Map provider status to internal status
    const internalStatus = waveProvider.mapStatus(webhookData.status)

    // Update payment record
    const updateData: Record<string, unknown> = {
      status: internalStatus,
      updated_at: new Date().toISOString()
    }

    if (webhookData.transaction_id) {
      updateData.transaction_id = webhookData.transaction_id
    }

    if (internalStatus === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', payment.id)

    if (updateError) {
      console.error('Payment update failed:', {
        paymentId: payment.id,
        error: updateError.message
      })
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Failed to update payment'
        },
        { status: 500 }
      )
    }

    // Update order payment status
    if (internalStatus === 'completed') {
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          transaction_id: webhookData.transaction_id || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.order_id)

      // Send order confirmation email (non-blocking)
      import('@/lib/email/transactional')
        .then(({ sendOrderConfirmationEmail }) => {
          sendOrderConfirmationEmail(payment.order_id, 'fr').catch((emailError) => {
            // Log but don't fail the webhook
            console.error('Failed to send order confirmation email:', emailError)
          })
        })
        .catch((importError) => {
          console.warn('Failed to import email service:', importError)
        })
    } else if (internalStatus === 'failed' || internalStatus === 'cancelled') {
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.order_id)
    }

    // Log webhook event in audit_logs
    await supabase.from('audit_logs').insert({
      event_type: webhookData.event_type,
      provider: 'wave',
      order_id: payment.order_id,
      payment_id: providerPaymentId,
      transaction_id: webhookData.transaction_id || null,
      payload: payload as Record<string, unknown>,
      metadata: {
        internal_status: internalStatus,
        webhook_data: webhookData
      }
    })

    // Log safe metadata
    console.log('Wave webhook processed:', {
      paymentId: payment.id,
      orderId: payment.order_id,
      providerPaymentId,
      status: internalStatus,
      eventType: webhookData.event_type
    })

    return NextResponse.json<WebhookResponse>(
      {
        success: true,
        message: 'Webhook processed successfully'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error in Wave webhook handler:', error)
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

