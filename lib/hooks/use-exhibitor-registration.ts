/**
 * Hook pour gérer l'inscription d'un exposant
 * Suit les patterns existants du projet
 */

'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  exhibitorRegistrationSchema,
  type ExhibitorRegistrationFormData,
  stepSchemas,
} from '@/lib/schemas/exhibitor-registration.schema'
// Using API routes instead of direct server calls
// import { createExhibitor, updateExhibitor } from '@/lib/services/exhibitor.service'
import { useToast } from '@/components/ui/use-toast'
import { z } from 'zod'

export interface UseExhibitorRegistrationOptions {
  eventId: string
  organizationId: string
  onSuccess?: (exhibitorId: string) => void
  onError?: (error: string) => void
}

export interface UseExhibitorRegistrationReturn {
  // Form state
  form: ReturnType<typeof useForm<ExhibitorRegistrationFormData>>
  currentStep: number
  totalSteps: number
  isSubmitting: boolean
  isUploadingLogo: boolean

  // Actions
  goToStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
  validateStep: (step: number) => Promise<boolean>
  submitForm: () => Promise<void>
  uploadLogo: (file: File) => Promise<string | null>

  // Data
  formData: Partial<ExhibitorRegistrationFormData>
}

export function useExhibitorRegistration({
  eventId,
  organizationId,
  onSuccess,
  onError,
}: UseExhibitorRegistrationOptions): UseExhibitorRegistrationReturn {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const { toast } = useToast()

  const totalSteps = 5

  const form = useForm<ExhibitorRegistrationFormData>({
    resolver: zodResolver(exhibitorRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      company_name: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      website: '',
      description: '',
      category: 'autre',
      tags: [],
      booth_number: '',
      booth_location: '',
      preferred_pavillon: '',
      logo_url: '',
      payment_method: 'wave',
      payment_amount: 0,
      currency: 'XOF',
      payment_confirmed: false,
    },
  })

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step)
      }
    },
    [totalSteps]
  )

  const nextStep = useCallback(async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep, totalSteps])

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      const stepSchema = stepSchemas[step as keyof typeof stepSchemas]
      if (!stepSchema) return true

      const formValues = form.getValues()
      let stepData: any = {}

      switch (step) {
        case 1:
          stepData = {
            company_name: formValues.company_name,
            contact_name: formValues.contact_name,
            contact_email: formValues.contact_email,
            contact_phone: formValues.contact_phone,
            website: formValues.website,
            description: formValues.description,
          }
          break
        case 2:
          stepData = {
            category: formValues.category,
            tags: formValues.tags,
          }
          break
        case 3:
          stepData = {
            booth_number: formValues.booth_number,
            booth_location: formValues.booth_location,
            preferred_pavillon: formValues.preferred_pavillon,
          }
          break
        case 4:
          stepData = {
            logo_url: formValues.logo_url,
          }
          break
        case 5:
          stepData = {
            payment_method: formValues.payment_method,
            payment_amount: formValues.payment_amount,
            currency: formValues.currency,
            payment_confirmed: formValues.payment_confirmed,
          }
          break
      }

      try {
        stepSchema.parse(stepData)
        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          const firstError = error.errors[0]
          toast({
            variant: 'destructive',
            title: 'Erreur de validation',
            description: firstError?.message || 'Veuillez vérifier les informations saisies',
          })
          // Trigger form validation to show errors
          await form.trigger()
        }
        return false
      }
    },
    [form, toast]
  )

  const uploadLogo = useCallback(
    async (file: File): Promise<string | null> => {
      setIsUploadingLogo(true)
      try {
        // TODO: Implémenter l'upload Cloudinary
        // Pour l'instant, on simule avec un FileReader
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const result = reader.result as string
            form.setValue('logo_url', result)
            setIsUploadingLogo(false)
            resolve(result)
          }
          reader.onerror = () => {
            setIsUploadingLogo(false)
            toast({
              variant: 'destructive',
              title: 'Erreur',
              description: 'Impossible de charger l\'image',
            })
            resolve(null)
          }
          reader.readAsDataURL(file)
        })
      } catch (error) {
        setIsUploadingLogo(false)
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger l\'image',
        })
        return null
      }
    },
    [form, toast]
  )

  const submitForm = useCallback(async () => {
    const isValid = await form.trigger()
    if (!isValid) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez corriger les erreurs dans le formulaire',
      })
      return
    }

    setIsSubmitting(true)
    const formData = form.getValues()

    try {
      // Générer un slug à partir du nom de l'entreprise
      const slug = formData.company_name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      // Use API route instead of direct server call
      const createResponse = await fetch('/api/exhibitors/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          organization_id: organizationId,
          company_name: formData.company_name,
          slug: `${slug}-${Date.now()}`,
          description: formData.description,
          logo_url: formData.logo_url || undefined,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          website: formData.website || undefined,
          booth_number: formData.booth_number,
          booth_location: formData.booth_location || undefined,
          category: formData.category,
          tags: formData.tags,
        }),
      })
      
      const createData = await createResponse.json()
      const result = createData.error 
        ? { exhibitor: null, error: createData.error }
        : { exhibitor: createData.exhibitor, error: null }

      if (result.error || !result.exhibitor) {
        throw new Error(result.error || 'Erreur lors de la création de l\'exposant')
      }

      // Mettre à jour le statut de paiement si nécessaire
      if (formData.payment_confirmed) {
        // Use API route instead of direct server call
        const updateResponse = await fetch('/api/exhibitors/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exhibitor_id: result.exhibitor.id,
            updates: {
              payment_status: 'paid',
              payment_amount: formData.payment_amount,
              currency: formData.currency,
            },
          }),
        })
        
        const updateData = await updateResponse.json()
        if (updateData.error) {
          console.error('Error updating exhibitor payment:', updateData.error)
        }
          },
        })
      }

      toast({
        title: 'Inscription réussie !',
        description: 'Votre demande d\'inscription a été enregistrée avec succès.',
      })

      onSuccess?.(result.exhibitor.id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: errorMessage,
      })
      onError?.(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }, [form, eventId, organizationId, toast, onSuccess, onError])

  return {
    form,
    currentStep,
    totalSteps,
    isSubmitting,
    isUploadingLogo,
    goToStep,
    nextStep,
    previousStep,
    validateStep,
    submitForm,
    uploadLogo,
    formData: form.getValues(),
  }
}

