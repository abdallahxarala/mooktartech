'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { EventWithStats } from '@/types/event'

export interface GetPublicEventsParams {
  search?: string
  location?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export async function getPublicEvents(params: GetPublicEventsParams = {}) {
  const supabase = createSupabaseBrowserClient()
  const {
    search,
    location,
    startDate,
    endDate,
    limit = 12,
    offset = 0
  } = params

  let query = supabase
    .from('events')
    .select(
      `
        *,
        organization:organizations(id, name, slug),
        event_attendees:event_attendees(count),
        event_zones:event_zones(count)
      `,
      { count: 'exact' }
    )
    .eq('status', 'published')
    .order('start_date', { ascending: true })

  if (search) {
    const sanitized = search.replace(/'/g, "''")
    query = query.or(
      `name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`
    )
  }

  if (location) {
    query = query.ilike('location', `%${location}%`)
  }

  if (startDate) {
    query = query.gte('start_date', startDate)
  }

  if (endDate) {
    query = query.lte('end_date', endDate)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error || !data) {
    console.error('Error fetching public events:', error)
    return { events: [] as EventWithStats[], total: 0, error }
  }

  const eventsWithStats: EventWithStats[] = data.map((event: any) => ({
    ...event,
    total_attendees: event.event_attendees?.[0]?.count ?? 0,
    zones_count: event.event_zones?.[0]?.count ?? 0
  }))

  return {
    events: eventsWithStats,
    total: count ?? eventsWithStats.length,
    error: null
  }
}

export async function getEventBySlug(slug: string) {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from('events')
    .select(
      `
        *,
        organization:organizations(id, name, slug),
        event_zones(*),
        event_attendees:event_attendees(count)
      `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    console.error('Error fetching event:', error)
    return { event: null as EventWithStats | null, error }
  }

  const eventWithStats: EventWithStats = {
    ...data,
    total_attendees: data.event_attendees?.[0]?.count ?? 0,
    zones_count: data.event_zones?.length ?? 0
  }

  return { event: eventWithStats, error: null }
}

export async function getPublicEventsCount() {
  const supabase = createSupabaseBrowserClient()

  const { count, error } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  if (error) {
    console.error('Error counting events:', error)
    return { count: 0, error }
  }

  return { count: count ?? 0, error: null }
}

