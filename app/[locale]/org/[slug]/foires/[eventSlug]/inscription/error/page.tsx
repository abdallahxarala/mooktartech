'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function InscriptionErrorPage({
  params,
}: {
  params: { locale: string; slug: string; eventSlug: string }
}) {
  const searchParams = useSearchParams()
  const exhibitorId = searchParams.get('exhibitor')
  const [exhibitor, setExhibitor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    if (exhibitorId) {
      loadExhibitor()
    } else {
      setLoading(false)
    }
  }, [exhibitorId])

  async function loadExhibitor() {
    if (!exhibitorId) return
    try {
      const { data, error } = await supabase
        .from('exhibitors')
        .select('*')
        .eq('id', exhibitorId)
        .single()

      if (error) {
        console.error('Error loading exhibitor:', error)
      } else {
        setExhibitor(data)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>

            <h1 className="text-3xl font-bold mb-4 text-red-600">Paiement Échoué</h1>
            <p className="text-gray-600 mb-8">
              Le paiement n&apos;a pas pu être effectué. Votre inscription a été enregistrée mais le paiement est en attente.
            </p>

            {exhibitor && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h2 className="font-bold mb-4">Détails de votre inscription</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entreprise:</span>
                    <span className="font-semibold">{exhibitor.company_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{exhibitor.contact_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <span className="font-semibold text-orange-600">En attente de paiement</span>
                  </div>
                  {exhibitor.payment_amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant:</span>
                      <span className="font-semibold">
                        {exhibitor.payment_amount.toLocaleString('fr-FR')} {exhibitor.currency || 'FCFA'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="font-bold mb-2 text-yellow-800">Que faire maintenant ?</h3>
              <ul className="text-sm text-left space-y-2 text-yellow-900">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Vérifiez que votre compte Wave/Orange Money dispose de fonds suffisants</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Vous pouvez réessayer le paiement depuis votre tableau de bord</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Contactez-nous si le problème persiste</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {exhibitor && (
                <Link
                  href={`/${params.locale}/org/${params.slug}/foires/${params.eventSlug}/mon-stand`}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <RefreshCw className="h-5 w-5" />
                  Réessayer le paiement
                </Link>
              )}
              <Link
                href={`/${params.locale}/org/${params.slug}/foires/${params.eventSlug}/inscription`}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <ArrowLeft className="h-5 w-5" />
                Retour au formulaire
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-4">Besoin d&apos;aide ? Contactez-nous :</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a
                  href="mailto:contact@foire-dakar.com"
                  className="flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700"
                >
                  contact@foire-dakar.com
                </a>
                <a
                  href="tel:+221775398139"
                  className="flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700"
                >
                  +221 77 539 81 39
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

