import { getSupabaseAdmin } from '@/lib/payments/supabase'
import type { Database } from '@/lib/types/database.types'

type OrderRow = Database['public']['Tables']['orders']['Row']
type OrderItemRow = Database['public']['Tables']['order_items']['Row']
type UserRow = Database['public']['Tables']['users']['Row']

export interface OrderProductInfo {
  id: string
  name: string | null
  imageUrl: string | null
}

export interface OrderItemDetail extends OrderItemRow {
  product?: OrderProductInfo | null
}

export interface OrderDetails {
  order: OrderRow & {
    user?: Pick<UserRow, 'id' | 'email' | 'full_name' | 'phone'> | null
  }
  items: OrderItemDetail[]
}

export interface OrdersListOptions {
  status?: OrderRow['status']
  from?: string
  to?: string
  limit?: number
}

export async function fetchOrderDetails(orderId: string): Promise<OrderDetails | null> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
        *,
        user:users (
          id,
          email,
          full_name,
          phone
        ),
        items:order_items (
          id,
          order_id,
          product_id,
          quantity,
          price,
          products (
            id,
            name,
            image_url
          )
        )
      `
    )
    .eq('id', orderId)
    .single()

  if (error || !data) {
    console.error('Failed to fetch order details', error)
    return null
  }

  const items: OrderItemDetail[] = (data.items ?? []).map((item: any) => ({
    id: item.id,
    order_id: item.order_id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
    created_at: item.created_at,
    product: item.products
      ? {
          id: item.products.id,
          name: item.products.name,
          imageUrl: item.products.image_url ?? null
        }
      : null
  }))

  return {
    order: {
      id: data.id,
      user_id: data.user_id,
      order_number: data.order_number,
      status: data.status,
      subtotal: data.subtotal,
      shipping: data.shipping,
      tax: data.tax,
      total: data.total,
      currency: data.currency,
      shipping_address: data.shipping_address,
      payment_intent_id: data.payment_intent_id,
      payment_status: data.payment_status,
      payment_method: data.payment_method,
      payment_id: data.payment_id,
      transaction_id: data.transaction_id,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
      user: data.user ?? null
    },
    items
  }
}

export async function fetchOrders(options: OrdersListOptions = {}) {
  const supabase = getSupabaseAdmin()
  let query = supabase
    .from('orders')
    .select(
      `
        *,
        user:users (
          id,
          email,
          full_name,
          phone
        )
      `
    )
    .order('created_at', { ascending: false })

  if (options.status) {
    query = query.eq('status', options.status)
  }

  if (options.from) {
    query = query.gte('created_at', options.from)
  }

  if (options.to) {
    query = query.lte('created_at', options.to)
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error || !data) {
    console.error('Failed to fetch orders list', error)
    return []
  }

  return data.map((order) => ({
    ...order,
    user: order.user ?? null
  }))
}

export async function fetchOrderStats() {
  const supabase = getSupabaseAdmin()

  const since = new Date()
  since.setMonth(since.getMonth() - 3)

  const { data, error } = await supabase
    .from('orders')
    .select('total, status, payment_status, created_at')
    .gte('created_at', since.toISOString())

  if (error || !data) {
    console.error('Failed to fetch order stats', error)
    return {
      today: 0,
      week: 0,
      month: 0
    }
  }

  const now = new Date()
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(dayStart)
  weekStart.setDate(dayStart.getDate() - 7)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const sumForRange = (start: Date) =>
    data
      .filter(
        (order) =>
          order.payment_status === 'paid' &&
          new Date(order.created_at) >= start
      )
      .reduce((sum, order) => sum + (order.total ?? 0), 0)

  return {
    today: sumForRange(dayStart),
    week: sumForRange(weekStart),
    month: sumForRange(monthStart)
  }
}

export function calculateOrderTotals(details: OrderDetails) {
  const subtotalFromItems = details.items.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
    0
  )

  const subtotal = details.order.subtotal ?? subtotalFromItems
  const shipping = details.order.shipping ?? 0
  const tax = details.order.tax ?? Math.max(details.order.total - subtotal - shipping, 0)
  const total = details.order.total ?? subtotal + tax + shipping

  return {
    subtotal,
    shipping,
    tax,
    total
  }
}

