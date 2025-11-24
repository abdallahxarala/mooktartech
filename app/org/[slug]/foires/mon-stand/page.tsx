/**
 * Dashboard boutique exposant avec gestion produits
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { requireOrganization } from '@/middleware/orgContext'
import { DashboardClient } from './dashboard-client'
import type { Database } from '@/lib/types/database.types'

interface MonStandPageProps {
  params: {
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function MonStandPage({ params }: MonStandPageProps) {
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

  // Vérifier l'authentification
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/auth/login?redirect=/org/${params.slug}/foires/mon-stand`)
  }

  // Récupérer l'exposant de l'utilisateur pour cette organisation
  const { data: exhibitor } = await supabase
    .from('exhibitors')
    .select('id, event_id, company_name, status')
    .eq('organization_id', (context.organization as any).id)
    .eq('contact_email', session.user.email || '')
    .single()

  if (!exhibitor) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24 pt-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Aucun stand trouvé
            </h2>
            <p className="text-red-700">
              Vous n'avez pas encore de stand pour cette organisation. Veuillez vous inscrire
              d'abord.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardClient
      organizationSlug={params.slug}
      organizationName={(context.organization as any).name}
      exhibitorId={exhibitor.id}
      eventId={exhibitor.event_id}
      companyName={exhibitor.company_name}
    />
  )
}

