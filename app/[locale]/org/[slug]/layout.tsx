import { createSupabaseServerClient } from '@/lib/supabase/server'
import { HeaderXarala } from '@/components/layout/header-xarala'
import { HeaderMooktar } from '@/components/layout/header-mooktar'
import { HeaderFoireDakar } from '@/components/layout/header-foire-dakar'
import Footer from '@/components/layout/footer'
import { notFound } from 'next/navigation'

/**
 * Layout spécifique pour les pages d'organisation (multitenant)
 * Utilise des Headers spécifiques selon le tenant
 */
export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string; slug: string }
}) {
  const supabase = await createSupabaseServerClient()
  
  // Récupérer l'organization pour vérifier qu'elle existe
  const { data: organization } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', params.slug)
    .single()

  if (!organization) {
    notFound()
  }

  // Sélectionner le Header selon le slug
  const getHeader = () => {
    switch (params.slug) {
      case 'xarala-solutions':
        return <HeaderXarala />
      case 'mooktartech-com':
        return <HeaderMooktar />
      case 'foire-dakar-2025':
        return <HeaderFoireDakar />
      default:
        // Fallback vers Header Xarala pour les autres tenants
        return <HeaderXarala />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header spécifique selon le tenant */}
      {getHeader()}
      
      {/* Contenu principal */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer (commun pour tous les tenants) */}
      <Footer />
    </div>
  )
}

