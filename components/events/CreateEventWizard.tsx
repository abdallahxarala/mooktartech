'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Step1GeneralInfo } from '@/components/events/steps/Step1GeneralInfo'
import { Step2DateTime } from '@/components/events/steps/Step2DateTime'
import { Step3Settings } from '@/components/events/steps/Step3Settings'
import { Step4Zones } from '@/components/events/steps/Step4Zones'
import { Step5Summary } from '@/components/events/steps/Step5Summary'

type Step = {
  id: number
  title: string
  description: string
}

const STEPS: Step[] = [
  { id: 1, title: 'Informations', description: 'Nom et description' },
  { id: 2, title: 'Planification', description: 'Dates et lieu' },
  { id: 3, title: 'Paramètres', description: 'Capacité et options' },
  { id: 4, title: 'Zones', description: "Zones d'accès" },
  { id: 5, title: 'Récapitulatif', description: 'Vérification' }
]

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export function CreateEventWizard() {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'conference',
    start_date: '',
    end_date: '',
    location: '',
    location_address: '',
    city: '',
    country: 'Sénégal',
    max_attendees: null as number | null,
    registration_required: true,
    is_public: true,
    zones: [] as Array<{
      name: string
      type: string
      capacity: number | null
      access_levels: string[]
    }>
  })

  const progress = (currentStep / STEPS.length) * 100

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          toast.error("Le nom de l'événement est obligatoire.")
          return false
        }
        return true
      case 2:
        if (!formData.start_date || !formData.end_date) {
          toast.error('Les dates de début et de fin sont obligatoires.')
          return false
        }
        if (new Date(formData.end_date) <= new Date(formData.start_date)) {
          toast.error('La date de fin doit être postérieure à la date de début.')
          return false
        }
        return true
      case 3:
        if (formData.max_attendees && formData.max_attendees < 1) {
          toast.error('La capacité doit être supérieure à 0.')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    console.log('🚀 BOUTON CLIQUÉ - handleSubmit appelé')
    console.log('📊 Form data:', formData)
    console.log('🔄 isSubmitting:', isSubmitting)

    if (isSubmitting) return
    setIsSubmitting(true)
    console.log('✅ Début de la soumission...')

    try {
      const supabase = createSupabaseBrowserClient()
      console.log('✅ Supabase client créé')

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()
      console.log('👤 User:', user)

      if (userError || !user) {
        toast.error('Vous devez être connecté pour créer un événement')
        setIsSubmitting(false)
        return
      }

      const {
        data: membership,
        error: membershipError
      } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single<{ organization_id: string }>()

      console.log('🏢 Membership:', membership)

      if (membershipError || !membership) {
        toast.error("Vous devez être membre d'une organisation")
        console.error('Membership error:', membershipError)
        setIsSubmitting(false)
        return
      }

      let slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      console.log('🔖 Slug généré:', slug)
      console.log('🔧 Slug généré:', slug)
      console.log('🔧 Type slug:', typeof slug)
      slug = String(slug)

      const eventData = {
        organization_id: membership.organization_id,
        name: formData.name.trim(),
        slug,
        description: formData.description?.trim() || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        location: formData.location?.trim() || null,
        location_address: formData.location_address?.trim() || null,
        max_attendees: formData.max_attendees || null,
        status: formData.is_public ? 'published' : 'draft',
        settings: {
          type: formData.type,
          city: formData.city,
          country: formData.country
        }
      }
      console.log('📝 Payload événement:', eventData)

      console.log('🔗 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log(
        '🔑 Supabase Key existe:',
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )

      console.log('═══════════════════════════════════════')
      console.log('📦 PAYLOAD COMPLET AVANT INSERTION :')
      console.log('═══════════════════════════════════════')
      console.log('organization_id:', membership.organization_id)
      console.log('Type:', typeof membership.organization_id)
      console.log('name:', formData.name)
      console.log('slug:', slug)
      console.log('start_date:', formData.start_date)
      console.log('end_date:', formData.end_date)
      console.log('═══════════════════════════════════════')
      console.log('EventData complet:', JSON.stringify(eventData, null, 2))
      console.log('═══════════════════════════════════════')

      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single()
      console.log('📥 Réponse brute event:', { data: event, error: eventError })
      console.log('❌ Erreur détaillée:', eventError)

      if (eventError) {
        console.log('Code erreur:', eventError.code)
        console.log('Message:', eventError.message)
        console.log('Details:', eventError.details)
        console.log('Hint:', eventError.hint)
        throw eventError
      }

      if (formData.zones?.length > 0) {
        console.log('📦 Insertion zones')
        console.log('🎯 Zones à créer:', formData.zones)
        console.log('🎯 event.id:', event.id)
        const zonesData = formData.zones.map((zone: any) => ({
          event_id: event.id,
          name: zone.name,
          type: zone.type,
          capacity: zone.capacity || null,
          access_levels: zone.access_levels
        }))

        await supabase.from('event_zones').insert(zonesData)
      }

      toast.success('Événement créé avec succès !')
      router.push('/badge-editor/events')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la création')
      setIsSubmitting(false)
    } finally {
      console.log('🏁 handleSubmit terminé')
    }
  }

  const onNext = () => {
    if (validateStep()) {
      nextStep()
    }
  }

  const currentStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <Step1GeneralInfo data={formData} onChange={updateFormData} />
      case 2:
        return <Step2DateTime data={formData} onChange={updateFormData} />
      case 3:
        return <Step3Settings data={formData} onChange={updateFormData} />
      case 4:
        return <Step4Zones data={formData} onChange={updateFormData} />
      case 5:
        return <Step5Summary data={formData} />
      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-muted-foreground">
              {STEPS[currentStep - 1].description}
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            Étape {currentStep} sur {STEPS.length}
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="flex justify-between">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className={`flex items-center ${
              step.id < currentStep
                ? 'text-primary'
                : step.id === currentStep
                ? 'text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step.id < currentStep
                  ? 'border-primary bg-primary text-primary-foreground'
                  : step.id === currentStep
                  ? 'border-primary'
                  : 'border-muted'
              }`}
            >
              {step.id < currentStep ? '✓' : step.id}
            </div>
            <span className="ml-2 hidden md:inline">{step.title}</span>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-card p-6 shadow-sm">
        {currentStepComponent()}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>

        {currentStep < STEPS.length ? (
          <Button onClick={onNext} disabled={isSubmitting}>
            Suivant
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              console.log('🖱️ BOUTON CLIQUÉ !')
              handleSubmit()
            }}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-pink-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              "Créer l'événement"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

