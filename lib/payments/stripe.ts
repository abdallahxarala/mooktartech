import Stripe from 'stripe'
import type {
  PaymentInitiationRequest,
  PaymentInitiationResponse,
  PaymentWebhookPayload,
  PaymentStatus
} from '@/types/payment'
import {
  ensurePendingOrder,
  updateOrderPaymentStatus,
  createPaymentAuditLog
} from './supabase'
import { requireEnv } from './env'
import { sendOrderConfirmationEmail } from '@/lib/notifications/email'
import { sendOrderConfirmationWhatsApp } from '@/lib/notifications/whatsapp'

const STRIPE_API_VERSION: Stripe.LatestApiVersion = '2023-10-16'

let stripeClient: Stripe | null = null

function getStripeClient(): Stripe {
  if (stripeClient) return stripeClient
  stripeClient = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
    apiVersion: STRIPE_API_VERSION
  })
  return stripeClient
}

function formatStripeAmount(amount: number): number {
  // Stripe attend les montants en plus petites unités (cents) sauf pour les devises zéro décimale comme XOF
  const zeroDecimalCurrencies = new Set(['xof', 'jpy', 'krw'])
  const currency = (process.env.STRIPE_DEFAULT_CURRENCY ?? 'xof').toLowerCase()
  if (zeroDecimalCurrencies.has(currency)) {
    return Math.round(amount)
  }
  return Math.round(amount * 100)
}

function mapStripeStatus(status: string | null | undefined): PaymentStatus {
  switch (status) {
    case 'paid':
    case 'succeeded':
    case 'complete':
      return 'paid'
    case 'processing':
    case 'open':
      return 'processing'
    case 'expired':
    case 'canceled':
      return 'failed'
    default:
      return 'pending'
  }
}

export async function initiateStripePayment(
  payload: PaymentInitiationRequest
): Promise<PaymentInitiationResponse & { sessionId: string }> {
  const stripe = getStripeClient()
  const currency = payload.currency.toLowerCase()

  const order = await ensurePendingOrder({
    orderId: payload.orderId,
    total: payload.amount,
    paymentMethod: 'stripe',
    shippingAddress:
      payload.deliveryMethod === 'delivery'
        ? {
            address: payload.deliveryAddress ?? null,
            method: 'delivery',
            city: payload.metadata?.delivery?.city ?? null
          }
        : null
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: payload.returnUrl.replace('{CHECKOUT_SESSION_ID}', '{CHECKOUT_SESSION_ID}'),
    cancel_url: payload.cancelUrl,
    currency,
    customer_email: payload.customer.email,
    client_reference_id: order.id,
    billing_address_collection: 'required',
    locale: payload.locale ?? 'fr',
    metadata: {
      order_id: order.id,
      customer_phone: payload.customer.phone,
      delivery_method: payload.deliveryMethod ?? 'pickup'
    },
    line_items: payload.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency,
        product_data: {
          name: item.name,
          metadata: {
            product_id: item.productId
          }
        },
        unit_amount: formatStripeAmount(item.unitAmount)
      }
    }))
  })

  await updateOrderPaymentStatus({
    orderId: order.id,
    paymentStatus: 'processing',
    paymentMethod: 'stripe',
    paymentId: session.id
  })

  await createPaymentAuditLog({
    eventType: 'stripe.checkout.created',
    provider: 'stripe',
    orderId: order.id,
    paymentId: session.id,
    payload: session as unknown as Record<string, unknown>,
    metadata: payload.metadata,
    source: 'api'
  })

  return {
    provider: 'stripe',
    status: 'processing',
    orderId: order.id,
    paymentId: session.id,
    transactionId: session.payment_intent as string,
    redirectUrl: session.url ?? undefined,
    expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : undefined,
    raw: session,
    sessionId: session.id
  }
}

export function constructStripeEvent(rawBody: string | Buffer, signature: string | null) {
  const webhookSecret = requireEnv('STRIPE_WEBHOOK_SECRET')
  const stripe = getStripeClient()
  return stripe.webhooks.constructEvent(rawBody, signature ?? '', webhookSecret)
}

export function parseStripeEvent(event: Stripe.Event): PaymentWebhookPayload | null {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      return {
        provider: 'stripe',
        event: event.type,
        orderId: (session.client_reference_id as string) ?? '',
        paymentId: session.id,
        transactionId: session.payment_intent as string,
        status: mapStripeStatus(session.payment_status ?? session.status),
        amount: session.amount_total ?? 0,
        currency: session.currency?.toUpperCase() ?? 'XOF',
        metadata: session.metadata ?? undefined,
        raw: session
      }
    }
    case 'payment_intent.succeeded':
    case 'payment_intent.payment_failed':
    case 'payment_intent.processing': {
      const intent = event.data.object as Stripe.PaymentIntent
      return {
        provider: 'stripe',
        event: event.type,
        orderId: (intent.metadata?.order_id as string) ?? '',
        paymentId: intent.id,
        transactionId: intent.id,
        status: mapStripeStatus(intent.status),
        amount: intent.amount_received || intent.amount,
        currency: intent.currency?.toUpperCase() ?? 'XOF',
        metadata: intent.metadata ?? undefined,
        raw: intent
      }
    }
    default:
      return null
  }
}

export async function handleStripeWebhook(payload: PaymentWebhookPayload) {
  const { previousStatus } = await updateOrderPaymentStatus({
    orderId: payload.orderId,
    paymentStatus: payload.status,
    paymentMethod: 'stripe',
    paymentId: payload.paymentId,
    transactionId: payload.transactionId ?? undefined
  })

  if (payload.status === 'paid' && previousStatus !== 'paid') {
    await Promise.allSettled([
      sendOrderConfirmationEmail(payload.orderId),
      sendOrderConfirmationWhatsApp(payload.orderId)
    ])
  }

  await createPaymentAuditLog({
    eventType: `stripe.webhook.${payload.event}`,
    provider: 'stripe',
    orderId: payload.orderId,
    paymentId: payload.paymentId,
    transactionId: payload.transactionId,
    payload: payload.raw as Record<string, unknown>,
    metadata: payload.metadata ?? undefined,
    source: 'webhook'
  })
}

