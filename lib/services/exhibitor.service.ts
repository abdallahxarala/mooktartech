/**
 * Service pour la gestion des exposants
 * Suit les patterns existants du projet
 */

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import QRCode from 'qrcode'

type Exhibitor = Database['public']['Tables']['exhibitors']['Row']
type ExhibitorInsert = Database['public']['Tables']['exhibitors']['Insert']
type ExhibitorUpdate = Database['public']['Tables']['exhibitors']['Update']

export interface CreateExhibitorParams {
  event_id: string
  organization_id: string
  company_name: string
  slug: string
  description?: string
  logo_url?: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  website?: string
  booth_number?: string
  booth_location?: string
  category?: string
  tags?: string[]
}

export interface CreateExhibitorResult {
  exhibitor: Exhibitor | null
  error: string | null
}

export interface UpdateExhibitorParams {
  exhibitor_id: string
  updates: Partial<ExhibitorUpdate>
}

export interface UpdateExhibitorResult {
  exhibitor: Exhibitor | null
  error: string | null
}

/**
 * Générer un QR code pour un exposant
 */
async function generateQRCode(exhibitorId: string, baseUrl: string): Promise<string> {
  try {
    const qrData = `${baseUrl}/exhibitors/${exhibitorId}`
    const qrCodeUrl = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return qrCodeUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    return ''
  }
}

/**
 * Créer un nouvel exposant
 */
export async function createExhibitor(
  params: CreateExhibitorParams
): Promise<CreateExhibitorResult> {
  try {
    const supabase = createSupabaseServerClient()

    // Vérifier que l'utilisateur est authentifié
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return {
        exhibitor: null,
        error: 'Non authentifié',
      }
    }

    // Vérifier que le slug n'existe pas déjà pour cet événement
    const { data: existing } = await supabase
      .from('exhibitors')
      .select('id')
      .eq('event_id', params.event_id)
      .eq('slug', params.slug)
      .single()

    if (existing) {
      return {
        exhibitor: null,
        error: 'Un exposant avec ce slug existe déjà pour cet événement',
      }
    }

    // Générer le QR code
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const qrCodeUrl = await generateQRCode('temp-id', baseUrl)

    // Créer l'exposant
    const insertData: ExhibitorInsert = {
      event_id: params.event_id,
      organization_id: params.organization_id,
      company_name: params.company_name,
      slug: params.slug,
      description: params.description || null,
      logo_url: params.logo_url || null,
      contact_name: params.contact_name,
      contact_email: params.contact_email,
      contact_phone: params.contact_phone || null,
      website: params.website || null,
      booth_number: params.booth_number || null,
      booth_location: params.booth_location || null,
      category: params.category || null,
      tags: params.tags || [],
      status: 'pending',
      payment_status: 'unpaid',
      qr_code_url: qrCodeUrl,
      qr_code_data: JSON.stringify({
        exhibitor_id: 'temp-id',
        event_id: params.event_id,
        company_name: params.company_name,
      }),
    }

    const { data: exhibitor, error } = await supabase
      .from('exhibitors')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error creating exhibitor:', error)
      return {
        exhibitor: null,
        error: error.message,
      }
    }

    // Régénérer le QR code avec le vrai ID
    if (exhibitor) {
      const finalQrCodeUrl = await generateQRCode(exhibitor.id, baseUrl)
      const { error: updateError } = await supabase
        .from('exhibitors')
        .update({
          qr_code_url: finalQrCodeUrl,
          qr_code_data: JSON.stringify({
            exhibitor_id: exhibitor.id,
            event_id: params.event_id,
            company_name: params.company_name,
          }),
        })
        .eq('id', exhibitor.id)

      if (updateError) {
        console.error('Error updating QR code:', updateError)
      }
    }

    return {
      exhibitor: exhibitor || null,
      error: null,
    }
  } catch (error) {
    console.error('Error in createExhibitor:', error)
    return {
      exhibitor: null,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Mettre à jour un exposant
 */
export async function updateExhibitor(
  params: UpdateExhibitorParams
): Promise<UpdateExhibitorResult> {
  try {
    const supabase = createSupabaseServerClient()

    const { data: exhibitor, error } = await supabase
      .from('exhibitors')
      .update({
        ...params.updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.exhibitor_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating exhibitor:', error)
      return {
        exhibitor: null,
        error: error.message,
      }
    }

    return {
      exhibitor: exhibitor || null,
      error: null,
    }
  } catch (error) {
    console.error('Error in updateExhibitor:', error)
    return {
      exhibitor: null,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Récupérer un exposant par ID
 */
export async function getExhibitorById(exhibitorId: string): Promise<{
  exhibitor: Exhibitor | null
  error: string | null
}> {
  try {
    const supabase = createSupabaseServerClient()

    const { data: exhibitor, error } = await supabase
      .from('exhibitors')
      .select('*')
      .eq('id', exhibitorId)
      .single()

    if (error) {
      return {
        exhibitor: null,
        error: error.message,
      }
    }

    return {
      exhibitor: exhibitor || null,
      error: null,
    }
  } catch (error) {
    return {
      exhibitor: null,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Récupérer les exposants d'un événement
 */
export async function getExhibitorsByEvent(eventId: string): Promise<{
  exhibitors: Exhibitor[]
  error: string | null
}> {
  try {
    const supabase = createSupabaseServerClient()

    const { data: exhibitors, error } = await supabase
      .from('exhibitors')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (error) {
      return {
        exhibitors: [],
        error: error.message,
      }
    }

    return {
      exhibitors: exhibitors || [],
      error: null,
    }
  } catch (error) {
    return {
      exhibitors: [],
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

