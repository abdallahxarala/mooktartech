import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { sendOrderConfirmationEmail } from '@/lib/email/transactional'

const createOrderSchema = z.object({
  user_id: z.string().uuid().optional(),
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional()
  }),
  items: z.array(
    z.object({
      product_id: z.string().uuid(),
      quantity: z.number().int().positive(),
      unit_price: z.number().nonnegative(),
      total_price: z.number().nonnegative()
    })
  ).min(1),
  totals: z.object({
    subtotal: z.number().nonnegative(),
    tax: z.number().nonnegative().optional(),
    shipping: z.number().nonnegative().optional(),
    discount: z.number().nonnegative().optional(),
    total: z.number().nonnegative()
  }),
  payment_method: z.string().optional(),
  payment_status: z.enum(['pending', 'paid', 'failed']).default('pending'),
  currency: z.string().default('XOF'),
  locale: z.string().default('fr')
})

/**
 * POST /api/orders/create
 * Creates an order in the database and sends confirmation email
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()

    // Get authenticated user
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = createOrderSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Generate order number
    const orderNumber = `XAR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Prepare order data
    const orderData = {
      order_number: orderNumber,
      user_id: data.user_id || session.user.id,
      status: 'pending',
      payment_status: data.payment_status,
      payment_method: data.payment_method || null,
      subtotal: data.totals.subtotal,
      tax_amount: data.totals.tax || 0,
      shipping_amount: data.totals.shipping || 0,
      discount_amount: data.totals.discount || 0,
      total_amount: data.totals.total,
      currency: data.currency,
      shipping_address: {
        name: `${data.customer.firstName} ${data.customer.lastName}`,
        email: data.customer.email,
        phone: data.customer.phone || null,
        address: data.customer.address || null,
        city: data.customer.city || null,
        country: data.customer.country || 'Sénégal'
      },
      billing_address: {
        name: `${data.customer.firstName} ${data.customer.lastName}`,
        email: data.customer.email,
        phone: data.customer.phone || null,
        address: data.customer.address || null,
        city: data.customer.city || null,
        country: data.customer.country || 'Sénégal'
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select('id, order_number')
      .single()

    if (orderError || !order) {
      console.error('Order creation failed:', orderError)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create order'
        },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items creation failed:', itemsError)
      // Order is created but items failed - still return success but log error
    }

    // Send order confirmation email (non-blocking)
    sendOrderConfirmationEmail(order.id, data.locale).catch((emailError) => {
      // Log but don't fail the request
      console.error('Failed to send order confirmation email:', emailError)
    })

    console.log('Order created successfully:', {
      orderId: order.id,
      orderNumber: order.order_number,
      total: data.totals.total
    })

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          order_number: order.order_number
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error creating order:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

