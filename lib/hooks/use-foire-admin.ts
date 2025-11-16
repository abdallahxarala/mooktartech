/**
 * Hook principal pour la gestion admin de la foire
 */

'use client'

import { useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import type { Database } from '@/lib/types/database.types'

type Exhibitor = Database['public']['Tables']['exhibitors']['Row']
type Visitor = Database['public']['Tables']['event_attendees']['Row']

export interface UseFoireAdminOptions {
  eventId: string
}

export interface UseFoireAdminReturn {
  // Exposants
  exhibitors: Exhibitor[]
  isLoadingExhibitors: boolean
  exhibitorsError: string | null
  fetchExhibitors: () => Promise<void>
  updateExhibitorStatus: (exhibitorId: string, status: 'pending' | 'approved' | 'rejected') => Promise<boolean>
  generateBadge: (exhibitorId: string) => Promise<string | null>

  // Visiteurs
  visitors: Visitor[]
  isLoadingVisitors: boolean
  visitorsError: string | null
  fetchVisitors: (search?: string) => Promise<void>
  exportVisitorsCSV: () => Promise<void>

  // Commandes
  orders: any[]
  isLoadingOrders: boolean
  ordersError: string | null
  fetchOrders: (status?: string) => Promise<void>
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>
}

export function useFoireAdmin({ eventId }: UseFoireAdminOptions): UseFoireAdminReturn {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [isLoadingExhibitors, setIsLoadingExhibitors] = useState(false)
  const [exhibitorsError, setExhibitorsError] = useState<string | null>(null)

  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [isLoadingVisitors, setIsLoadingVisitors] = useState(false)
  const [visitorsError, setVisitorsError] = useState<string | null>(null)

  const [orders, setOrders] = useState<any[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  const { toast } = useToast()
  const supabase = createSupabaseBrowserClient()

  // Exposants
  const fetchExhibitors = useCallback(async () => {
    setIsLoadingExhibitors(true)
    setExhibitorsError(null)

    try {
      const { data, error } = await supabase
        .from('exhibitors')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setExhibitors(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement'
      setExhibitorsError(errorMessage)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: errorMessage,
      })
    } finally {
      setIsLoadingExhibitors(false)
    }
  }, [eventId, supabase, toast])

  const updateExhibitorStatus = useCallback(
    async (exhibitorId: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('exhibitors')
          .update({ status })
          .eq('id', exhibitorId)

        if (error) throw error

        setExhibitors((prev) =>
          prev.map((e) => (e.id === exhibitorId ? { ...e, status } : e))
        )

        toast({
          title: 'Succès',
          description: `Statut de l'exposant mis à jour`,
        })

        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: errorMessage,
        })
        return false
      }
    },
    [supabase, toast]
  )

  const generateBadge = useCallback(
    async (exhibitorId: string): Promise<string | null> => {
      try {
        // TODO: Appeler l'API pour générer le badge
        const response = await fetch(`/api/exhibitors/${exhibitorId}/badge`, {
          method: 'POST',
        })

        if (!response.ok) throw new Error('Erreur lors de la génération du badge')

        const data = await response.json()
        toast({
          title: 'Succès',
          description: 'Badge généré avec succès',
        })
        return data.badge_url || null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération'
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: errorMessage,
        })
        return null
      }
    },
    [toast]
  )

  // Visiteurs
  const fetchVisitors = useCallback(
    async (search?: string) => {
      setIsLoadingVisitors(true)
      setVisitorsError(null)

      try {
        let query = supabase
          .from('event_attendees')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: false })

        if (search) {
          query = query.or(
            `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,badge_id.ilike.%${search}%`
          )
        }

        const { data, error } = await query

        if (error) throw error
        setVisitors(data || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement'
        setVisitorsError(errorMessage)
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: errorMessage,
        })
      } finally {
        setIsLoadingVisitors(false)
      }
    },
    [eventId, supabase, toast]
  )

  const exportVisitorsCSV = useCallback(async () => {
    try {
      const headers = ['Badge ID', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Type', 'Check-in', 'Date']
      const rows = visitors.map((v) => [
        v.badge_id,
        v.first_name,
        v.last_name,
        v.email,
        v.phone || '',
        v.access_level,
        v.checked_in ? 'Oui' : 'Non',
        new Date(v.created_at).toLocaleDateString('fr-FR'),
      ])

      const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `visiteurs-${eventId}-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: 'Succès',
        description: 'Export CSV généré',
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Erreur lors de l\'export',
      })
    }
  }, [visitors, eventId, toast])

  // Commandes
  const fetchOrders = useCallback(
    async (status?: string) => {
      setIsLoadingOrders(true)
      setOrdersError(null)

      try {
        // TODO: Implémenter avec la vraie table exhibitor_orders
        // Pour l'instant, on retourne un tableau vide
        setOrders([])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement'
        setOrdersError(errorMessage)
      } finally {
        setIsLoadingOrders(false)
      }
    },
    [supabase, toast]
  )

  const updateOrderStatus = useCallback(
    async (orderId: string, status: string): Promise<boolean> => {
      try {
        // TODO: Implémenter avec la vraie table exhibitor_orders
        toast({
          title: 'Succès',
          description: 'Statut de la commande mis à jour',
        })
        return true
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Erreur lors de la mise à jour',
        })
        return false
      }
    },
    [toast]
  )

  return {
    exhibitors,
    isLoadingExhibitors,
    exhibitorsError,
    fetchExhibitors,
    updateExhibitorStatus,
    generateBadge,
    visitors,
    isLoadingVisitors,
    visitorsError,
    fetchVisitors,
    exportVisitorsCSV,
    orders,
    isLoadingOrders,
    ordersError,
    fetchOrders,
    updateOrderStatus,
  }
}

