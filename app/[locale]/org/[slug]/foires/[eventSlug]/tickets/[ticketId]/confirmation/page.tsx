import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ConfirmationClient } from './confirmation-client'
import type { Database } from '@/lib/supabase/database.types'

type Organization = Database['public']['Tables']['organizations']['Row']

export default async function ConfirmationPage({
  params,
}: {
  params: { 
    locale: string
    slug: string
    eventSlug: string
    ticketId: string
  }
}) {
  const supabase = await createSupabaseServerClient()
  
  // Récupérer l'organization
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', params.slug)
    .single<Organization>()

  if (orgError || !organization) {
    notFound()
  }

  // TypeScript now knows organization is of type Organization after the check above

  // Récupérer le ticket avec l'événement
  const { data: ticket } = await supabase
    .from('tickets')
    .select(`
      *,
      event:events(*)
    `)
    .eq('id', params.ticketId)
    .eq('organization_id', (organization as any).id) // ✅ Isolation multitenant
    .single()

  if (!ticket) {
    console.error('Ticket not found:', params.ticketId)
    notFound()
  }

  // TypeScript assertion - ticket existe après la vérification ci-dessus
  const ticketData = ticket as any

  // Vérifier que le ticket appartient à l'organisation (double vérification)
  if (ticketData.organization_id !== (organization as any).id || ticketData.event.organization_id !== (organization as any).id) {
    console.error('Ticket organization mismatch:', {
      ticket_org_id: ticketData.organization_id,
      event_org_id: ticketData.event.organization_id,
      expected_org_id: (organization as any).id
    })
    notFound()
  }

  // Si pas encore payé, rediriger vers paiement (ou notFound pour sécurité)
  if (ticketData.payment_status !== 'paid') {
    console.warn('Ticket not paid yet:', {
      ticket_id: ticketData.id,
      payment_status: ticketData.payment_status
    })
    notFound()
  }

  // Générer QR code si pas déjà fait
  if (!ticketData.qr_code) {
    const qrCodeData = `FOIRE2025-${ticketData.id}-${params.eventSlug}`
    
    // Mettre à jour avec QR code
    const { error: updateError } = await (supabase
      .from('tickets') as any)
      .update({
        qr_code: qrCodeData,
        qr_code_data: {
          ticket_id: ticketData.id,
          event_slug: params.eventSlug,
          ticket_type: ticketData.ticket_type,
          buyer_email: ticketData.buyer_email,
          quantity: ticketData.quantity,
        }
      })
      .eq('id', ticketData.id)
    
    if (updateError) {
      console.error('Error updating QR code:', updateError)
    } else {
      ticketData.qr_code = qrCodeData
    }
  }

  return (
    <ConfirmationClient
      ticket={ticketData}
      locale={params.locale}
      slug={params.slug}
    />
  )
}

