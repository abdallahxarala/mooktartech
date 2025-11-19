import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { NFCEditorClient } from '@/components/nfc-wizard/nfc-editor-client'

interface NFCEditorPageProps {
  params: {
    locale: string
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export default async function NFCEditorPage({ params }: NFCEditorPageProps) {
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

  // Debug log pour vérification
  console.log('✅ NFC Editor - Organization found:', { id: organization.id, name: organization.name, slug: organization.slug })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Sticky Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back */}
            <Link
              href={`/${locale}/org/${slug}`}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Retour à l&apos;accueil</span>
              <span className="sm:hidden">Retour</span>
            </Link>

            {/* Center: Title */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <h1 className="text-xl font-black text-gray-900">
                <span className="hidden md:inline">Créateur de Carte NFC</span>
                <span className="md:hidden">NFC Editor</span>
              </h1>
            </div>

            {/* Right: Status */}
            <div className="flex items-center gap-3">
              {/* Plan badge */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 font-bold rounded-xl text-sm border-2 border-orange-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>Gratuit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wizard Content */}
      <div className="container mx-auto px-6 py-12">
        <NFCEditorClient />
      </div>
    </div>
  )
}

