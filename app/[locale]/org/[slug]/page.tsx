import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { XaralaHomePageClient } from './xarala-homepage-client'

interface OrgHomePageProps {
  params: {
    locale: string
    slug: string
  }
}

export const dynamic = 'force-dynamic'

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

  // Pour Xarala Solutions, utiliser le composant client avec la bonne homepage
  if (slug === 'xarala-solutions') {
    return <XaralaHomePageClient locale={locale} slug={slug} />
  }

  // Pour les autres organisations (Mooktar Tech, Foire Dakar), utiliser la version e-commerce
  const orgId = organization.id

  // Récupérer les produits filtrés par organization_id
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('organization_id', orgId)
    .eq('featured', true)
    .limit(10)

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organization_id', orgId)
    .order('start_date', { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-gray-900 mb-8">
          {organization.name}
        </h1>
        
        {products && products.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produits phares</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {product.price.toLocaleString()} FCFA
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {events && events.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Événements</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
