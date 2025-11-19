import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * API Endpoint pour rejeter un exposant
 * 
 * POST /api/admin/exhibitors/[id]/reject
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServerClient()

    // TODO: Vérifier que l'utilisateur est admin

    const body = await request.json()
    const { reason } = body

    // Récupérer l'exposant
    const { data: exhibitor, error: exhibitorError } = await supabase
      .from('exhibitors')
      .select('*')
      .eq('id', params.id)
      .single()

    if (exhibitorError || !exhibitor) {
      return NextResponse.json(
        { error: 'Exhibitor not found' },
        { status: 404 }
      )
    }

    // Mettre à jour le statut
    const { error: updateError } = await supabase
      .from('exhibitors')
      .update({
        status: 'rejected',
        metadata: {
          ...(exhibitor.metadata || {}),
          rejection_reason: reason || null,
          rejected_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (updateError) {
      throw new Error(`Failed to update exhibitor: ${updateError.message}`)
    }

    // TODO: Envoyer email de rejet (optionnel)

    return NextResponse.json({
      success: true,
      message: 'Exhibitor rejected successfully',
    })
  } catch (error) {
    console.error('Error rejecting exhibitor:', error)
    return NextResponse.json(
      {
        error: 'Failed to reject exhibitor',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

