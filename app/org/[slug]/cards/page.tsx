import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireOrganization, listUserOrganizations } from '@/middleware/orgContext'
import type { Database } from '@/lib/types/database.types'
import { OrgSwitcher } from '@/components/org/OrgSwitcher'
import { CardsManager } from '@/components/org/CardsManager'
import { canManageCards } from '@/lib/org-permissions'

interface CardsPageProps {
  params: {
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function OrganizationCardsPage({ params }: CardsPageProps) {
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

  const { data: cards } = await supabase
    .from('nfc_cards')
    .select(
      `
        id,
        organization_id,
        assigned_to,
        data,
        is_active,
        created_at,
        users:users!nfc_cards_assigned_to_fkey (
          id,
          full_name,
          email
        )
      `
    )
    .eq('organization_id', context.organization.id)

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-24">
      <div className="container mx-auto max-w-5xl px-6 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Cartes NFC</h1>
            <p className="mt-2 text-sm text-slate-500">
              Assignez les cartes à vos collaborateurs et suivez leurs performances.
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
                  window.location.href = `/org/${org.slug}/cards`
                }
              }}
            />
          </div>
        </div>

        <CardsManager
          organizationId={context.organization.id}
          plan={(context.organization.plan as any) ?? 'free'}
          canManage={canManageCards(context.membership.role)}
          cards={
            cards?.map((card) => ({
              id: card.id,
              title: (card.data as any)?.title ?? null,
              assignedTo: card.users
                ? {
                    id: card.users.id,
                    fullName: card.users.full_name,
                    email: card.users.email
                  }
                : null,
              createdAt: card.created_at,
              isActive: card.is_active ?? true,
              views: (card.data as any)?.analytics?.views ?? 0
            })) ?? []
          }
        />
      </div>
    </div>
  )
}

