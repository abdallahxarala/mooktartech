import { CardDesignerPro } from '@/components/card-designer-pro/CardDesignerPro'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

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
    .single()

  if (orgError || !organization) {
    console.error('❌ Organization not found:', { slug, error: orgError })
    notFound()
  }

  // Debug log pour vérification
  console.log('✅ Badge Designer Pro - Organization found:', { id: organization.id, name: organization.name, slug: organization.slug })

  return <CardDesignerPro />
}

