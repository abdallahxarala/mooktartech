import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database.types'
import { requireOrganization, listUserOrganizations } from '@/middleware/orgContext'
import { OrgSwitcher } from '@/components/org/OrgSwitcher'
import { LeadsStats } from '@/components/crm/LeadsStats'
import { LeadsTable, LeadRow } from '@/components/crm/LeadsTable'

interface LeadsPageProps {
  params: {
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function LeadsPage({ params }: LeadsPageProps) {
  const context = await requireOrganization(params.slug)
  const organizations = await listUserOrganizations()

  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const { data: leadsData } = await supabase
    .from('leads')
    .select(
      `
        *,
        card:nfc_cards (
          id,
          title
        ),
        captured_user:users (
          id,
          full_name,
          email
        )
      `
    )
    .eq('organization_id', context.organization.id)
    .order('created_at', { ascending: false })

  const leads: LeadRow[] =
    leadsData?.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      notes: lead.notes,
      source: lead.source,
      status: lead.status as LeadRow['status'],
      card: lead.card
        ? { id: lead.card.id, title: (lead.card as any).title ?? null }
        : null,
      captured_by: lead.captured_user
        ? {
            id: lead.captured_user.id,
            full_name: lead.captured_user.full_name,
            email: lead.captured_user.email
          }
        : null,
      created_at: lead.created_at
    })) ?? []

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todaysLeads = leads.filter(
    (lead) => new Date(lead.created_at) >= today
  ).length
  const contacted = leads.filter((lead) => lead.status === 'contacted').length
  const conversionRate = leads.length
    ? (contacted / leads.length) * 100
    : 0

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-24">
      <div className="container mx-auto max-w-6xl px-6 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900">CRM Leads</h1>
            <p className="mt-2 text-sm text-slate-500">
              Centralisez toutes les opportunités capturées sur le terrain et suivez vos conversions.
            </p>
          </div>
          <div className="w-full max-w-xs">
            <OrgSwitcher
              organizations={organizations.map((org: any) => ({
                id: org.id,
                name: org.name,
                slug: org.slug,
                logoUrl: org.logo_url,
                plan: org.plan
              }))}
              activeSlug={params.slug}
              onSelect={(org) => {
                if (org.slug !== params.slug) {
                  window.location.href = `/org/${org.slug}/leads`
                }
              }}
            />
          </div>
        </div>

        <LeadsStats
          totalLeads={leads.length}
          todaysLeads={todaysLeads}
          contacted={contacted}
          conversionRate={conversionRate}
        />

        <LeadsTable leads={leads} />
      </div>
    </div>
  )
}

