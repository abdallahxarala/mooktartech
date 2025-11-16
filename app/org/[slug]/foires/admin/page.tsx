/**
 * Dashboard administrateur de la foire
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { requireOrganization } from '@/middleware/orgContext'
import { AdminClient } from './admin-client'
import type { Database } from '@/lib/types/database.types'

interface FoireAdminPageProps {
  params: {
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function FoireAdminPage({ params }: FoireAdminPageProps) {
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
    redirect(`/auth/login?redirect=/org/${params.slug}/foires/admin`)
  }

  // Vérifier les permissions admin (TODO: Implémenter la vérification de rôle)
  // Pour l'instant, on vérifie que l'utilisateur est membre de l'organisation

  // Récupérer la foire de l'organisation
  const { data: foire } = await supabase
    .from('events')
    .select('*')
    .eq('organization_id', context.organization.id)
    .eq('event_type', 'foire')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!foire) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24 pt-24">
        <div className="container mx-auto max-w-6xl px-6">
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

  return (
    <AdminClient
      organizationSlug={params.slug}
      organizationName={context.organization.name}
      eventId={foire.id}
      eventName={foire.name}
    />
  )
}

