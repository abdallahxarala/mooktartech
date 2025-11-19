import { NextRequest, NextResponse } from 'next/server'
import { validateTicketQR, markTicketAsUsed } from '@/lib/services/tickets/qr-generator'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * API Endpoint pour valider un QR code de billet
 * 
 * POST /api/tickets/validate
 * Body: { qrData: string, eventSlug?: string, markAsUsed?: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrData, eventSlug, markAsUsed = false } = body

    if (!qrData) {
      return NextResponse.json(
        { error: 'qrData is required' },
        { status: 400 }
      )
    }

    // Valider le QR code
    const validationResult = await validateTicketQR(qrData, eventSlug)

    if (!validationResult.valid) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: validationResult.error,
        ticket: validationResult.ticket || null,
      })
    }

    // Si demandé, marquer le billet comme utilisé
    let markedAsUsed = false
    if (markAsUsed && validationResult.ticket) {
      // Récupérer l'ID de l'utilisateur actuel (admin qui scanne)
      const supabase = await createSupabaseServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      markedAsUsed = await markTicketAsUsed(
        validationResult.ticket.id,
        user?.id || undefined
      )
    }

    return NextResponse.json({
      success: true,
      valid: true,
      ticket: validationResult.ticket,
      markedAsUsed,
      message: markedAsUsed
        ? 'Billet validé et marqué comme utilisé'
        : 'Billet valide (non marqué comme utilisé)',
    })
  } catch (error) {
    console.error('Error validating ticket:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to validate ticket',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET : Endpoint de test pour validation manuelle
 * 
 * GET /api/tickets/validate?qrData=...
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const qrData = searchParams.get('qrData')
  const eventSlug = searchParams.get('eventSlug')
  const markAsUsed = searchParams.get('markAsUsed') === 'true'

  if (!qrData) {
    return NextResponse.json(
      { error: 'qrData query parameter is required' },
      { status: 400 }
    )
  }

  try {
    const validationResult = await validateTicketQR(qrData, eventSlug || undefined)

    if (!validationResult.valid) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: validationResult.error,
        ticket: validationResult.ticket || null,
      })
    }

    let markedAsUsed = false
    if (markAsUsed && validationResult.ticket) {
      const supabase = await createSupabaseServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      markedAsUsed = await markTicketAsUsed(
        validationResult.ticket.id,
        user?.id || undefined
      )
    }

    return NextResponse.json({
      success: true,
      valid: true,
      ticket: validationResult.ticket,
      markedAsUsed,
      message: markedAsUsed
        ? 'Billet validé et marqué comme utilisé'
        : 'Billet valide (non marqué comme utilisé)',
    })
  } catch (error) {
    console.error('Error validating ticket:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to validate ticket',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

