import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
// Dynamic import to avoid build-time errors with missing env vars
// import { sendExhibitorConfirmationEmail } from '@/lib/services/email/templates'

/**
 * API Endpoint pour approuver un exposant
 * 
 * POST /api/admin/exhibitors/[id]/approve
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServerClient()

    // TODO: Vérifier que l'utilisateur est admin

    // Récupérer l'exposant
    const { data: exhibitor, error: exhibitorError } = await supabase
      .from('exhibitors')
      .select('*, events!inner(slug, name, organization_id, foire_config)')
      .eq('id', params.id)
      .single()

    if (exhibitorError || !exhibitor) {
      return NextResponse.json(
        { error: 'Exhibitor not found' },
        { status: 404 }
      )
    }

    // Mettre à jour le statut d'approbation
    const { error: updateError } = await supabase
      .from('exhibitors')
      .update({
        approval_status: 'approved',
        status: 'approved', // Maintenir pour compatibilité si colonne existe
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (updateError) {
      throw new Error(`Failed to update exhibitor: ${updateError.message}`)
    }

    // Envoyer email de confirmation (en arrière-plan, non bloquant)
    try {
      const event = exhibitor.events as any
      const foireConfig = event?.foire_config || {}
      const pavillons = foireConfig.pavillons || {}
      const pavillon = Object.values(pavillons).find(
        (p: any) => p.code === exhibitor.booth_location
      ) as any

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const invoiceUrl = `${baseUrl}/api/foires/${event.slug}/invoices/${exhibitor.id}`

      // Send confirmation email if RESEND_API_KEY is configured
      if (process.env.RESEND_API_KEY) {
        try {
          const { sendExhibitorConfirmationEmail } = await import('@/lib/services/email/templates')
          await sendExhibitorConfirmationEmail({
            to: exhibitor.contact_email,
            exhibitorName: exhibitor.contact_name,
            companyName: exhibitor.company_name,
            standNumber: exhibitor.booth_number || null,
            pavilionName: pavillon?.nom || exhibitor.booth_location || 'Non assigné',
            surfaceArea: (exhibitor.metadata as any)?.standSize || 0,
            totalPrice: exhibitor.payment_amount || 0,
            invoiceUrl,
          })
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError)
          // Continue even if email fails
        }
      }
    } catch (emailError) {
      console.warn('Failed to send approval email:', emailError)
      // Continue même si l'email échoue
    }

    return NextResponse.json({
      success: true,
      message: 'Exhibitor approved successfully',
    })
  } catch (error) {
    console.error('Error approving exhibitor:', error)
    return NextResponse.json(
      {
        error: 'Failed to approve exhibitor',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

