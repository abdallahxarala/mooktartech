import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { PaymentPageClient } from './payment-client'
import type { Database } from '@/lib/supabase/database.types'

type Organization = Database['public']['Tables']['organizations']['Row']

export default async function PaymentPage({
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
      event:events(id, name, slug, organization_id, start_date, location)
    `)
    .eq('id', params.ticketId)
    .single()

  if (!ticket) {
    notFound()
  }
  
  // Vérifier que le ticket appartient à l'organisation
  if (ticket.event.organization_id !== (organization as any).id) {
    notFound()
  }

  // Si déjà payé, rediriger vers confirmation
  if (ticket.payment_status === 'paid') {
    redirect(`/${params.locale}/org/${params.slug}/foires/${params.eventSlug}/tickets/${ticket.id}/confirmation`)
  }

  return (
    <PaymentPageClient
      ticket={ticket}
      locale={params.locale}
      slug={params.slug}
      eventSlug={params.eventSlug}
    />
  )
}

