/**
 * Service d'automatisation de la génération de factures
 * Foire Internationale de Dakar 2025
 * 
 * Ce service automatise la génération de factures PDF après :
 * - Inscription exposant (si paiement immédiat)
 * - Paiement confirmé (Wave, Orange Money, etc.)
 * - Mise à jour manuelle du statut de paiement
 */

import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateInvoicePDF,
  uploadInvoiceToStorage,
  buildInvoiceDataFromExhibitor,
  type InvoiceData,
} from './pdf/invoice-generator'
import { sendExhibitorConfirmationEmail } from './email/templates'

/**
 * Génère automatiquement une facture pour un exposant
 * 
 * @param exhibitorId - ID de l'exposant
 * @param options - Options de génération
 * @returns URL de la facture générée
 */
export async function generateInvoiceForExhibitor(
  exhibitorId: string,
  options: {
    sendEmail?: boolean
    forceRegenerate?: boolean
  } = {}
): Promise<{ invoiceUrl: string; invoiceNumber: string }> {
  const supabase = await createSupabaseServerClient()

  try {
    // 1. Récupérer l'exposant
    const { data: exhibitor, error: exhibitorError } = await supabase
      .from('exhibitors')
      .select('*')
      .eq('id', exhibitorId)
      .single()

    if (exhibitorError || !exhibitor) {
      throw new Error(`Exhibitor not found: ${exhibitorId}`)
    }

    // 2. Vérifier si une facture existe déjà
    const metadata = exhibitor.metadata || {}
    if (metadata.invoice_url && !options.forceRegenerate) {
      console.log(`ℹ️ Facture déjà générée pour ${exhibitorId}: ${metadata.invoice_url}`)
      return {
        invoiceUrl: metadata.invoice_url,
        invoiceNumber: metadata.invoice_number || 'N/A',
      }
    }

    // 3. Récupérer l'événement
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', exhibitor.event_id)
      .single()

    if (eventError || !event) {
      throw new Error(`Event not found for exhibitor ${exhibitorId}`)
    }

    // 4. Construire les données de facture
    const invoiceData = buildInvoiceDataFromExhibitor(exhibitor, event)

    // 5. Générer le PDF
    const pdfBlob = await generateInvoicePDF(invoiceData)

    // 6. Upload vers Supabase Storage
    const invoiceUrl = await uploadInvoiceToStorage(
      pdfBlob,
      exhibitorId,
      invoiceData.invoice_number
    )

    // 7. Mettre à jour metadata avec l'URL de la facture
    await supabase
      .from('exhibitors')
      .update({
        metadata: {
          ...metadata,
          invoice_url: invoiceUrl,
          invoice_number: invoiceData.invoice_number,
          invoice_generated_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', exhibitorId)

    console.log(`✅ Facture générée pour ${exhibitorId}: ${invoiceUrl}`)

    // 8. Envoyer email si demandé
    if (options.sendEmail) {
      try {
        await sendInvoiceEmail(exhibitor, event, invoiceData, invoiceUrl)
      } catch (emailError) {
        console.warn('⚠️ Erreur envoi email facture (non bloquant):', emailError)
      }
    }

    return {
      invoiceUrl,
      invoiceNumber: invoiceData.invoice_number,
    }
  } catch (error) {
    console.error(`❌ Erreur génération facture pour ${exhibitorId}:`, error)
    throw error
  }
}

/**
 * Envoie un email avec la facture à l'exposant
 */
async function sendInvoiceEmail(
  exhibitor: any,
  event: any,
  invoiceData: InvoiceData,
  invoiceUrl: string
): Promise<void> {
  const foireConfig = event?.foire_config || {}
  const pavillons = foireConfig.pavillons || {}
  const pavillon = Object.values(pavillons).find(
    (p: any) => p.code === exhibitor.booth_location
  ) as any

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
    totalPrice: exhibitor.payment_amount || invoiceData.total,
    invoiceUrl: invoiceApiUrl,
  })

  console.log(`✅ Email avec facture envoyé à ${exhibitor.contact_email}`)
}

/**
 * Génère des factures pour tous les exposants avec paiement confirmé mais sans facture
 * 
 * @param eventId - ID de l'événement (optionnel)
 * @returns Nombre de factures générées
 */
export async function generateMissingInvoices(
  eventId?: string
): Promise<{ generated: number; errors: number }> {
  const supabase = await createSupabaseServerClient()

  try {
    // Récupérer les exposants avec paiement confirmé mais sans facture
    let query = supabase
      .from('exhibitors')
      .select('*')
      .eq('payment_status', 'paid')
      .is('metadata->invoice_url', null)

    if (eventId) {
      query = query.eq('event_id', eventId)
    }

    const { data: exhibitors, error } = await query

    if (error) {
      throw error
    }

    if (!exhibitors || exhibitors.length === 0) {
      console.log('ℹ️ Aucun exposant sans facture trouvé')
      return { generated: 0, errors: 0 }
    }

    console.log(`📄 Génération de ${exhibitors.length} factures manquantes...`)

    let generated = 0
    let errors = 0

    for (const exhibitor of exhibitors) {
      try {
        await generateInvoiceForExhibitor(exhibitor.id, { sendEmail: false })
        generated++
      } catch (error) {
        console.error(`❌ Erreur génération facture pour ${exhibitor.id}:`, error)
        errors++
      }
    }

    console.log(`✅ ${generated} factures générées, ${errors} erreurs`)

    return { generated, errors }
  } catch (error) {
    console.error('❌ Erreur génération factures manquantes:', error)
    throw error
  }
}

