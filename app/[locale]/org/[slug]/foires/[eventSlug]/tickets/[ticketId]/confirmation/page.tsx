import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ConfirmationClient } from './confirmation-client'

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
  const { data: organization } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', params.slug)
    .single()

  if (!organization) {
    notFound()
  }

  // Récupérer le ticket avec l'événement
  const { data: ticket } = await supabase
    .from('tickets')
    .select(`
      *,
      event:events(*)
    `)
    .eq('id', params.ticketId)
    .eq('organization_id', organization.id) // ✅ Isolation multitenant
    .single()

  if (!ticket) {
    console.error('Ticket not found:', params.ticketId)
    notFound()
  }

  // Vérifier que le ticket appartient à l'organisation (double vérification)
  if (ticket.organization_id !== organization.id || ticket.event.organization_id !== organization.id) {
    console.error('Ticket organization mismatch:', {
      ticket_org_id: ticket.organization_id,
      event_org_id: ticket.event.organization_id,
      expected_org_id: organization.id
    })
    notFound()
  }

  // Si pas encore payé, rediriger vers paiement (ou notFound pour sécurité)
  if (ticket.payment_status !== 'paid') {
    console.warn('Ticket not paid yet:', {
      ticket_id: ticket.id,
      payment_status: ticket.payment_status
    })
    notFound()
  }

  // Générer QR code si pas déjà fait
  if (!ticket.qr_code) {
    const qrCodeData = `FOIRE2025-${ticket.id}-${params.eventSlug}`
    
    // Mettre à jour avec QR code
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ 
        qr_code: qrCodeData,
        qr_code_data: {
          ticket_id: ticket.id,
          event_slug: params.eventSlug,
          ticket_type: ticket.ticket_type,
          buyer_email: ticket.buyer_email,
          quantity: ticket.quantity,
        }
      })
      .eq('id', ticket.id)
    
    if (updateError) {
      console.error('Error updating QR code:', updateError)
    } else {
      ticket.qr_code = qrCodeData
    }
  }

  return (
    <ConfirmationClient
      ticket={ticket}
      locale={params.locale}
      slug={params.slug}
    />
  )
}

