import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { PaymentServiceFactory } from '@/lib/payments/factory'
import type { ErrorResponse } from '@/lib/types/leads'

// Request validation schema
const initiatePaymentSchema = z.object({
  order_id: z.string().uuid('Invalid order ID format'),
  provider: z.enum(['wave', 'orange_money', 'free_money']),
  customer: z.object({
    name: z.string().min(1, 'Customer name is required'),
    email: z.string().email('Invalid email format').optional(),
    phone: z.string().min(1, 'Customer phone is required')
  }),
  metadata: z.record(z.unknown()).optional()
})

type InitiatePaymentRequest = z.infer<typeof initiatePaymentSchema>

interface InitiatePaymentResponse {
  success: true
  payment: {
    id: string
    provider: string
    checkout_url: string
    expires_at?: string
    qr_code?: string
  }
}

/**
 * POST /api/payments/initiate
 * Initiates a payment with the specified provider
 * 
 * Multi-tenant safe: Verifies order belongs to user's organization
 */
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    // Get authenticated session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      )
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Invalid JSON payload'
        },
        { status: 400 }
      )
    }

    const validationResult = initiatePaymentSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Verify order exists and belongs to user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, currency, user_id, payment_status')
      .eq('id', validatedData.order_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Order not found'
        },
        { status: 404 }
      )
    }

    const orderData = order as any;

    // Verify order belongs to authenticated user
    if (orderData.user_id !== session.user.id) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 403 }
      )
    }

    // Check if order already has a completed payment
    if (orderData.payment_status === 'paid') {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Order already paid'
        },
        { status: 400 }
      )
    }

    // Check if provider is available
    if (!PaymentServiceFactory.isProviderAvailable(validatedData.provider)) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: `Payment provider ${validatedData.provider} is not configured`
        },
        { status: 503 }
      )
    }

    // Get payment provider service
    const paymentProvider = PaymentServiceFactory.getProvider(validatedData.provider)

    // Convert amount to smallest currency unit (cents/santims)
    const amountInSmallestUnit = Math.round(parseFloat(orderData.total_amount.toString()) * 100)

    // Initiate payment with provider
    const providerResponse = await paymentProvider.initiatePayment({
      order_id: validatedData.order_id,
      amount: amountInSmallestUnit,
      currency: orderData.currency || 'XOF',
      customer: validatedData.customer,
      metadata: validatedData.metadata
    })

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: validatedData.order_id,
        provider: validatedData.provider,
        amount: amountInSmallestUnit,
        currency: orderData.currency || 'XOF',
        status: 'pending',
        provider_payment_id: providerResponse.provider_payment_id,
        checkout_url: providerResponse.checkout_url,
        customer_phone: validatedData.customer.phone,
        customer_email: validatedData.customer.email,
        metadata: {
          ...validatedData.metadata,
          expires_at: providerResponse.expires_at
        }
      } as any)
      .select('id, provider, checkout_url, metadata')
      .single()

    if (paymentError) {
      console.error('Payment record creation failed:', {
        orderId: validatedData.order_id,
        provider: validatedData.provider,
        error: paymentError.message
      })
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Failed to create payment record'
        },
        { status: 500 }
      )
    }

    // Update order payment status
    await supabase
      .from('orders')
      .update({
        payment_status: 'processing',
        payment_method: validatedData.provider,
        payment_id: payment.id
      })
      .eq('id', validatedData.order_id)

    // Log safe metadata
    console.log('Payment initiated:', {
      paymentId: payment.id,
      orderId: validatedData.order_id,
      provider: validatedData.provider,
      amount: amountInSmallestUnit
    })

    return NextResponse.json<InitiatePaymentResponse>(
      {
        success: true,
        payment: {
          id: payment.id,
          provider: payment.provider,
          checkout_url: payment.checkout_url,
          expires_at: payment.metadata?.expires_at as string | undefined,
          qr_code: providerResponse.qr_code
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error in POST /api/payments/initiate:', error)
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

