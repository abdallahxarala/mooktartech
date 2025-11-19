import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getEventStats } from '@/lib/services/admin/stats.service'

/**
 * API Endpoint pour récupérer les statistiques d'un événement
 * 
 * GET /api/foires/[eventSlug]/stats
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { eventSlug: string } }
) {
  try {
    const supabase = await createSupabaseServerClient()

    // Récupérer l'événement par slug
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('slug', params.eventSlug)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Récupérer les statistiques
    const stats = await getEventStats(event.id)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching event stats:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

