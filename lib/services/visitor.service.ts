/**
 * Service pour la gestion des visiteurs et tickets
 */

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import ShortUniqueId from 'short-unique-id'
import type { VisitorInfo, TicketType, TicketPurchase } from '@/lib/types/ticket'

const uid = new ShortUniqueId({ length: 10 })

type EventAttendee = Database['public']['Tables']['event_attendees']['Row']
type EventAttendeeInsert = Database['public']['Tables']['event_attendees']['Insert']

export interface CreateVisitorParams {
  event_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  ticket_type: TicketType
  payment_id?: string
}

export interface CreateVisitorResult {
  visitor: EventAttendee | null
  error: string | null
}

/**
 * Créer un visiteur (event_attendee) avec ticket
 */
export async function createVisitor(
  params: CreateVisitorParams
): Promise<CreateVisitorResult> {
  try {
    const supabase = createSupabaseServerClient()

    // Générer un badge_id unique
    const badgeId = `TKT-${uid.rnd().toUpperCase()}`

    // Déterminer l'access_level selon le ticket_type
    const accessLevel =
      params.ticket_type === 'vip' ? 'vip' : 'attendee'

    const insertData: EventAttendeeInsert = {
      event_id: params.event_id,
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      phone: params.phone,
      badge_id: badgeId,
      access_level: accessLevel as any,
      checked_in: false,
      metadata: {
        ticket_type: params.ticket_type,
        payment_id: params.payment_id || null,
        purchased_at: new Date().toISOString(),
      },
    }

    const { data: visitor, error } = await supabase
      .from('event_attendees')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error creating visitor:', error)
      return {
        visitor: null,
        error: error.message,
      }
    }

    return {
      visitor: visitor || null,
      error: null,
    }
  } catch (error) {
    console.error('Error in createVisitor:', error)
    return {
      visitor: null,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Récupérer un visiteur par badge_id
 */
export async function getVisitorByBadgeId(badgeId: string): Promise<{
  visitor: EventAttendee | null
  error: string | null
}> {
  try {
    const supabase = createSupabaseServerClient()

    const { data: visitor, error } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('badge_id', badgeId)
      .single()

    if (error) {
      return {
        visitor: null,
        error: error.message,
      }
    }

    return {
      visitor: visitor || null,
      error: null,
    }
  } catch (error) {
    return {
      visitor: null,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Mettre à jour le statut de paiement d'un visiteur
 */
export async function updateVisitorPaymentStatus(
  badgeId: string,
  paymentId: string,
  paymentStatus: 'paid' | 'failed'
): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const supabase = createSupabaseServerClient()

    const { data: visitor } = await supabase
      .from('event_attendees')
      .select('metadata')
      .eq('badge_id', badgeId)
      .single()

    if (!visitor) {
      return {
        success: false,
        error: 'Visiteur non trouvé',
      }
    }

    const metadata = visitor.metadata as any || {}
    metadata.payment_id = paymentId
    metadata.payment_status = paymentStatus
    metadata.payment_confirmed_at = new Date().toISOString()

    const { error } = await supabase
      .from('event_attendees')
      .update({
        metadata,
        updated_at: new Date().toISOString(),
      })
      .eq('badge_id', badgeId)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

