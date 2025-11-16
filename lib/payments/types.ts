/**
 * Payment provider types and enums
 */

export type PaymentProvider = 'wave' | 'orange_money' | 'free_money'

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'

export interface PaymentInitiationRequest {
  order_id: string
  amount: number // Amount in XOF (smallest currency unit)
  currency: string // Default: 'XOF'
  customer: {
    name: string
    email?: string
    phone: string
  }
  metadata?: Record<string, unknown>
}

export interface PaymentInitiationResponse {
  payment_id: string // Internal payment ID
  provider_payment_id: string // Provider's payment ID
  checkout_url: string // URL to redirect user to
  expires_at?: string // ISO timestamp
  qr_code?: string // QR code data URL (if applicable)
}

export interface WebhookPayload {
  event_type: string
  payment_id: string // Provider's payment ID
  transaction_id?: string
  amount?: number
  currency?: string
  status: string
  metadata?: Record<string, unknown>
  timestamp: string
  signature?: string // For webhook verification
}

export interface PaymentRecord {
  id: string
  order_id: string
  provider: PaymentProvider
  amount: number
  currency: string
  status: PaymentStatus
  provider_payment_id: string | null
  transaction_id: string | null
  checkout_url: string | null
  customer_phone: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface PaymentProviderConfig {
  api_key: string
  api_secret?: string
  merchant_id?: string
  webhook_secret?: string
  base_url: string
  environment: 'sandbox' | 'production'
}

