import { NextRequest, NextResponse } from 'next/server'
import { handleWaveWebhook } from '@/lib/services/payments/wave'

/**
 * Webhook endpoint pour Wave
 * 
 * Reçoit les événements de paiement de Wave et met à jour le statut
 * des exposants dans Supabase.
 * 
 * Documentation Wave: https://developer.wave.com/docs/webhooks
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer le payload et la signature
    const payload = await request.json()
    const signature = request.headers.get('x-wave-signature') || 
                     request.headers.get('wave-signature') || 
                     ''

    console.log('📥 Webhook Wave reçu:', {
      type: payload.type || payload.event_type,
      checkout_id: payload.checkout_id || payload.id,
      signature_present: !!signature,
    })

    // Traiter le webhook
    await handleWaveWebhook(payload, signature)

    // Répondre avec succès
    return NextResponse.json(
      { received: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Erreur traitement webhook Wave:', error)

    // Logger l'erreur mais répondre 200 pour éviter les retries excessifs
    return NextResponse.json(
      { 
        received: true,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 200 }
    )
  }
}

/**
 * Endpoint GET pour vérifier que le webhook est accessible
 */
export async function GET() {
  return NextResponse.json({
    service: 'Wave Webhook',
    status: 'active',
    timestamp: new Date().toISOString(),
  })
}
