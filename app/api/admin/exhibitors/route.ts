import { NextRequest, NextResponse } from 'next/server'
import { getExhibitorsList } from '@/lib/services/admin/stats.service'

/**
 * API Endpoint pour récupérer la liste des exposants avec filtres
 * 
 * GET /api/admin/exhibitors?eventId=...&page=...&limit=...&...
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('eventId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const pavillon = searchParams.get('pavillon') || undefined
    const payment_status = searchParams.get('payment_status') || undefined
    const approval_status = searchParams.get('approval_status') || undefined
    const status = searchParams.get('status') || undefined // Maintenir pour compatibilité
    const search = searchParams.get('search') || undefined
    const sortBy = (searchParams.get('sortBy') || 'created_at') as 'created_at' | 'company_name' | 'payment_amount'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required' },
        { status: 400 }
      )
    }

    const result = await getExhibitorsList(eventId, {
      pavillon,
      payment_status,
      approval_status: approval_status || status, // Utiliser approval_status si fourni, sinon status pour compatibilité
      status, // Maintenir pour compatibilité
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching exhibitors:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch exhibitors',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

