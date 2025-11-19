/**
 * Service de génération et validation de QR codes pour les billets
 * Foire Internationale de Dakar 2025
 */

import QRCode from 'qrcode'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Structure des données dans le QR code
 */
export interface TicketQRData {
  ticketId: string // UUID du ticket
  eventSlug: string // Slug de l'événement
  ticketType: string // Type de billet
  quantity: number // Quantité
  timestamp: number // Timestamp de génération
  buyerEmail: string // Email de l'acheteur (pour validation)
}

/**
 * Résultat de validation d'un QR code
 */
export interface TicketValidationResult {
  valid: boolean
  ticket?: {
    id: string
    buyerName: string
    buyerEmail: string
    ticketType: string
    quantity: number
    used: boolean
    usedAt: string | null
    eventId: string
  }
  error?: string
}

/**
 * Génère un QR code pour un billet
 * 
 * @param ticketData - Données du ticket à encoder dans le QR
 * @returns Base64 data URL de l'image QR code
 */
export async function generateTicketQR(
  ticketData: TicketQRData
): Promise<string> {
  try {
    // Créer l'objet JSON à encoder
    const qrContent = JSON.stringify(ticketData)

    // Générer le QR code avec options
    const qrDataURL = await QRCode.toDataURL(qrContent, {
      errorCorrectionLevel: 'H', // Niveau de correction d'erreur élevé (30%)
      width: 300,
      margin: 2,
      color: {
        dark: '#000000', // Noir
        light: '#FFFFFF', // Blanc
      },
    })

    return qrDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Valide un QR code scanné
 * 
 * @param qrDataString - String JSON du QR code scanné
 * @param eventSlug - Slug de l'événement (pour vérification)
 * @returns Résultat de validation avec données du ticket
 */
export async function validateTicketQR(
  qrDataString: string,
  eventSlug?: string
): Promise<TicketValidationResult> {
  try {
    // Parser le JSON du QR code
    let qrData: TicketQRData
    try {
      qrData = JSON.parse(qrDataString)
    } catch (parseError) {
      return {
        valid: false,
        error: 'QR code invalide : format JSON incorrect',
      }
    }

    // Vérifier que toutes les propriétés requises sont présentes
    if (
      !qrData.ticketId ||
      !qrData.eventSlug ||
      !qrData.ticketType ||
      !qrData.buyerEmail
    ) {
      return {
        valid: false,
        error: 'QR code invalide : données manquantes',
      }
    }

    // Vérifier que le QR code correspond au bon événement (si spécifié)
    if (eventSlug && qrData.eventSlug !== eventSlug) {
      return {
        valid: false,
        error: `QR code invalide : billet pour un autre événement (${qrData.eventSlug})`,
      }
    }

    // Récupérer le ticket depuis la base de données
    const supabase = await createSupabaseServerClient()

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('id, buyer_name, buyer_email, ticket_type, quantity, used, used_at, event_id')
      .eq('id', qrData.ticketId)
      .single()

    if (ticketError || !ticket) {
      return {
        valid: false,
        error: 'Billet introuvable dans la base de données',
      }
    }

    // Vérifier que le billet appartient au bon événement
    if (eventSlug) {
      const { data: event } = await supabase
        .from('events')
        .select('id, slug')
        .eq('id', ticket.event_id)
        .single()

      if (!event || event.slug !== eventSlug) {
        return {
          valid: false,
          error: 'Billet invalide : événement incorrect',
        }
      }
    }

    // Vérifier que le billet n'a pas déjà été utilisé
    if (ticket.used) {
      return {
        valid: false,
        ticket: {
          id: ticket.id,
          buyerName: ticket.buyer_name,
          buyerEmail: ticket.buyer_email,
          ticketType: ticket.ticket_type,
          quantity: ticket.quantity,
          used: true,
          usedAt: ticket.used_at,
          eventId: ticket.event_id,
        },
        error: `Billet déjà utilisé le ${ticket.used_at ? new Date(ticket.used_at).toLocaleString('fr-FR') : 'date inconnue'}`,
      }
    }

    // Vérifier que l'email correspond
    if (ticket.buyer_email.toLowerCase() !== qrData.buyerEmail.toLowerCase()) {
      return {
        valid: false,
        error: 'QR code invalide : email ne correspond pas',
      }
    }

    // Tout est valide !
    return {
      valid: true,
      ticket: {
        id: ticket.id,
        buyerName: ticket.buyer_name,
        buyerEmail: ticket.buyer_email,
        ticketType: ticket.ticket_type,
        quantity: ticket.quantity,
        used: false,
        usedAt: null,
        eventId: ticket.event_id,
      },
    }
  } catch (error) {
    console.error('Error validating QR code:', error)
    return {
      valid: false,
      error: `Erreur lors de la validation : ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Marque un ticket comme utilisé
 * 
 * @param ticketId - ID du ticket
 * @param scannedBy - ID de l'admin qui a scanné (optionnel)
 * @returns True si le ticket a été marqué comme utilisé, false s'il était déjà utilisé
 */
export async function markTicketAsUsed(
  ticketId: string,
  scannedBy?: string
): Promise<boolean> {
  try {
    const supabase = await createSupabaseServerClient()

    // Vérifier d'abord si le ticket existe et n'est pas déjà utilisé
    const { data: ticket, error: checkError } = await supabase
      .from('tickets')
      .select('used')
      .eq('id', ticketId)
      .single()

    if (checkError || !ticket) {
      throw new Error('Ticket introuvable')
    }

    if (ticket.used) {
      return false // Déjà utilisé
    }

    // Marquer comme utilisé
    const { error: updateError } = await supabase
      .from('tickets')
      .update({
        used: true,
        used_at: new Date().toISOString(),
        scanned_by: scannedBy || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId)

    if (updateError) {
      throw new Error(`Failed to mark ticket as used: ${updateError.message}`)
    }

    return true
  } catch (error) {
    console.error('Error marking ticket as used:', error)
    throw error
  }
}

/**
 * Génère les données QR pour un ticket
 * 
 * @param ticketId - ID du ticket
 * @param eventSlug - Slug de l'événement
 * @param ticketType - Type de billet
 * @param quantity - Quantité
 * @param buyerEmail - Email de l'acheteur
 * @returns Données structurées pour le QR code
 */
export function buildTicketQRData(
  ticketId: string,
  eventSlug: string,
  ticketType: string,
  quantity: number,
  buyerEmail: string
): TicketQRData {
  return {
    ticketId,
    eventSlug,
    ticketType,
    quantity,
    timestamp: Date.now(),
    buyerEmail,
  }
}

