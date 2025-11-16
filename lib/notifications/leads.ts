import { Resend } from 'resend'
import { requireEnv } from '@/lib/payments/env'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

const resendClient =
  process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== ''
    ? new Resend(process.env.RESEND_API_KEY)
    : null

function getServiceClient() {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}

export interface LeadPayload {
  id: string
  organization_id: string
  card_id: string | null
  captured_by: string | null
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  notes?: string | null
  source?: string | null
  created_at: string
}

export async function notifyLeadAdmins(lead: LeadPayload) {
  if (!resendClient) {
    console.warn('[Leads] RESEND_API_KEY missing – skipping email notification')
    return
  }

  const supabase = getServiceClient()

  const { data: members } = await supabase
    .from('organization_members')
    .select(
      `
        role,
        user:users (
          email,
          full_name
        )
      `
    )
    .eq('organization_id', lead.organization_id)
    .in('role', ['owner', 'admin'])

  const recipients =
    members
      ?.map((member) => member.user?.email)
      .filter(Boolean) ?? []

  if (recipients.length === 0) {
    console.warn('[Leads] No admin/owner emails to notify')
    return
  }

  const formatted = `
Nouvelle piste capturée !

Nom : ${lead.name}
Email : ${lead.email ?? 'N/A'}
Téléphone : ${lead.phone ?? 'N/A'}
Entreprise : ${lead.company ?? 'N/A'}
Notes : ${lead.notes ?? '—'}
Source : ${lead.source ?? 'nfc_scan'}
Date : ${new Date(lead.created_at).toLocaleString('fr-FR')}
`

  await resendClient.emails.send({
    from: 'Xarala CRM <notifications@mail.xarala.sn>',
    to: recipients,
    subject: `Nouveau lead capturé : ${lead.name}`,
    text: formatted
  })
}

