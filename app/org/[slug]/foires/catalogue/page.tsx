/**
 * Page catalogue produits pour visiteurs
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireOrganization } from '@/middleware/orgContext'
import { CatalogueClient } from './catalogue-client'
import type { Database } from '@/lib/types/database.types'

interface CataloguePageProps {
  params: {
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function CataloguePage({ params }: CataloguePageProps) {
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

  // Récupérer les exposants de la foire
  const { data: exhibitorsData } = await supabase
    .from('exhibitors')
    .select('id')
    .eq('event_id', foire.id)

  const exhibitorIds = exhibitorsData?.map((e) => e.id) || []

  // Récupérer les catégories et prix pour les filtres
  const { data: products } = exhibitorIds.length > 0
    ? await supabase
        .from('exhibitor_products')
        .select('category, exhibitor_id, price')
        .eq('is_available', true)
        .in('exhibitor_id', exhibitorIds)
    : { data: null }

  const categories = Array.from(
    new Set(products?.map((p) => p.category).filter(Boolean) || [])
  ) as string[]

  const prices = products?.map((p) => Number(p.price || 0)).filter((p) => p > 0) || []
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0

  const { data: exhibitors } = await supabase
    .from('exhibitors')
    .select('id, company_name')
    .eq('event_id', foire.id)

  return (
    <CatalogueClient
      organizationSlug={params.slug}
      eventId={foire.id}
      eventName={foire.name}
      categories={categories}
      exhibitors={exhibitors?.map((e) => ({ id: e.id, name: e.company_name })) || []}
      priceRange={minPrice < maxPrice ? { min: minPrice, max: maxPrice } : undefined}
    />
  )
}

