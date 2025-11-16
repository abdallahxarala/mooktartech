export const PAYMENT_PROVIDERS = ['orange_money', 'wave', 'stripe'] as const
export const OFFLINE_PAYMENT_METHODS = ['cash', 'bank_transfer'] as const
export const PAYMENT_METHODS = [
  ...PAYMENT_PROVIDERS,
  ...OFFLINE_PAYMENT_METHODS
] as const

export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number]
export type OfflinePaymentMethod = (typeof OFFLINE_PAYMENT_METHODS)[number]
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'

export interface PaymentCustomer {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface PaymentLineItem {
  productId: string
  name: string
  quantity: number
  unitAmount: number
  currency: string
}

export interface PaymentInitiationRequest {
  orderId?: string
  amount: number
  currency: string
  customer: PaymentCustomer
  deliveryMethod?: 'pickup' | 'delivery'
  deliveryAddress?: string | null
  items: PaymentLineItem[]
  metadata?: Record<string, unknown>
  returnUrl: string
  cancelUrl: string
  locale?: string
}

export interface PaymentInitiationResponse {
  provider: PaymentProvider
  status: PaymentStatus
  orderId: string
  paymentId: string
  transactionId?: string
  redirectUrl?: string
  expiresAt?: string
  raw?: unknown
}

export interface PaymentWebhookPayload {
  provider: PaymentProvider
  event: string
  orderId: string
  paymentId: string
  transactionId?: string
  status: PaymentStatus
  amount: number
  currency: string
  metadata?: Record<string, unknown>
  raw: unknown
}

export interface PaymentAuditLog {
  eventType: string
  provider: PaymentProvider | 'system'
  orderId?: string
  paymentId?: string
  transactionId?: string
  payload?: Record<string, unknown>
  metadata?: Record<string, unknown>
  source: 'api' | 'webhook' | 'system'
}

