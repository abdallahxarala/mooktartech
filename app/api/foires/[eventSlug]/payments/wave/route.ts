import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createWavePayment as createWavePaymentService, type WavePaymentRequest } from '@/lib/services/payments/wave'

/**
 * Endpoint API pour créer un paiement Wave
 * 
 * POST /api/foires/[eventSlug]/payments/wave
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { eventSlug: string } }
) {
  try {
    const body = await request.json() as WavePaymentRequest

    // Valider les données
    if (!body.amount || !body.currency || !body.success_url || !body.error_url) {
      return NextResponse.json(
        { error: 'Données de paiement incomplètes' },
        { status: 400 }
      )
    }

    // Créer le paiement Wave
    const payment = await createWavePaymentService(body)

    return NextResponse.json(payment, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la création du paiement Wave:', error)
    return NextResponse.json(
      {
        error: 'Échec de la création du paiement',
        message: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
}

