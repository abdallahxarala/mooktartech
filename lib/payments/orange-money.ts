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
import { verifyHmacSignature } from './utils'
import { sendOrderConfirmationEmail } from '@/lib/notifications/email'
import { sendOrderConfirmationWhatsApp } from '@/lib/notifications/whatsapp'

const BASE_URL =
  process.env.ORANGE_MONEY_API_URL ?? 'https://api.orange.com/orange-money-webpay/dev'

function mapOrangeMoneyStatus(status: string): PaymentStatus {
  switch (status?.toLowerCase()) {
    case 'success':
    case 'completed':
      return 'paid'
    case 'pending':
    case 'initiated':
      return 'processing'
    case 'failed':
    case 'cancelled':
    case 'canceled':
      return 'failed'
    default:
      return 'pending'
  }
}

interface OrangeMoneyInitiationOptions extends PaymentInitiationRequest {
  callbackUrl: string
}

export async function initiateOrangeMoneyPayment(
  payload: OrangeMoneyInitiationOptions
): Promise<PaymentInitiationResponse> {
  const apiKey = requireEnv('ORANGE_MONEY_API_KEY')
  const merchantId = requireEnv('ORANGE_MONEY_MERCHANT_ID')
  const order = await ensurePendingOrder({
    orderId: payload.orderId,
    total: payload.amount,
    shippingAddress: payload.deliveryMethod === 'delivery' ? (payload.metadata?.delivery as any) ?? null : null,
    paymentMethod: 'orange_money'
  })

  const requestBody = {
    merchant_key: merchantId,
    currency: payload.currency,
    order_id: order.id,
    amount: payload.amount,
    return_url: payload.returnUrl,
    cancel_url: payload.cancelUrl,
    notif_url: payload.callbackUrl,
    lang: payload.locale ?? 'fr',
    reference: payload.metadata?.reference ?? order.id,
    customer_first_name: payload.customer.firstName,
    customer_last_name: payload.customer.lastName,
    customer_email: payload.customer.email,
    customer_phone_number: payload.customer.phone
  }

  const response = await fetch(`${BASE_URL}/v1/webpayment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-Orange-ApiKey': apiKey
    },
    body: JSON.stringify(requestBody)
  })

  const data = await response.json().catch(() => null)

  if (!response.ok || !data) {
    await createPaymentAuditLog({
      eventType: 'orange_money.initiation.failed',
      provider: 'orange_money',
      orderId: order.id,
      payload: {
        request: requestBody,
        response: data
      },
      source: 'api'
    })
    throw new Error(data?.message ?? 'Impossible de créer la transaction Orange Money.')
  }

  const paymentId = data?.payment?.id ?? data?.transaction_id ?? order.id

  await updateOrderPaymentStatus({
    orderId: order.id,
    paymentStatus: 'processing',
    paymentMethod: 'orange_money',
    paymentId
  })

  await createPaymentAuditLog({
    eventType: 'orange_money.initiation.success',
    provider: 'orange_money',
    orderId: order.id,
    paymentId,
    payload: data,
    metadata: {
      request: requestBody
    },
    source: 'api'
  })

  return {
    provider: 'orange_money',
    status: 'processing',
    orderId: order.id,
    paymentId,
    transactionId: data?.transaction_id ?? null,
    redirectUrl: data?.payment_url ?? data?.web_payment_url,
    expiresAt: data?.expires_at,
    raw: data
  }
}

export function verifyOrangeMoneyWebhook(signature: string | null, rawBody: string) {
  const secret = process.env.ORANGE_MONEY_SIGNATURE_SECRET ?? requireEnv('ORANGE_MONEY_API_KEY')
  return verifyHmacSignature(signature, rawBody, secret)
}

export function parseOrangeMoneyWebhook(body: any): PaymentWebhookPayload {
  const status = mapOrangeMoneyStatus(body?.status ?? body?.transaction_status)

  return {
    provider: 'orange_money',
    event: body?.event ?? 'orange_money.webhook',
    orderId: body?.order_id ?? body?.order?.id ?? body?.external_id ?? '',
    paymentId: body?.payment_id ?? body?.transaction_id ?? '',
    transactionId: body?.transaction_id ?? null,
    status,
    amount: Number(body?.amount ?? 0),
    currency: body?.currency ?? 'XOF',
    metadata: body?.metadata ?? null,
    raw: body
  }
}

export async function handleOrangeMoneyWebhook(payload: PaymentWebhookPayload) {
  const { previousStatus } = await updateOrderPaymentStatus({
    orderId: payload.orderId,
    paymentStatus: payload.status,
    paymentMethod: 'orange_money',
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
    eventType: `orange_money.webhook.${payload.status}`,
    provider: 'orange_money',
    orderId: payload.orderId,
    paymentId: payload.paymentId,
    transactionId: payload.transactionId,
    payload: payload.raw as Record<string, unknown>,
    metadata: payload.metadata ?? undefined,
    source: 'webhook'
  })
}

