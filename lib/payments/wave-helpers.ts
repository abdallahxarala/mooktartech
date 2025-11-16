/**
 * Helper functions for Wave payment integration
 * These functions wrap the WavePaymentProvider class for easier use
 */

import { WavePaymentProvider } from './wave'
import type { PaymentInitiationRequest, WebhookPayload } from './types'

// Create Wave provider instance
function getWaveProvider(): WavePaymentProvider {
  return new WavePaymentProvider({
    api_key: process.env.WAVE_API_KEY || '',
    webhook_secret: process.env.WAVE_SECRET || '',
    base_url: process.env.WAVE_API_URL || 'https://api.wave.com',
    merchant_id: process.env.WAVE_MERCHANT_ID,
  })
}

/**
 * Initiate a Wave payment
 */
export async function initiateWavePayment(
  request: PaymentInitiationRequest & {
    callbackUrl?: string
    returnUrl?: string
    cancelUrl?: string
  }
): Promise<{
  checkout_url: string
  payment_id: string
  status: 'pending' | 'processing'
}> {
  const provider = getWaveProvider()

  // Override callback URL if provided
  if (request.callbackUrl) {
    const originalRequest = { ...request }
    delete (originalRequest as any).callbackUrl
    delete (originalRequest as any).returnUrl
    delete (originalRequest as any).cancelUrl

    const response = await provider.initiatePayment(originalRequest as PaymentInitiationRequest)

    return {
      checkout_url: response.checkout_url,
      payment_id: response.provider_payment_id,
      status: 'pending',
    }
  }

  const response = await provider.initiatePayment(request)

  return {
    checkout_url: response.checkout_url,
    payment_id: response.provider_payment_id,
    status: 'pending',
  }
}

/**
 * Verify Wave webhook signature
 */
export function verifyWaveWebhook(signature: string | null, body: string): boolean {
  const provider = getWaveProvider()
  try {
    const json = JSON.parse(body || '{}')
    return provider.verifyWebhook(json, signature)
  } catch {
    return false
  }
}

/**
 * Parse Wave webhook payload
 */
export function parseWaveWebhook(payload: unknown): WebhookPayload & {
  payment_id: string
  status: string
  metadata?: Record<string, unknown>
} {
  const provider = getWaveProvider()
  const parsed = provider.parseWebhook(payload)

  return {
    ...parsed,
    payment_id: parsed.payment_id || '',
    status: parsed.status || 'PENDING',
    metadata: parsed.metadata as Record<string, unknown> | undefined,
  }
}

/**
 * Handle Wave webhook (generic handler)
 * For ticket-specific handling, use the tickets webhook route
 */
export async function handleWaveWebhook(payload: WebhookPayload): Promise<void> {
  // Generic webhook handler - can be extended for other payment types
  console.log('Wave webhook received:', payload)
  // TODO: Implement generic webhook handling logic
}

