import { NextRequest, NextResponse } from 'next/server'
import { exportExhibitorsReport } from '@/lib/services/exports/reports'

/**
 * API Endpoint pour exporter les exposants en Excel
 * 
 * GET /api/admin/exhibitors/export?eventId=...
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required' },
        { status: 400 }
      )
    }

    // TODO: Vérifier que l'utilisateur est admin

    const blob = await exportExhibitorsReport(eventId)

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="exposants-${eventId}-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error('Error exporting exhibitors:', error)
    return NextResponse.json(
      {
        error: 'Failed to export exhibitors',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

