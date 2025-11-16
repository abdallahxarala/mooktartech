/**
 * Page de succès après paiement Wave
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { TicketConfirmation } from '@/components/ticket-purchase/ticket-confirmation'
import type { Database } from '@/lib/types/database.types'
import { getVisitorByBadgeId } from '@/lib/services/visitor.service'
import { generateTicketQR } from '@/lib/services/qr.service'

interface SuccessPageProps {
  params: {
    slug: string
  }
  searchParams: {
    payment_id?: string
    badge_id?: string
    status?: string
  }
}

export const dynamic = 'force-dynamic'

export default async function TicketSuccessPage({ params, searchParams }: SuccessPageProps) {
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

  if (!searchParams.badge_id) {
    redirect(`/org/${params.slug}/foires/tickets`)
  }

  // Récupérer le visiteur
  const { visitor, error } = await getVisitorByBadgeId(searchParams.badge_id)

  if (error || !visitor) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24 pt-24">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-2">Ticket introuvable</h2>
            <p className="text-red-700">
              Le ticket avec le badge {searchParams.badge_id} n'a pas été trouvé.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const metadata = visitor.metadata as any || {}

  // Générer le QR code si pas déjà fait
  let qrCodeUrl = metadata.qr_code_url
  if (!qrCodeUrl) {
    try {
      const qrResult = await generateTicketQR({
        ticketId: metadata.ticket_id || visitor.id,
        badgeId: visitor.badge_id,
        eventId: visitor.event_id,
        ticketType: metadata.ticket_type || 'standard',
        visitorName: `${visitor.first_name} ${visitor.last_name}`,
      })
      qrCodeUrl = qrResult.qrCodeUrl

      // Sauvegarder dans metadata
      await supabase
        .from('event_attendees')
        .update({
          metadata: {
            ...metadata,
            qr_code_url: qrCodeUrl,
            qr_code_data: qrResult.qrCodeData,
          },
        })
        .eq('id', visitor.id)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const ticket = {
    id: metadata.ticket_id || visitor.id,
    badge_id: visitor.badge_id,
    event_id: visitor.event_id,
    ticket_type: (metadata.ticket_type || 'standard') as 'standard' | 'vip',
    visitor_info: {
      first_name: visitor.first_name,
      last_name: visitor.last_name,
      phone: visitor.phone || '',
      email: visitor.email,
    },
    amount: metadata.amount || 0,
    currency: metadata.currency || 'XOF',
    payment_status: metadata.payment_status === 'paid' ? 'paid' : 'pending',
    payment_method: 'wave' as const,
    payment_id: searchParams.payment_id || metadata.payment_id,
    qr_code_data: metadata.qr_code_data || '',
    qr_code_url: qrCodeUrl || '',
    sms_sent: metadata.sms_sent || false,
    created_at: visitor.created_at,
    updated_at: visitor.updated_at,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 pb-24 pt-24">
      <div className="container mx-auto max-w-4xl px-6">
        <TicketConfirmation ticket={ticket} />
      </div>
    </div>
  )
}

