'use client'

import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreateEventWizard } from '@/components/events/CreateEventWizard'

export default function NewEventPage() {
  const router = useRouter()
  const params = useParams()
  const localeParam = typeof params.locale === 'string' ? params.locale : 'fr'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${localeParam}/badge-editor/events`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux événements</span>
          </Link>
          
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Créer un Nouvel Événement
          </h1>
          <p className="text-gray-600">
            Remplissez les informations ci-dessous pour créer votre événement
          </p>
        </div>

        <Card className="bg-white p-6 shadow-sm">
          <CreateEventWizard />
        </Card>
      </div>
    </div>
  )
}
