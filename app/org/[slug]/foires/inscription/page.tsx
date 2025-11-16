/**
 * Page d'inscription exposant pour les foires
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ExhibitorRegistrationForm } from '@/components/exhibitor-registration/exhibitor-registration-form'
import { getFoireBySlug } from '@/lib/services/foire.service'
import { getOrganizationBySlug } from '@/lib/services/organization.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface InscriptionPageProps {
  params: {
    slug: string
  }
  searchParams: {
    foire?: string
  }
}

export const dynamic = 'force-dynamic'

export default async function InscriptionPage({
  params,
  searchParams,
}: InscriptionPageProps) {
  const cookieStore = cookies()

  const supabase = createServerClient(
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
    redirect(`/auth/login?redirect=/org/${params.slug}/foires/inscription`)
  }

  // Récupérer l'organisation
  const orgResult = await getOrganizationBySlug(params.slug)
  if (orgResult.error || !orgResult.organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Organisation introuvable ou erreur: {orgResult.error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Récupérer la foire (si spécifiée dans les query params)
  let foire = null
  let foireConfig = null

  if (searchParams.foire) {
    const foireResult = await getFoireBySlug(searchParams.foire)
    if (foireResult.foire && foireResult.foire.organization_id === orgResult.organization.id) {
      foire = foireResult.foire
      foireConfig = foire.foire_config as any
    }
  } else {
    // Récupérer la première foire de l'organisation
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('organization_id', orgResult.organization.id)
      .eq('event_type', 'foire')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (events) {
      foire = events
      foireConfig = (events as any).foire_config
    }
  }

  if (!foire) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Aucune foire trouvée pour cette organisation. Veuillez contacter l'administrateur.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-5xl mx-auto">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl md:text-4xl font-bold mb-2">
              Inscription Exposant
            </CardTitle>
            <p className="text-lg text-gray-600">
              {foire.name}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Remplissez le formulaire ci-dessous pour vous inscrire en tant qu'exposant
            </p>
          </CardHeader>
          <CardContent>
            <ExhibitorRegistrationForm
              eventId={foire.id}
              organizationId={orgResult.organization.id}
              foireConfig={foireConfig}
              organizationSlug={params.slug}
              onSuccess={(exhibitorId) => {
                // Redirection gérée dans le composant
              }}
              onError={(error) => {
                console.error('Erreur inscription:', error)
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

