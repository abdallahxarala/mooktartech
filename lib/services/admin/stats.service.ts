/**
 * Service de statistiques pour le dashboard admin
 * Foire Internationale de Dakar 2025
 */

import { createSupabaseServerClient } from '@/lib/supabase/server'

export interface EventStats {
  exhibitors_count: number
  total_surface: number // m²
  occupancy_rate: number // %
  total_revenue: number // FCFA
  tickets_sold: number
  daily_registrations: Array<{
    date: string
    count: number
  }>
  pavilions_distribution: Array<{
    pavillon: string
    count: number
    surface: number
  }>
  payment_status_breakdown: {
    pending: number
    completed: number
    failed: number
    unpaid: number
  }
  recent_exhibitors: Array<{
    id: string
    company_name: string
    contact_name: string
    contact_email: string
    booth_location: string | null
    payment_amount: number | null
    payment_status: string | null
    status: string | null
    created_at: string
  }>
}

/**
 * Récupère toutes les statistiques d'un événement
 * 
 * @param eventId - ID de l'événement
 * @returns Statistiques complètes de l'événement
 */
export async function getEventStats(eventId: string): Promise<EventStats> {
  const supabase = await createSupabaseServerClient()

  try {
    // 1. Récupérer l'événement pour obtenir la config
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, foire_config')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      throw new Error(`Event not found: ${eventId}`)
    }

    const foireConfig = event.foire_config || {}
    const superficieTotale = foireConfig.superficie_totale || 0

    // 2. Statistiques exposants (une seule requête optimisée)
    const { data: exhibitors, error: exhibitorsError } = await supabase
      .from('exhibitors')
      .select('id, company_name, contact_name, contact_email, booth_location, payment_amount, payment_status, status, metadata, created_at')
      .eq('event_id', eventId)

    if (exhibitorsError) {
      console.error('Error fetching exhibitors:', exhibitorsError)
      throw new Error(`Failed to fetch exhibitors: ${exhibitorsError.message}`)
    }

    const exhibitorsData = exhibitors || []

    // 3. Calculer statistiques exposants
    const exhibitors_count = exhibitorsData.length
    const total_surface = exhibitorsData.reduce((sum, ex) => {
      const metadata = ex.metadata || {}
      const standSize = metadata.standSize || metadata.stand_size || 0
      return sum + Number(standSize)
    }, 0)
    const occupancy_rate = superficieTotale > 0 
      ? Math.round((total_surface / superficieTotale) * 100) 
      : 0
    const total_revenue = exhibitorsData.reduce((sum, ex) => {
      return sum + (Number(ex.payment_amount) || 0)
    }, 0)

    // 4. Répartition par statut paiement
    const payment_status_breakdown = {
      // Note: 'pending' n'est pas une valeur autorisée pour exhibitors.payment_status
      // Utiliser 'unpaid' à la place
      pending: 0, // Déprécié - utiliser 'unpaid' à la place
      completed: exhibitorsData.filter((e) => e.payment_status === 'paid').length,
      failed: exhibitorsData.filter((e) => e.payment_status === 'failed').length,
      unpaid: exhibitorsData.filter((e) => !e.payment_status || e.payment_status === 'unpaid').length,
    }

    // 5. Répartition par pavillon
    const pavilionsMap = new Map<string, { count: number; surface: number }>()
    exhibitorsData.forEach((ex) => {
      const pavillon = ex.booth_location || 'Non assigné'
      const metadata = ex.metadata || {}
      const standSize = metadata.standSize || metadata.stand_size || 0

      const current = pavilionsMap.get(pavillon) || { count: 0, surface: 0 }
      pavilionsMap.set(pavillon, {
        count: current.count + 1,
        surface: current.surface + Number(standSize),
      })
    })

    const pavilions_distribution = Array.from(pavilionsMap.entries()).map(([pavillon, data]) => ({
      pavillon,
      count: data.count,
      surface: data.surface,
    }))

    // 6. Inscriptions par jour (30 derniers jours)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyMap = new Map<string, number>()
    exhibitorsData
      .filter((ex) => new Date(ex.created_at) >= thirtyDaysAgo)
      .forEach((ex) => {
        const date = new Date(ex.created_at).toISOString().split('T')[0]
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
      })

    // Remplir les jours manquants avec 0
    const daily_registrations: Array<{ date: string; count: number }> = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      daily_registrations.push({
        date: dateStr,
        count: dailyMap.get(dateStr) || 0,
      })
    }

    // 7. Billets vendus
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('id, quantity')
      .eq('event_id', eventId)
      .eq('payment_status', 'completed')

    const tickets_sold = tickets?.reduce((sum, t) => sum + (t.quantity || 0), 0) || 0

    // 8. Exposants récents (10 derniers)
    const recent_exhibitors = exhibitorsData
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map((ex) => ({
        id: ex.id,
        company_name: ex.company_name || '',
        contact_name: ex.contact_name || '',
        contact_email: ex.contact_email || '',
        booth_location: ex.booth_location,
        payment_amount: ex.payment_amount ? Number(ex.payment_amount) : null,
        payment_status: ex.payment_status,
        status: ex.status,
        created_at: ex.created_at,
      }))

    return {
      exhibitors_count,
      total_surface,
      occupancy_rate,
      total_revenue,
      tickets_sold,
      daily_registrations,
      pavilions_distribution,
      payment_status_breakdown,
      recent_exhibitors,
    }
  } catch (error) {
    console.error('Error getting event stats:', error)
    throw error
  }
}

/**
 * Récupère la liste complète des exposants avec filtres
 * 
 * @param eventId - ID de l'événement
 * @param filters - Filtres optionnels
 * @returns Liste des exposants
 */
export async function getExhibitorsList(
  eventId: string,
  filters?: {
    pavillon?: string
    payment_status?: string
    status?: string
    search?: string
    page?: number
    limit?: number
    sortBy?: 'created_at' | 'company_name' | 'payment_amount'
    sortOrder?: 'asc' | 'desc'
  }
) {
  const supabase = await createSupabaseServerClient()

  const page = filters?.page || 1
  const limit = filters?.limit || 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('exhibitors')
    .select('*', { count: 'exact' })
    .eq('event_id', eventId)

  // Appliquer filtres
  if (filters?.pavillon) {
    query = query.eq('booth_location', filters.pavillon)
  }

  if (filters?.payment_status) {
    query = query.eq('payment_status', filters.payment_status)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.search) {
    query = query.or(
      `company_name.ilike.%${filters.search}%,contact_name.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%`
    )
  }

  // Tri
  const sortBy = filters?.sortBy || 'created_at'
  const sortOrder = filters?.sortOrder || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to fetch exhibitors: ${error.message}`)
  }

  return {
    exhibitors: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

