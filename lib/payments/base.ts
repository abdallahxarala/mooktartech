/**
 * Abstract base class for payment providers
 * 
 * All payment providers must extend this class and implement
 * the abstract methods.
 */

import type {
  PaymentInitiationRequest,
  PaymentInitiationResponse,
  WebhookPayload,
  PaymentStatus,
  PaymentProviderConfig
} from './types'

export abstract class BasePaymentProvider {
  protected config: PaymentProviderConfig
  protected providerName: string

  constructor(config: PaymentProviderConfig, providerName: string) {
    this.config = config
    this.providerName = providerName
  }

  /**
   * Initiate a payment with the provider
   * Must be implemented by each provider
   */
  abstract initiatePayment(
    request: PaymentInitiationRequest
  ): Promise<PaymentInitiationResponse>

  /**
   * Verify webhook signature/authenticity
   * Must be implemented by each provider
   */
  abstract verifyWebhook(
    payload: unknown,
    signature: string | null
  ): boolean

  /**
   * Map provider-specific status to internal status
   * Must be implemented by each provider
   */
  abstract mapStatus(providerStatus: string): PaymentStatus

  /**
   * Get provider-specific webhook payload schema
   * Used for Zod validation
   */
  abstract getWebhookSchema(): import('zod').ZodSchema

  /**
   * Parse webhook payload into standard format
   */
  abstract parseWebhook(payload: unknown): WebhookPayload

  /**
   * Get provider display name
   */
  getName(): string {
    return this.providerName
  }

  /**
   * Check if provider is configured
   */
  isConfigured(): boolean {
    return !!(
      this.config.api_key &&
      this.config.base_url &&
      (this.config.environment === 'sandbox' || this.config.environment === 'production')
    )
  }

  /**
   * Make HTTP request with retry logic
   */
  protected async fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries = 3
  ): Promise<Response> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options)

        // Retry on 5xx errors
        if (response.status >= 500 && attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000 // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        return response
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError || new Error('Request failed after retries')
  }
}

