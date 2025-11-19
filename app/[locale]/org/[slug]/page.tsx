import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { XaralaHomePageClient } from './xarala-homepage-client'
import { MooktarHomePageClient } from './mooktar-homepage-client'
import { FoireDakarHomePageClient } from './foire-dakar-homepage-client'

interface OrgHomePageProps {
  params: {
    locale: string
    slug: string
  }
}

export const dynamic = 'force-dynamic'

/**
 * Homepage multitenant avec sélection automatique selon le slug
 * - Xarala Solutions → Homepage complète avec services
 * - Mooktar Tech → Homepage e-commerce avec produits
 * - Foire Dakar 2025 → Homepage événementielle avec exposants
 */
export default async function OrgHomePage({ params }: OrgHomePageProps) {
  const { locale, slug } = params
  const supabase = await createSupabaseServerClient()

  // ====================================
  // ÉTAPE 1 : RÉCUPÉRER L'ORGANIZATION
  // ====================================
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()

  if (orgError || !organization) {
    console.error('❌ Organization not found:', { slug, error: orgError })
    notFound()
  }

  // ====================================
  // ÉTAPE 2 : SÉLECTIONNER LA HOMEPAGE
  // ====================================
  switch (slug) {
    case 'xarala-solutions':
      return <XaralaHomePageClient locale={locale} slug={slug} />
    
    case 'mooktartech-com':
      return <MooktarHomePageClient locale={locale} slug={slug} />
    
    case 'foire-dakar-2025':
      return <FoireDakarHomePageClient locale={locale} slug={slug} />
    
    default:
      // Fallback vers homepage générique pour les autres tenants
      return <MooktarHomePageClient locale={locale} slug={slug} />
  }
}
