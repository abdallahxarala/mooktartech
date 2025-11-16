/**
 * Jest tests for Wave payment provider
 * 
 * Run with: npm test -- payments/wave.test.ts
 */

import { WavePaymentProvider } from '@/lib/payments/wave'
import type { PaymentProviderConfig, PaymentInitiationRequest } from '@/lib/payments/types'

// Mock fetch
global.fetch = jest.fn()

describe('WavePaymentProvider', () => {
  const mockConfig: PaymentProviderConfig = {
    api_key: 'test_api_key',
    api_secret: 'test_secret',
    merchant_id: 'test_merchant',
    webhook_secret: 'test_webhook_secret',
    base_url: 'https://api-sandbox.wave.com',
    environment: 'sandbox'
  }

  let provider: WavePaymentProvider

  beforeEach(() => {
    provider = new WavePaymentProvider(mockConfig)
    jest.clearAllMocks()
  })

  describe('initiatePayment', () => {
    const mockRequest: PaymentInitiationRequest = {
      order_id: 'order-123',
      amount: 10000, // 100 XOF in smallest unit
      currency: 'XOF',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+221 77 123 45 67'
      }
    }

    it('should successfully initiate payment', async () => {
      const mockResponse = {
        id: 'wave_payment_123',
        checkout_url: 'https://checkout.wave.com/pay/wave_payment_123',
        expires_at: '2025-01-30T12:00:00Z'
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await provider.initiatePayment(mockRequest)

      expect(result).toEqual({
        payment_id: '',
        provider_payment_id: 'wave_payment_123',
        checkout_url: 'https://checkout.wave.com/pay/wave_payment_123',
        expires_at: '2025-01-30T12:00:00Z'
      })

      expect(fetch).toHaveBeenCalledWith(
        'https://api-sandbox.wave.com/v1/payments',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test_api_key',
            'X-Merchant-Id': 'test_merchant'
          }),
          body: JSON.stringify({
            amount: 10000,
            currency: 'XOF',
            customer: {
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+221 77 123 45 67'
            },
            callback_url: expect.stringContaining('/api/payments/webhook/wave'),
            metadata: {
              order_id: 'order-123'
            }
          })
        })
      )
    })

    it('should throw error on API failure', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid request' })
      })

      await expect(provider.initiatePayment(mockRequest)).rejects.toThrow(
        'Wave API error'
      )
    })

    it('should retry on 5xx errors', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 500
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 'wave_payment_123',
            checkout_url: 'https://checkout.wave.com/pay/wave_payment_123'
          })
        })

      const result = await provider.initiatePayment(mockRequest)

      expect(result).toBeDefined()
      expect(fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('mapStatus', () => {
    it('should map Wave statuses to internal statuses', () => {
      expect(provider.mapStatus('PENDING')).toBe('pending')
      expect(provider.mapStatus('PROCESSING')).toBe('processing')
      expect(provider.mapStatus('SUCCESS')).toBe('completed')
      expect(provider.mapStatus('FAILED')).toBe('failed')
      expect(provider.mapStatus('CANCELLED')).toBe('cancelled')
      expect(provider.mapStatus('UNKNOWN')).toBe('failed') // Default
    })
  })

  describe('verifyWebhook', () => {
    it('should verify valid webhook signature', () => {
      const payload = { event: 'payment.completed', data: { id: '123' } }
      const signature = 'valid_signature'

      // Mock crypto
      const crypto = require('crypto')
      const mockHmac = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('valid_signature')
      }
      jest.spyOn(crypto, 'createHmac').mockReturnValue(mockHmac)
      jest.spyOn(crypto, 'timingSafeEqual').mockReturnValue(true)

      const result = provider.verifyWebhook(payload, signature)
      expect(result).toBe(true)
    })

    it('should reject invalid signature', () => {
      const payload = { event: 'payment.completed', data: { id: '123' } }
      const signature = 'invalid_signature'

      const crypto = require('crypto')
      const mockHmac = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('valid_signature')
      }
      jest.spyOn(crypto, 'createHmac').mockReturnValue(mockHmac)
      jest.spyOn(crypto, 'timingSafeEqual').mockReturnValue(false)

      const result = provider.verifyWebhook(payload, signature)
      expect(result).toBe(false)
    })

    it('should allow webhook without secret in development', () => {
      const providerNoSecret = new WavePaymentProvider({
        ...mockConfig,
        webhook_secret: undefined
      })

      const result = providerNoSecret.verifyWebhook({}, null)
      expect(result).toBe(true)
    })
  })

  describe('parseWebhook', () => {
    it('should parse webhook payload correctly', () => {
      const wavePayload = {
        event: 'payment.completed',
        data: {
          id: 'wave_payment_123',
          transaction_id: 'txn_456',
          amount: 10000,
          currency: 'XOF',
          status: 'SUCCESS',
          metadata: { order_id: 'order-123' }
        },
        timestamp: '2025-01-30T10:00:00Z',
        signature: 'sig_123'
      }

      const result = provider.parseWebhook(wavePayload)

      expect(result).toEqual({
        event_type: 'payment.completed',
        payment_id: 'wave_payment_123',
        transaction_id: 'txn_456',
        amount: 10000,
        currency: 'XOF',
        status: 'SUCCESS',
        metadata: { order_id: 'order-123' },
        timestamp: '2025-01-30T10:00:00Z',
        signature: 'sig_123'
      })
    })
  })

  describe('isConfigured', () => {
    it('should return true when properly configured', () => {
      expect(provider.isConfigured()).toBe(true)
    })

    it('should return false when missing api_key', () => {
      const invalidProvider = new WavePaymentProvider({
        ...mockConfig,
        api_key: ''
      })
      expect(invalidProvider.isConfigured()).toBe(false)
    })
  })
})

