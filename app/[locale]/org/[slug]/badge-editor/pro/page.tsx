import { CardDesignerPro } from '@/components/card-designer-pro/CardDesignerPro'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Database } from '@/lib/supabase/database.types'

type Organization = Database['public']['Tables']['organizations']['Row']

interface BadgeDesignerProPageProps {
  params: {
    locale: string
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function BadgeDesignerProPage({ params }: BadgeDesignerProPageProps) {
  const { locale, slug } = params
  const supabase = await createSupabaseServerClient()

  // Vérifier que l'organization existe
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
  // Debug log pour vérification
  console.log('✅ Badge Designer Pro - Organization found:', { id: (organization as any).id, name: (organization as any).name, slug: (organization as any).slug })

  return <CardDesignerPro />
}

