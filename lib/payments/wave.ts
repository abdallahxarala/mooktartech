/**
 * Wave payment provider implementation
 * 
 * Wave API documentation: https://docs.wave.com
 * 
 * Note: This implementation uses Wave's standard API patterns.
 * Adjust endpoints and payloads based on actual Wave API documentation.
 */

import { z } from 'zod'
import { BasePaymentProvider } from './base'
import type {
  PaymentInitiationRequest,
  PaymentInitiationResponse,
  WebhookPayload,
  PaymentStatus,
  PaymentProviderConfig
} from './types'

// Wave API types
interface WaveInitiateRequest {
  amount: number
  currency: string
  customer: {
    name: string
    email?: string
    phone: string
  }
  callback_url: string
  metadata?: Record<string, unknown>
}

interface WaveInitiateResponse {
  id: string // Wave payment ID
  checkout_url: string
  expires_at?: string
  qr_code?: string
}

interface WaveWebhookPayload {
  event: 'payment.completed' | 'payment.failed' | 'payment.cancelled'
  data: {
    id: string // Wave payment ID
    transaction_id?: string
    amount: number
    currency: string
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
    metadata?: Record<string, unknown>
  }
  timestamp: string
  signature?: string
}

export class WavePaymentProvider extends BasePaymentProvider {
  constructor(config: PaymentProviderConfig) {
    super(config, 'Wave')
  }

  /**
   * Initiate payment with Wave
   */
  async initiatePayment(
    request: PaymentInitiationRequest
  ): Promise<PaymentInitiationResponse> {
    if (!this.isConfigured()) {
      throw new Error('Wave provider is not properly configured')
    }

    const waveRequest: WaveInitiateRequest = {
      amount: request.amount,
      currency: request.currency || 'XOF',
      customer: {
        name: request.customer.name,
        email: request.customer.email,
        phone: request.customer.phone
      },
      callback_url: `${this.config.base_url}/api/payments/webhook/wave`,
      metadata: {
        order_id: request.order_id,
        ...request.metadata
      }
    }

    const url = `${this.config.base_url}/v1/payments`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.api_key}`
    }

    if (this.config.merchant_id) {
      headers['X-Merchant-Id'] = this.config.merchant_id
    }

    const response = await this.fetchWithRetry(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(waveRequest)
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(`Wave API error: ${error.message || response.statusText}`)
    }

    const waveResponse: WaveInitiateResponse = await response.json()

    return {
      payment_id: '', // Will be set by API route
      provider_payment_id: waveResponse.id,
      checkout_url: waveResponse.checkout_url,
      expires_at: waveResponse.expires_at,
      qr_code: waveResponse.qr_code
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhook(payload: unknown, signature: string | null): boolean {
    if (!this.config.webhook_secret) {
      console.warn('Wave webhook secret not configured, skipping verification')
      return true // In development, allow without verification
    }

    if (!signature) {
      return false
    }

    // Wave typically uses HMAC-SHA256 for webhook signatures
    // Adjust based on actual Wave implementation
    try {
      // Import crypto synchronously (Node.js runtime)
      const crypto = require('crypto')
      
      const payloadString = typeof payload === 'string' 
        ? payload 
        : JSON.stringify(payload)
      
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhook_secret)
        .update(payloadString)
        .digest('hex')

      // Constant-time comparison to prevent timing attacks
      const signatureBuffer = Buffer.from(signature, 'hex')
      const expectedBuffer = Buffer.from(expectedSignature, 'hex')
      
      if (signatureBuffer.length !== expectedBuffer.length) {
        return false
      }

      return crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    } catch (error) {
      console.error('Error verifying Wave webhook signature:', error)
      return false
    }
  }

  /**
   * Map Wave status to internal status
   */
  mapStatus(providerStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      PENDING: 'pending',
      PROCESSING: 'processing',
      SUCCESS: 'completed',
      FAILED: 'failed',
      CANCELLED: 'cancelled'
    }

    return statusMap[providerStatus.toUpperCase()] || 'failed'
  }

  /**
   * Get Zod schema for Wave webhook validation
   */
  getWebhookSchema(): z.ZodSchema {
    return z.object({
      event: z.enum(['payment.completed', 'payment.failed', 'payment.cancelled']),
      data: z.object({
        id: z.string(),
        transaction_id: z.string().optional(),
        amount: z.number(),
        currency: z.string(),
        status: z.enum(['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED']),
        metadata: z.record(z.unknown()).optional()
      }),
      timestamp: z.string(),
      signature: z.string().optional()
    })
  }

  /**
   * Parse Wave webhook into standard format
   */
  parseWebhook(payload: unknown): WebhookPayload {
    const wavePayload = this.getWebhookSchema().parse(payload) as WaveWebhookPayload

    return {
      event_type: wavePayload.event,
      payment_id: wavePayload.data.id,
      transaction_id: wavePayload.data.transaction_id,
      amount: wavePayload.data.amount,
      currency: wavePayload.data.currency,
      status: wavePayload.data.status,
      metadata: wavePayload.data.metadata,
      timestamp: wavePayload.timestamp,
      signature: wavePayload.signature
    }
  }
}

// Export helper functions
export { WavePaymentProvider }
export * from './wave-helpers'