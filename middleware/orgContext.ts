import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database.types'
import {
  getPlanLimits,
  OrganizationPlan,
  OrganizationRole
} from '@/lib/org-permissions'

export interface OrganizationContext {
  organization: Database['public']['Tables']['organizations']['Row']
  membership: {
    role: OrganizationRole
  }
  limits: ReturnType<typeof getPlanLimits>
}

export async function getOrganizationContext(slug: string): Promise<OrganizationContext | null> {
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

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) return null

  const { data: organization, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !organization) return null

  const { data: member } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', organization.id)
    .eq('user_id', session.user.id)
    .maybeSingle()

  if (!member) return null

  const plan = (organization.plan as OrganizationPlan) ?? 'free'

  return {
    organization,
    membership: {
      role: member.role as OrganizationRole
    },
    limits: getPlanLimits(plan)
  }
}

export async function requireOrganization(slug: string): Promise<OrganizationContext> {
  const context = await getOrganizationContext(slug)
  if (!context) {
    redirect('/orgs')
  }
  return context
}

export async function listUserOrganizations() {
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

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) return []

  const { data } = await supabase
    .from('organization_members')
    .select(
      `
        role,
        organization:organizations (
          id,
          name,
          slug,
          logo_url,
          plan
        )
      `
    )
    .eq('user_id', session.user.id)

  return (
    data?.map((row) => ({
      role: row.role,
      ...(row.organization ?? {})
    })) ?? []
  )
}

