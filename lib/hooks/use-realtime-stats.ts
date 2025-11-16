/**
 * Hook pour les statistiques en temps réel avec Supabase Realtime
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface FoireStats {
  exhibitors_count: number
  exhibitors_pending: number
  exhibitors_approved: number
  tickets_sold: number
  total_revenue: number
  visitors_present: number
  visitors_checked_in: number
  orders_pending: number
  orders_total: number
}

export interface UseRealtimeStatsOptions {
  eventId: string
  enabled?: boolean
}

export interface UseRealtimeStatsReturn {
  stats: FoireStats | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useRealtimeStats({
  eventId,
  enabled = true,
}: UseRealtimeStatsOptions): UseRealtimeStatsReturn {
  const [stats, setStats] = useState<FoireStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseBrowserClient()

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Récupérer les stats des exposants
      const { data: exhibitors, error: exhibitorsError } = await supabase
        .from('exhibitors')
        .select('id, status')
        .eq('event_id', eventId)

      if (exhibitorsError) throw exhibitorsError

      // Récupérer les stats des visiteurs
      const { data: visitors, error: visitorsError } = await supabase
        .from('event_attendees')
        .select('id, checked_in, check_in_time')
        .eq('event_id', eventId)

      if (visitorsError) throw visitorsError

      // Calculer les stats
      const exhibitorsCount = exhibitors?.length || 0
      const exhibitorsPending = exhibitors?.filter((e) => e.status === 'pending').length || 0
      const exhibitorsApproved = exhibitors?.filter((e) => e.status === 'approved').length || 0
      const ticketsSold = visitors?.length || 0
      const visitorsCheckedIn = visitors?.filter((v) => v.checked_in).length || 0

      // Récupérer les revenus (depuis les tickets payés)
      // TODO: Calculer depuis les paiements réels
      const totalRevenue = 0 // À implémenter avec les paiements

      // Récupérer les commandes
      // TODO: Implémenter avec la table exhibitor_orders
      const ordersPending = 0
      const ordersTotal = 0

      const newStats: FoireStats = {
        exhibitors_count: exhibitorsCount,
        exhibitors_pending: exhibitorsPending,
        exhibitors_approved: exhibitorsApproved,
        tickets_sold: ticketsSold,
        total_revenue: totalRevenue,
        visitors_present: visitorsCheckedIn,
        visitors_checked_in: visitorsCheckedIn,
        orders_pending: ordersPending,
        orders_total: ordersTotal,
      }

      setStats(newStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des stats')
    } finally {
      setIsLoading(false)
    }
  }, [eventId, supabase])

  // Subscription Realtime
  useEffect(() => {
    if (!enabled || !eventId) return

    // Charger les stats initiales
    fetchStats()

    // Créer les channels pour les mises à jour en temps réel
    const exhibitorsChannel = supabase
      .channel(`exhibitors-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exhibitors',
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          fetchStats()
        }
      )
      .subscribe()

    const visitorsChannel = supabase
      .channel(`visitors-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendees',
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          fetchStats()
        }
      )
      .subscribe()

    return () => {
      exhibitorsChannel.unsubscribe()
      visitorsChannel.unsubscribe()
    }
  }, [eventId, enabled, fetchStats, supabase])

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  }
}

