/**
 * Payment provider factory
 * 
 * Creates and returns the appropriate payment provider instance
 */

import { WavePaymentProvider } from './wave'
import type { BasePaymentProvider } from './base'
import type { PaymentProvider, PaymentProviderConfig } from './types'

export class PaymentServiceFactory {
  /**
   * Get payment provider instance
   */
  static getProvider(provider: PaymentProvider): BasePaymentProvider {
    const config = this.getProviderConfig(provider)

    switch (provider) {
      case 'wave':
        return new WavePaymentProvider(config)
      
      case 'orange_money':
        // TODO: Implement OrangeMoneyPaymentProvider
        throw new Error('Orange Money provider not yet implemented')
      
      case 'free_money':
        // TODO: Implement FreeMoneyPaymentProvider
        throw new Error('Free Money provider not yet implemented')
      
      default:
        throw new Error(`Unknown payment provider: ${provider}`)
    }
  }

  /**
   * Get provider configuration from environment variables
   */
  private static getProviderConfig(provider: PaymentProvider): PaymentProviderConfig {
    const env = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
    const baseUrl = process.env[`${provider.toUpperCase()}_API_URL`] || ''

    switch (provider) {
      case 'wave': {
        const apiKey = process.env.WAVE_API_KEY
        if (!apiKey) {
          throw new Error('WAVE_API_KEY environment variable is required')
        }

        return {
          api_key: apiKey,
          api_secret: process.env.WAVE_API_SECRET,
          merchant_id: process.env.WAVE_MERCHANT_ID,
          webhook_secret: process.env.WAVE_WEBHOOK_SECRET,
          base_url: baseUrl || (env === 'production' 
            ? 'https://api.wave.com' 
            : 'https://api-sandbox.wave.com'),
          environment: env
        }
      }

      case 'orange_money': {
        const apiKey = process.env.ORANGE_MONEY_API_KEY
        if (!apiKey) {
          throw new Error('ORANGE_MONEY_API_KEY environment variable is required')
        }

        return {
          api_key: apiKey,
          api_secret: process.env.ORANGE_MONEY_API_SECRET,
          merchant_id: process.env.ORANGE_MONEY_MERCHANT_ID,
          webhook_secret: process.env.ORANGE_MONEY_WEBHOOK_SECRET,
          base_url: baseUrl || (env === 'production'
            ? 'https://api.orange.com'
            : 'https://api-sandbox.orange.com'),
          environment: env
        }
      }

      case 'free_money': {
        const apiKey = process.env.FREE_MONEY_API_KEY
        if (!apiKey) {
          throw new Error('FREE_MONEY_API_KEY environment variable is required')
        }

        return {
          api_key: apiKey,
          api_secret: process.env.FREE_MONEY_API_SECRET,
          merchant_id: process.env.FREE_MONEY_MERCHANT_ID,
          webhook_secret: process.env.FREE_MONEY_WEBHOOK_SECRET,
          base_url: baseUrl || (env === 'production'
            ? 'https://api.free.sn'
            : 'https://api-sandbox.free.sn'),
          environment: env
        }
      }

      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  }

  /**
   * Check if provider is available/configured
   */
  static isProviderAvailable(provider: PaymentProvider): boolean {
    try {
      const config = this.getProviderConfig(provider)
      return !!config.api_key
    } catch {
      return false
    }
  }
}

