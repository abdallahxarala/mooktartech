/**
 * Service d'intégration Wave Payment
 * Documentation: https://docs.wave.com
 */

export interface WavePaymentParams {
  amount: number
  currency: 'XOF' | 'EUR' | 'USD'
  successUrl: string
  errorUrl: string
  customer?: {
    name: string
    email?: string
    phone?: string
  }
  metadata?: Record<string, any>
  description?: string
}

export interface WavePaymentResponse {
  checkoutUrl: string
  sessionId: string
  expiresAt?: string
}

export interface WavePaymentVerification {
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  amount: number
  currency: string
  reference?: string
  customer?: {
    name: string
    email?: string
    phone?: string
  }
}

/**
 * Initier un paiement Wave
 */
export async function initiateWavePayment(
  params: WavePaymentParams
): Promise<WavePaymentResponse> {
  try {
    if (!process.env.WAVE_API_KEY) {
      throw new Error('WAVE_API_KEY non configurée')
    }

    if (!process.env.WAVE_BUSINESS_ID) {
      throw new Error('WAVE_BUSINESS_ID non configurée')
    }

    const waveApiUrl = process.env.WAVE_API_URL || 'https://api.wave.com/v1'

    const response = await fetch(`${waveApiUrl}/checkout/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WAVE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        success_url: params.successUrl,
        error_url: params.errorUrl,
        business_id: process.env.WAVE_BUSINESS_ID,
        customer_name: params.customer?.name,
        customer_email: params.customer?.email,
        customer_phone: params.customer?.phone,
        description: params.description,
        metadata: params.metadata,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}`,
      }))
      throw new Error(errorData.message || 'Erreur lors de l\'initiation du paiement Wave')
    }

    const data = await response.json()

    return {
      checkoutUrl: data.wave_launch_url || data.checkout_url || data.url,
      sessionId: data.id || data.session_id,
      expiresAt: data.expires_at,
    }
  } catch (error) {
    console.error('Error initiating Wave payment:', error)
    throw error
  }
}

/**
 * Vérifier le statut d'un paiement Wave
 */
export async function verifyWavePayment(
  sessionId: string
): Promise<WavePaymentVerification> {
  try {
    if (!process.env.WAVE_API_KEY) {
      throw new Error('WAVE_API_KEY non configurée')
    }

    const waveApiUrl = process.env.WAVE_API_URL || 'https://api.wave.com/v1'

    const response = await fetch(`${waveApiUrl}/checkout/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.WAVE_API_KEY}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}`,
      }))
      throw new Error(errorData.message || 'Erreur lors de la vérification du paiement')
    }

    const data = await response.json()

    // Mapper les statuts Wave vers nos statuts internes
    const statusMap: Record<string, WavePaymentVerification['status']> = {
      pending: 'pending',
      processing: 'pending',
      completed: 'completed',
      success: 'completed',
      failed: 'failed',
      cancelled: 'cancelled',
      expired: 'cancelled',
    }

    return {
      status: statusMap[data.status?.toLowerCase()] || 'pending',
      amount: data.amount || 0,
      currency: data.currency || 'XOF',
      reference: data.payment_reference || data.reference,
      customer: data.customer
        ? {
            name: data.customer.name || data.customer_name,
            email: data.customer.email || data.customer_email,
            phone: data.customer.phone || data.customer_phone,
          }
        : undefined,
    }
  } catch (error) {
    console.error('Error verifying Wave payment:', error)
    throw error
  }
}

/**
 * Vérifier la signature d'un webhook Wave
 */
export function verifyWaveWebhookSignature(
  payload: string,
  signature: string
): boolean {
  try {
    if (!process.env.WAVE_SECRET_KEY) {
      console.warn('WAVE_SECRET_KEY non configurée, skip verification')
      return true // En développement, permettre sans vérification
    }

    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', process.env.WAVE_SECRET_KEY)
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('Error verifying Wave webhook signature:', error)
    return false
  }
}

