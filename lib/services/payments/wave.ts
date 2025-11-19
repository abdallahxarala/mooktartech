/**
 * Service d'intégration Wave pour les paiements
 * Documentation: https://developer.wave.com/docs
 * 
 * NOTE: Ce fichier contient des fonctions qui utilisent le client serveur Supabase.
 * Pour utiliser createWavePayment depuis un composant client, utilisez l'endpoint API:
 * POST /api/foires/[eventSlug]/payments/wave
 */

/**
 * Import conditionnel du client serveur Supabase
 * Ne s'exécute que côté serveur pour éviter le bundling dans le client
 */
async function getSupabaseServerClient() {
  if (typeof window !== 'undefined') {
    throw new Error('getSupabaseServerClient ne peut être utilisé que côté serveur')
  }
  const { createSupabaseServerClient } = await import('@/lib/supabase/server')
  return await createSupabaseServerClient()
}

/**
 * Interface pour la requête de paiement Wave
 */
export interface WavePaymentRequest {
  amount: number
  currency: 'XOF'
  error_url: string
  success_url: string
  metadata: {
    exhibitor_id?: string
    event_id: string
    organization_id: string
    company_name: string
    contact_email: string
  }
}

/**
 * Interface pour la réponse Wave
 */
export interface WavePaymentResponse {
  id: string
  wave_launch_url: string
  checkout_status: string
  amount: number
  currency: string
  metadata?: Record<string, any>
}

/**
 * Interface pour la vérification d'un paiement Wave
 */
export interface WavePaymentVerification {
  id: string
  checkout_status: 'pending' | 'completed' | 'failed' | 'cancelled'
  amount: number
  currency: string
  metadata?: Record<string, any>
  created_at?: string
  completed_at?: string
}

/**
 * Crée une session de paiement Wave
 * 
 * @param data - Données du paiement
 * @returns Réponse Wave avec l'URL de redirection
 * @throws Error si la création échoue
 */
export async function createWavePayment(
  data: WavePaymentRequest
): Promise<WavePaymentResponse> {
  const apiKey = process.env.WAVE_API_KEY
  const apiUrl = process.env.WAVE_API_URL || 'https://api.wave.com/v1'

  if (!apiKey) {
    throw new Error('WAVE_API_KEY n\'est pas configurée dans les variables d\'environnement')
  }

  try {
    const response = await fetch(`${apiUrl}/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: data.amount,
        currency: data.currency,
        error_url: data.error_url,
        success_url: data.success_url,
        metadata: data.metadata,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Erreur Wave API: ${response.status} - ${errorData.message || response.statusText}`
      )
    }

    const result: WavePaymentResponse = await response.json()

    // Logger la transaction (uniquement côté serveur)
    if (typeof window === 'undefined') {
      try {
        await logPaymentTransaction({
          payment_provider: 'wave',
          checkout_id: result.id,
          amount: data.amount,
          currency: data.currency,
          status: 'initiated',
          metadata: data.metadata,
        })
      } catch (logError) {
        // Ne pas bloquer le paiement si le logging échoue
        console.warn('Erreur lors du logging de la transaction:', logError)
      }
    }

    return result
  } catch (error) {
    console.error('Erreur lors de la création du paiement Wave:', error)
    throw error instanceof Error
      ? error
      : new Error('Erreur inconnue lors de la création du paiement Wave')
  }
}

/**
 * Vérifie le statut d'un paiement Wave
 * 
 * @param checkoutId - ID de la session de checkout Wave
 * @returns Statut du paiement
 * @throws Error si la vérification échoue
 */
export async function verifyWavePayment(
  checkoutId: string
): Promise<WavePaymentVerification> {
  const apiKey = process.env.WAVE_API_KEY
  const apiUrl = process.env.WAVE_API_URL || 'https://api.wave.com/v1'

  if (!apiKey) {
    throw new Error('WAVE_API_KEY n\'est pas configurée')
  }

  try {
    const response = await fetch(`${apiUrl}/checkout/sessions/${checkoutId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Erreur Wave API: ${response.status} - ${errorData.message || response.statusText}`
      )
    }

    const result: WavePaymentVerification = await response.json()
    return result
  } catch (error) {
    console.error('Erreur lors de la vérification du paiement Wave:', error)
    throw error instanceof Error
      ? error
      : new Error('Erreur inconnue lors de la vérification du paiement Wave')
  }
}

/**
 * Vérifie la signature d'un webhook Wave
 * 
 * @param payload - Corps du webhook (string)
 * @param signature - Signature fournie par Wave
 * @returns true si la signature est valide
 */
export function verifyWaveWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const webhookSecret = process.env.WAVE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.warn('WAVE_WEBHOOK_SECRET n\'est pas configurée - signature non vérifiée')
    return true // En développement, accepter sans vérification
  }

  try {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Erreur lors de la vérification de la signature:', error)
    return false
  }
}

/**
 * Traite un webhook Wave
 * 
 * @param payload - Données du webhook
 * @param signature - Signature du webhook
 * @returns Promise<void>
 * @throws Error si le traitement échoue
 */
export async function handleWaveWebhook(
  payload: any,
  signature: string
): Promise<void> {
  // Vérifier la signature
  const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload)
  const isValid = verifyWaveWebhookSignature(payloadString, signature)

  if (!isValid) {
    throw new Error('Signature webhook Wave invalide')
  }

  const eventType = payload.type || payload.event_type
  const checkoutId = payload.checkout_id || payload.id
  const metadata = payload.metadata || {}

  console.log(`📥 Webhook Wave reçu: ${eventType} - Checkout ID: ${checkoutId}`)

  // Logger la transaction
  await logPaymentTransaction({
    payment_provider: 'wave',
    checkout_id: checkoutId,
    amount: payload.amount || 0,
    currency: payload.currency || 'XOF',
    status: eventType === 'payment.success' ? 'completed' : 'failed',
    metadata: {
      ...metadata,
      webhook_event: eventType,
    },
  })

  // Traiter selon le type d'événement
  if (eventType === 'payment.success' || eventType === 'checkout.completed') {
    await handleWavePaymentSuccess(checkoutId, payload, metadata)
  } else if (eventType === 'payment.failed' || eventType === 'checkout.failed') {
    await handleWavePaymentFailed(checkoutId, payload, metadata)
  } else {
    console.log(`⚠️ Événement Wave non géré: ${eventType}`)
  }
}

/**
 * Traite un paiement Wave réussi
 */
async function handleWavePaymentSuccess(
  checkoutId: string,
  payload: any,
  metadata: Record<string, any>
): Promise<void> {
  const supabase = await getSupabaseServerClient()

  try {
    // Si exhibitor_id est dans les metadata, mettre à jour le statut
    if (metadata.exhibitor_id) {
      // 1. Récupérer l'exhibitor AVANT la mise à jour pour avoir toutes les données
      const { data: exhibitor, error: fetchError } = await supabase
        .from('exhibitors')
        .select('*')
        .eq('id', metadata.exhibitor_id)
        .single()

      if (fetchError || !exhibitor) {
        console.error('Erreur récupération exhibitor:', fetchError)
        throw fetchError || new Error('Exhibitor not found')
      }

      // 2. Mettre à jour le statut
      const { error: updateError } = await supabase
        .from('exhibitors')
        .update({
          payment_status: 'paid',
          payment_method: 'wave',
          payment_reference: checkoutId,
          status: 'approved', // Approuver automatiquement après paiement
          updated_at: new Date().toISOString(),
        })
        .eq('id', metadata.exhibitor_id)

      if (updateError) {
        console.error('Erreur mise à jour exhibitor:', updateError)
        throw updateError
      }

      console.log(`✅ Exposant ${metadata.exhibitor_id} mis à jour: paiement confirmé`)

      // 3. Générer et uploader la facture PDF automatiquement
      try {
        const { 
          generateInvoicePDF, 
          uploadInvoiceToStorage, 
          buildInvoiceDataFromExhibitor 
        } = await import('@/lib/services/pdf/invoice-generator')
        
        // Récupérer l'événement pour construire la facture
        const { data: eventData } = await supabase
          .from('events')
          .select('*')
          .eq('id', exhibitor.event_id)
          .single()

        if (eventData) {
          const event = eventData as any
          
          // Construire les données de facture
          const invoiceData = buildInvoiceDataFromExhibitor(exhibitor, event)
          
          // Générer le PDF
          const pdfBlob = await generateInvoicePDF(invoiceData)
          
          // Upload vers Supabase Storage
          const invoiceUrl = await uploadInvoiceToStorage(
            pdfBlob,
            exhibitor.id,
            invoiceData.invoice_number
          )
          
          // Mettre à jour metadata avec l'URL de la facture
          const currentMetadata = exhibitor.metadata || {}
          await supabase
            .from('exhibitors')
            .update({
              metadata: {
                ...currentMetadata,
                invoice_url: invoiceUrl,
                invoice_number: invoiceData.invoice_number,
                invoice_generated_at: new Date().toISOString(),
              },
              updated_at: new Date().toISOString(),
            })
            .eq('id', exhibitor.id)
          
          console.log(`✅ Facture PDF générée et uploadée: ${invoiceUrl}`)
          
          // 4. Envoyer email de confirmation avec facture (en arrière-plan)
          try {
            const { sendExhibitorConfirmationEmail } = await import('@/lib/services/email/templates')
            
            const foireConfig = event?.foire_config || {}
            const pavillons = foireConfig.pavillons || {}
            const pavillon = Object.values(pavillons).find(
              (p: any) => p.code === exhibitor.booth_location
            ) as any

            // Construire l'URL de la facture (endpoint API)
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foire-dakar-2025.com'
            const invoiceApiUrl = `${baseUrl}/api/foires/${event?.slug || 'foire-dakar-2025'}/invoices/${exhibitor.id}`

            const exhibitorMetadata = exhibitor.metadata || {}
            await sendExhibitorConfirmationEmail({
              to: exhibitor.contact_email,
              exhibitorName: exhibitor.contact_name,
              companyName: exhibitor.company_name,
              standNumber: exhibitor.booth_number || null,
              pavilionName: pavillon?.nom || exhibitor.booth_location || 'Non assigné',
              surfaceArea: exhibitorMetadata.standSize || exhibitorMetadata.stand_size || 0,
              totalPrice: exhibitor.payment_amount || 0,
              invoiceUrl: invoiceApiUrl, // URL de l'endpoint API pour téléchargement
            })
            console.log('✅ Email de confirmation avec facture envoyé après paiement')
          } catch (emailError) {
            console.warn('⚠️ Erreur envoi email après paiement (non bloquant):', emailError)
            // Ne pas bloquer le processus si l'email échoue
          }
        }
      } catch (invoiceError) {
        console.warn('⚠️ Erreur génération facture après paiement (non bloquant):', invoiceError)
        // Ne pas bloquer le processus si la facture échoue
      }
    }
  } catch (error) {
    console.error('Erreur lors du traitement du paiement réussi:', error)
    throw error
  }
}

/**
 * Traite un paiement Wave échoué
 */
async function handleWavePaymentFailed(
  checkoutId: string,
  payload: any,
  metadata: Record<string, any>
): Promise<void> {
  const supabase = await getSupabaseServerClient()

  try {
    // Mettre à jour le statut du paiement
    if (metadata.exhibitor_id) {
      const { error } = await supabase
        .from('exhibitors')
        .update({
          payment_status: 'failed',
          payment_reference: checkoutId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', metadata.exhibitor_id)

      if (error) {
        console.error('Erreur mise à jour exhibitor (échec):', error)
      }
    }
  } catch (error) {
    console.error('Erreur lors du traitement du paiement échoué:', error)
    // Ne pas throw pour les échecs de paiement
  }
}

/**
 * Log une transaction de paiement dans la base de données
 */
async function logPaymentTransaction(data: {
  payment_provider: string
  checkout_id: string
  amount: number
  currency: string
  status: string
  metadata?: Record<string, any>
}): Promise<void> {
  const supabase = await getSupabaseServerClient()

  try {
    // Vérifier si la table payment_logs existe, sinon créer un log dans exhibitors
    const { error } = await supabase
      .from('exhibitors')
      .update({
        payment_reference: data.checkout_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.metadata?.exhibitor_id || '')

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = aucune ligne trouvée, ce qui est OK si exhibitor n'existe pas encore
      console.warn('Impossible de logger la transaction:', error.message)
    }
  } catch (error) {
    console.warn('Erreur logging transaction:', error)
    // Ne pas bloquer le processus pour un problème de logging
  }
}

