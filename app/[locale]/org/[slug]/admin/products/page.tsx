import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { AdminProductsClient } from './admin-products-client'
import type { Database } from '@/lib/supabase/database.types'

type Organization = Database['public']['Tables']['organizations']['Row']

interface AdminProductsPageProps {
  params: {
    locale: string
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage({ params }: AdminProductsPageProps) {
  const { locale, slug } = params
  const supabase = await createSupabaseServerClient()

  // ====================================
  // ÉTAPE 1 : VÉRIFIER ORGANIZATION
  // ====================================
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', slug)
    .single<Organization>()

  if (orgError || !organization) {
    console.error('❌ Organization not found:', { slug, error: orgError })
    notFound()
  }

  // TypeScript now knows organization is of type Organization after the check above
  const orgId = organization.id

  // Debug log pour vérification
  console.log(`✅ Admin Products - Organization found: ${organization.name} (${orgId})`)

  // ====================================
  // ÉTAPE 2 : RÉCUPÉRER LES PRODUITS FILTRÉS
  // ====================================
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('organization_id', orgId) // ← CRITIQUE : Isolation multitenant
    .order('created_at', { ascending: false })

  if (productsError) {
    console.error('❌ Error fetching products:', productsError)
  }

  const productsList = products || []

  // Debug log pour vérification
  console.log(`📊 Admin Products - Products count for ${organization.name}: ${productsList.length}`)

  // ====================================
  // ÉTAPE 3 : RÉCUPÉRER STATS
  // ====================================
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)

  return (
    <AdminProductsClient
      products={productsList}
      organizationId={orgId}
      organizationSlug={slug}
      locale={locale}
      totalProducts={totalProducts || 0}
    />
  )
}

