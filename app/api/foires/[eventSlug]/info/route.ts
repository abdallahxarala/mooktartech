import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * API Endpoint pour récupérer les infos basiques d'un événement
 * 
 * GET /api/foires/[eventSlug]/info
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { eventSlug: string } }
) {
  try {
    const supabase = await createSupabaseServerClient()

    const { data: event, error } = await supabase
      .from('events')
      .select('id, name, slug, organization_id')
      .eq('slug', params.eventSlug)
      .single()

    if (error || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const eventData = event as any;
    return NextResponse.json(eventData)
  } catch (error) {
    console.error('Error fetching event info:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch event info',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

