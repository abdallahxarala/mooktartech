/**
 * Formulaire multi-étapes d'inscription exposant
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useExhibitorRegistration } from '@/lib/hooks/use-exhibitor-registration'
import { StepCompanyInfo } from './step-company-info'
import { StepActivity } from './step-activity'
import { StepBoothSelection } from './step-booth-selection'
import { StepLogoUpload } from './step-logo-upload'
import { StepPayment } from './step-payment'
import { motion, AnimatePresence } from 'framer-motion'
import type { UseExhibitorRegistrationOptions } from '@/lib/hooks/use-exhibitor-registration'

interface ExhibitorRegistrationFormProps extends UseExhibitorRegistrationOptions {
  foireConfig?: {
    pavillons?: Record<
      string,
      {
        nom: string
        capacite: number
        superficie?: number
        description?: string
      }
    >
    zones?: string[]
  }
  organizationSlug?: string
}

export function ExhibitorRegistrationForm({
  eventId,
  organizationId,
  foireConfig,
  organizationSlug,
  onSuccess,
  onError,
}: ExhibitorRegistrationFormProps) {
  const router = useRouter()
  const {
    form,
    currentStep,
    totalSteps,
    isSubmitting,
    isUploadingLogo,
    nextStep,
    previousStep,
    validateStep,
    submitForm,
    uploadLogo,
  } = useExhibitorRegistration({
    eventId,
    organizationId,
    onSuccess: (exhibitorId) => {
      if (organizationSlug) {
        router.push(`/org/${organizationSlug}/foires/exposants/${exhibitorId}/confirmation`)
      }
      onSuccess?.(exhibitorId)
    },
    onError,
  })

  const [isCompleting, setIsCompleting] = useState(false)

  const handleNext = async () => {
    if (currentStep === totalSteps) {
      setIsCompleting(true)
      await submitForm()
      setIsCompleting(false)
    } else {
      await nextStep()
    }
  }

  const handlePrevious = () => {
    previousStep()
  }

  const progress = (currentStep / totalSteps) * 100

  const stepTitles = [
    'Informations entreprise',
    'Secteur d\'activité',
    'Choix du stand',
    'Logo',
    'Paiement',
  ]

  return (
    <Form {...form}>
      <form className="w-full max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Étape {currentStep} sur {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="mt-2 text-center">
            <span className="text-sm font-semibold text-gray-900">
              {stepTitles[currentStep - 1]}
            </span>
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && <StepCompanyInfo />}
              {currentStep === 2 && <StepActivity />}
              {currentStep === 3 && <StepBoothSelection foireConfig={foireConfig} />}
              {currentStep === 4 && (
                <StepLogoUpload onUpload={uploadLogo} isUploading={isUploadingLogo} />
              )}
              {currentStep === 5 && <StepPayment />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting || isCompleting}
            className="h-12 px-6 text-base font-semibold"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Précédent
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting || isCompleting || isUploadingLogo}
            className="h-12 px-8 text-base font-semibold bg-orange-500 hover:bg-orange-600"
          >
            {isSubmitting || isCompleting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {currentStep === totalSteps ? 'Enregistrement...' : 'Vérification...'}
              </>
            ) : (
              <>
                {currentStep === totalSteps ? 'Finaliser l\'inscription' : 'Suivant'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
