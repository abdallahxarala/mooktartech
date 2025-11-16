import crypto from 'crypto'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'
import type { PaymentAuditLog, PaymentMethod, PaymentStatus } from '@/types/payment'
import { requireEnv } from './env'

type OrdersTable = Database['public']['Tables']['orders']['Row']

let supabaseAdminClient: SupabaseClient<Database> | null = null

export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (supabaseAdminClient) return supabaseAdminClient

  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

  supabaseAdminClient = createClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })

  return supabaseAdminClient
}

interface EnsureOrderParams {
  orderId?: string
  total: number
  shippingAddress?: OrdersTable['shipping_address']
  paymentMethod: PaymentMethod
  paymentId?: string | null
}

export async function ensurePendingOrder({
  orderId,
  total,
  shippingAddress = null,
  paymentMethod,
  paymentId = null
}: EnsureOrderParams): Promise<OrdersTable> {
  const supabase = getSupabaseAdmin()
  const id = orderId ?? crypto.randomUUID()

  const { data, error } = await supabase
    .from('orders')
    .upsert(
      {
        id,
        total,
        status: 'pending',
        payment_method: paymentMethod,
        payment_status: 'pending',
        payment_id: paymentId,
        shipping_address: shippingAddress,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

interface UpdatePaymentStatusParams {
  orderId: string
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  paymentId?: string | null
  transactionId?: string | null
  metadata?: Record<string, unknown>
}

export async function updateOrderPaymentStatus({
  orderId,
  paymentStatus,
  paymentMethod,
  paymentId,
  transactionId
}: UpdatePaymentStatusParams) {
  const supabase = getSupabaseAdmin()

  const { data: existing } = await supabase
    .from('orders')
    .select('payment_status')
    .eq('id', orderId)
    .maybeSingle()

  const { data: updated, error } = await supabase
    .from('orders')
    .update({
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      payment_id: paymentId,
      transaction_id: transactionId,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return {
    previousStatus: (existing?.payment_status as PaymentStatus | undefined) ?? null,
    order: updated ?? null
  }
}

export async function createPaymentAuditLog(entry: PaymentAuditLog) {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase.from('audit_logs').insert({
    event_type: entry.eventType,
    provider: entry.provider,
    order_id: entry.orderId ?? null,
    payment_id: entry.paymentId ?? null,
    transaction_id: entry.transactionId ?? null,
    payload: entry.payload ?? null,
    metadata: entry.metadata ?? null,
    source: entry.source,
    created_at: new Date().toISOString()
  })

  if (error) {
    throw error
  }
}

