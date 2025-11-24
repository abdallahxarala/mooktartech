/**
 * Page d'achat de tickets visiteur
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { requireOrganization } from '@/middleware/orgContext'
import { TicketsClient } from './tickets-client'
import type { Database } from '@/lib/types/database.types'

interface TicketsPageProps {
  params: {
    slug: string
  }
  searchParams: {
    success?: string
    payment_id?: string
    badge_id?: string
  }
}

export const dynamic = 'force-dynamic'

export default async function TicketsPage({ params, searchParams }: TicketsPageProps) {
  const context = await requireOrganization(params.slug)

  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // Récupérer la foire de l'organisation
  const { data: foire } = await supabase
    .from('events')
    .select('*')
    .eq('organization_id', (context.organization as any).id)
    .eq('event_type', 'foire')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!foire) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24 pt-24">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Aucune foire trouvée
            </h2>
            <p className="text-red-700">
              Aucune foire n'est disponible pour cette organisation.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Si succès, récupérer le ticket
  let ticket = null
  if (searchParams.success === 'true' && searchParams.badge_id) {
    const { data: visitor } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('badge_id', searchParams.badge_id)
      .single()

    if (visitor) {
      const metadata = visitor.metadata as any || {}
      ticket = {
        id: metadata.ticket_id || visitor.id,
        badge_id: visitor.badge_id,
        event_id: visitor.event_id,
        ticket_type: metadata.ticket_type || 'standard',
        visitor_info: {
          first_name: visitor.first_name,
          last_name: visitor.last_name,
          phone: visitor.phone || '',
          email: visitor.email,
        },
        amount: 0, // À récupérer depuis metadata
        currency: 'XOF',
        payment_status: metadata.payment_status === 'paid' ? 'paid' : 'pending',
        qr_code_data: metadata.qr_code_data || '',
        qr_code_url: metadata.qr_code_url || '',
        sms_sent: metadata.sms_sent || false,
        created_at: visitor.created_at,
        updated_at: visitor.updated_at,
      }
    }
  }

  return (
    <TicketsClient
      organizationSlug={params.slug}
      eventId={foire.id}
      eventName={foire.name}
      ticket={ticket}
    />
  )
}

