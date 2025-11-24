import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireOrganization, listUserOrganizations } from '@/middleware/orgContext'
import type { Database } from '@/lib/types/database.types'
import { OrgSwitcher } from '@/components/org/OrgSwitcher'
import { MembersList } from '@/components/org/MembersList'
import { canManageMembers } from '@/lib/org-permissions'

interface MembersPageProps {
  params: {
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function OrganizationMembersPage({ params }: MembersPageProps) {
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

  const { data: members } = await supabase
    .from('organization_members')
    .select(
      `
        id,
        role,
        created_at,
        user:users (
          id,
          email,
          full_name
        )
      `
    )
    .eq('organization_id', (context.organization as any).id)

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-24">
      <div className="container mx-auto max-w-5xl px-6 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Membres</h1>
            <p className="mt-2 text-sm text-slate-500">
              Invitez vos collègues, gérez leurs droits et gardez un historique clair des accès.
            </p>
          </div>
          <div className="w-full max-w-xs">
            <OrgSwitcher
              organizations={organizations.map((org: any) => ({
                id: (org as any).id,
                name: (org as any).name,
                slug: (org as any).slug,
                logoUrl: (org as any).logo_url,
                plan: (org as any).plan
              }))}
              activeSlug={params.slug}
              onSelect={(org) => {
                if ((org as any).slug !== params.slug) {
                  window.location.href = `/org/${(org as any).slug}/members`
                }
              }}
            />
          </div>
        </div>

        <MembersList
          organizationId={(context.organization as any).id}
          plan={((context.organization as any).plan as any) ?? 'free'}
          canManage={canManageMembers(context.membership.role)}
          members={
            members?.map((member) => ({
              id: member.id,
              email: member.user?.email ?? '',
              fullName: member.user?.full_name,
              role: member.role as any,
              joinedAt: member.created_at
            })) ?? []
          }
        />
      </div>
    </div>
  )
}

