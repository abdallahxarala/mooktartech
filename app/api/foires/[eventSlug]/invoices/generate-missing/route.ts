import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { generateMissingInvoices } from '@/lib/services/invoice-automation.service'

/**
 * Endpoint pour générer les factures manquantes
 * 
 * POST /api/foires/[eventSlug]/invoices/generate-missing
 * 
 * Génère automatiquement les factures PDF pour tous les exposants
 * avec paiement confirmé mais sans facture générée.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { eventSlug: string } }
) {
  try {
    const supabase = await createSupabaseServerClient()

    // 1. Récupérer l'événement
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

    const eventData = event as any;

    // 2. Générer les factures manquantes
    const result = await generateMissingInvoices(eventData.id)

    return NextResponse.json({
      success: true,
      eventId: eventData.id,
      eventSlug: params.eventSlug,
      ...result,
      message: `${result.generated} factures générées, ${result.errors} erreurs`,
    })
  } catch (error) {
    console.error('Error generating missing invoices:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate missing invoices',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

