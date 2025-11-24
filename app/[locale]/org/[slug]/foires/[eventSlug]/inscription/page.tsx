'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight, ChevronLeft, Upload, Building, User, MapPin, CreditCard, Loader2, Users, Minus, Plus } from 'lucide-react'
import type { WavePaymentRequest } from '@/lib/services/payments/wave'

interface StepProps {
  formData: any
  setFormData: (data: any) => void
  event: any
  onNext: () => void
  onPrev: () => void
}

interface StaffFormData {
  firstName: string
  lastName: string
  function: string
  email: string
  phone: string
  photo: File | null
  photoPreview: string | null
}

export default function InscriptionExposantPage({
  params,
}: {
  params: { locale: string; slug: string; eventSlug: string }
}) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  // ✅ Éviter le mismatch SSR/Client
  const [mounted, setMounted] = useState(false)

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<string>('cash')

  const [formData, setFormData] = useState({
    // Étape 1 : Informations entreprise
    companyName: '',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',

    // Étape 2 : Catégorie & Activité
    category: '',
    tags: [] as string[],

    // Étape 3 : Sélection stand
    pavillonType: '',
    pavillonCode: '',
    standSize: 0, // En m² maintenant

    // Étape 3.5 : Options meubles (NOUVEAU)
    furnitureOptions: {} as Record<string, number>, // { 'table_presentation': 2, 'vitrine_verre': 1 }

    // Étape 4 : Logo
    logoUrl: '',
    bannerUrl: '',

    // Étape 5 : Exposants
    staffMembers: [] as StaffFormData[],
    numberOfStaff: 1,

    // Calculé
    subtotalHT: 0,
    furnitureTotalHT: 0,
    totalHT: 0,
    tvaAmount: 0,
    totalTTC: 0,
  })

  const steps = [
    { id: 0, name: 'Entreprise', icon: Building },
    { id: 1, name: 'Activité', icon: User },
    { id: 2, name: 'Stand', icon: MapPin },
    { id: 3, name: 'Logo', icon: Upload },
    { id: 4, name: 'Exposants', icon: Users },
    { id: 5, name: 'Paiement', icon: CreditCard },
  ]

  // ✅ Éviter le mismatch SSR/Client
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadEvent()
    }
  }, [params.eventSlug, mounted])

  async function loadEvent() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', params.eventSlug)
        .single()

      if (error) {
        console.error('Error loading event:', error)
      } else {
        setEvent(data)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  function handlePrev() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  async function handleSubmit(paymentMethod: string = 'cash') {
    setSubmitting(true)
    setCurrentPaymentMethod(paymentMethod)

    try {
      console.log('=== DÉBUT INSCRIPTION ===')
      console.log('FormData:', {
        companyName: formData.companyName,
        pavillonCode: formData.pavillonCode,
        standSize: formData.standSize,
        totalTTC: formData.totalTTC,
        staffCount: formData.staffMembers.length,
        paymentMethod: paymentMethod,
      })

      // Validation finale
      if (!formData.companyName) {
        throw new Error('Nom de l\'entreprise manquant')
      }

      if (!formData.pavillonCode || !formData.standSize) {
        throw new Error('Configuration du stand incomplète (pavillon ou taille)')
      }

      if (!formData.totalTTC || formData.totalTTC === 0) {
        throw new Error('Le montant total est invalide (0 ou NaN)')
      }

      const eventData = event as any
      if (!eventData || !eventData.id) {
        throw new Error('Événement non trouvé')
      }

      console.log('✅ Validations passées')

      // Générer slug unique
      const baseSlug = formData.companyName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Retirer accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50)

      const timestamp = Date.now()
      const slug = `${baseSlug}-${timestamp}`

      console.log('Slug généré:', slug)

      // Déterminer le statut de paiement selon le mode
      // Valeurs autorisées par Supabase : 'unpaid', 'paid', 'refunded', 'failed'
      let paymentStatus: 'unpaid' | 'paid' | 'refunded' | 'failed' = 'unpaid'
      if (paymentMethod === 'cash') {
        paymentStatus = 'unpaid' // Paiement sur place - sera mis à 'paid' après confirmation
      } else if (paymentMethod === 'transfer') {
        paymentStatus = 'unpaid' // En attente de virement - sera mis à 'paid' après confirmation
      }

      // Préparer les données exposant
      const exhibitorData = {
        event_id: eventData.id,
        organization_id: eventData.organization_id,
        company_name: formData.companyName,
        slug: slug,
        description: formData.description || null,
        logo_url: formData.logoUrl || null,
        banner_url: formData.bannerUrl || null,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        website: formData.website || null,
        booth_location: formData.pavillonCode,
        category: formData.category || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        approval_status: (paymentStatus as any) === 'paid' ? 'approved' : 'pending',
        status: (paymentStatus as any) === 'paid' ? 'approved' : 'pending', // Maintenir pour compatibilité
        payment_status: paymentStatus,
        payment_method: paymentMethod === 'mobile' ? 'wave' : paymentMethod === 'transfer' ? 'bank_transfer' : paymentMethod === 'cash' ? 'cash' : null,
        payment_amount: formData.totalTTC,
        currency: 'FCFA',
        // Stocker les détails dans metadata pour la génération de facture
        metadata: {
          standSize: formData.standSize,
          pavillonCode: formData.pavillonCode,
          furnitureOptions: formData.furnitureOptions,
          subtotalHT: formData.subtotalHT,
          furnitureTotalHT: formData.furnitureTotalHT,
          totalHT: formData.totalHT,
          tvaAmount: formData.tvaAmount,
          totalTTC: formData.totalTTC,
        },
      }

      console.log('Données exposant préparées:', {
        event_id: exhibitorData.event_id,
        organization_id: exhibitorData.organization_id,
        company_name: exhibitorData.company_name,
        slug: exhibitorData.slug,
        payment_amount: exhibitorData.payment_amount,
      })

      // 1. Créer l'exposant
      console.log('Création de l\'exposant...')
      const { data: exhibitor, error: exhibitorError } = await (supabase
        .from('exhibitors') as any)
        .insert([exhibitorData])
        .select()
        .single()

      if (exhibitorError) {
        console.error('❌ Erreur création exposant:', exhibitorError)
        throw new Error(`Erreur lors de la création de l'exposant: ${exhibitorError.message}`)
      }

      const exhibitorData_result = exhibitor as any
      console.log('✅ Exposant créé:', exhibitorData_result.id)

      // 2. Générer la facture PDF automatiquement via API (en arrière-plan, non bloquant)
      let invoiceUrl: string | undefined
      try {
        const response = await fetch(
          `/api/foires/${params.eventSlug}/invoices/${exhibitorData_result.id}`,
          { method: 'POST' }
        )
        
        if (response.ok) {
          const result = await response.json()
          invoiceUrl = result.invoiceUrl
          console.log(`✅ Facture générée: ${result.invoiceNumber}`)
        } else {
          console.warn('⚠️ Erreur génération facture (non bloquant):', await response.text())
        }
      } catch (invoiceError) {
        console.warn('⚠️ Erreur génération facture (non bloquant):', invoiceError)
        // Continue même si la facture échoue
      }

      // 3. Envoyer email de confirmation avec facture (en arrière-plan, non bloquant)
      try {
        const { sendExhibitorConfirmationEmail } = await import('@/lib/services/email/templates')
        const foireConfig = event?.foire_config || {}
        const pavillons = foireConfig.pavillons || {}
        const pavillon = Object.values(pavillons).find(
          (p: any) => p.code === formData.pavillonCode
        ) as any

        // Construire l'URL de la facture (utiliser celle générée ou fallback vers endpoint API)
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || '')
        const invoiceApiUrl = invoiceUrl || `${baseUrl}/api/foires/${params.eventSlug}/invoices/${exhibitor.id}`

        await sendExhibitorConfirmationEmail({
          to: formData.contactEmail,
          exhibitorName: formData.contactName,
          companyName: formData.companyName,
          standNumber: exhibitor.booth_number || null,
          pavilionName: pavillon?.nom || formData.pavillonCode || 'Non assigné',
          surfaceArea: formData.standSize,
          totalPrice: formData.totalTTC,
          invoiceUrl: invoiceApiUrl,
        })
        console.log('✅ Email de confirmation avec facture envoyé')
      } catch (emailError) {
        console.warn('⚠️ Erreur envoi email (non bloquant):', emailError)
        // Continue même si l'email échoue
      }

      // 3. Créer les staff members
      const validStaff = formData.staffMembers.filter(
        (s: any) => s.firstName && s.lastName
      )

      console.log(`Création de ${validStaff.length} membre(s) du staff...`)

      if (validStaff.length > 0) {
        const staffInserts = validStaff.map((staff: any, index: number) => ({
          exhibitor_id: exhibitorData_result.id,
          first_name: staff.firstName,
          last_name: staff.lastName,
          function: staff.function || '',
          email: staff.email || null,
          phone: staff.phone || null,
          badge_photo_url: staff.photoPreview || null,
          badge_id: `BADGE-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          access_level: 'exhibitor',
          is_primary_contact: index === 0,
        }))

        const { error: staffError } = await (supabase
          .from('exhibitor_staff') as any)
          .insert(staffInserts)

        if (staffError) {
          console.error('⚠️ Erreur création staff (non bloquant):', staffError)
          // Continue quand même, on peut ajouter les staff plus tard
        } else {
          console.log('✅ Staff créé avec succès')
        }
      }

      // 3. Redirection vers succès
      console.log('=== INSCRIPTION RÉUSSIE ===')
      alert(`✅ Inscription réussie ! Total: ${new Intl.NumberFormat('fr-FR').format(formData.totalTTC)} FCFA`)
      
      router.push(
        `/${params.locale}/org/${params.slug}/foires/${params.eventSlug}/inscription/success?exhibitor=${exhibitorData_result.id}`
      )
    } catch (error: any) {
      console.error('=== ERREUR INSCRIPTION ===')
      console.error('Type:', error?.constructor?.name)
      console.error('Message:', error?.message)
      console.error('Stack:', error?.stack)
      console.error('Error object:', error)
      
      const errorMessage = error?.message || 'Une erreur inattendue est survenue'
      alert(`❌ Erreur lors de l'inscription: ${errorMessage}`)
    } finally {
      setSubmitting(false)
    }
  }

  // ✅ Éviter le mismatch SSR/Client
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l&apos;événement...</p>
        </div>
      </div>
    )
  }

  const foireConfig = event?.foire_config || {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Inscription Exposant</h1>
          <p className="text-xl">{event?.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* STEPPER */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step: any, idx: number) => {
                const Icon = step.icon
                const isActive = idx === currentStep
                const isCompleted = idx < currentStep

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <span
                        className={`text-sm mt-2 font-semibold ${
                          isActive ? 'text-purple-600' : 'text-gray-600'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-4 transition ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* FORMULAIRE */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {currentStep === 0 && (
              <Step1CompanyInfo
                formData={formData}
                setFormData={setFormData}
                event={event}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {currentStep === 1 && (
              <Step2Activity
                formData={formData}
                setFormData={setFormData}
                event={event}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {currentStep === 2 && (
              <Step3BoothSelection
                formData={formData}
                setFormData={setFormData}
                event={event}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {currentStep === 3 && (
              <Step4Logo
                formData={formData}
                setFormData={setFormData}
                event={event}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {currentStep === 4 && (
              <Step5StaffMembers
                formData={formData}
                setFormData={setFormData}
                event={event}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}

            {currentStep === 5 && (
              <Step6Payment
                formData={formData}
                setFormData={setFormData}
                event={event}
                onSubmit={handleSubmit}
                onNext={handleNext}
                onPrev={handlePrev}
                submitting={submitting}
                params={params}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// ÉTAPE 1 : INFORMATIONS ENTREPRISE
// ============================================
function Step1CompanyInfo({ formData, setFormData, onNext }: StepProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.companyName || !formData.contactName || !formData.contactEmail) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Informations sur votre entreprise</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Nom de l&apos;entreprise <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Ex: TechSolutions Sénégal"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Description de votre activité <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Décrivez votre entreprise et vos produits/services..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Nom du contact <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Prénom Nom"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="contact@entreprise.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="+221 77 123 45 67"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Site web (optionnel)</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="https://www.entreprise.com"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Suivant
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
}

// ============================================
// ÉTAPE 2 : CATÉGORIE & ACTIVITÉ
// ============================================
function Step2Activity({ formData, setFormData, onNext, onPrev }: StepProps) {
  const [customTag, setCustomTag] = useState('')

  const categories = [
    'Agriculture & Alimentation',
    'Artisanat & Mode',
    'Technologie & Innovation',
    'Services & Finance',
    'Construction & BTP',
    'Santé & Bien-être',
    'Éducation & Formation',
    'Tourisme & Hôtellerie',
    'Commerce & Distribution',
    'Industrie & Manufacturing',
    'Autre',
  ]

  function addTag() {
    if (customTag && !formData.tags.includes(customTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, customTag],
      })
      setCustomTag('')
    }
  }

  function removeTag(tag: string) {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t: any) => t !== tag),
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.category) {
      alert('Veuillez sélectionner une catégorie')
      return
    }
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Votre secteur d&apos;activité</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-3">
            Catégorie principale <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  formData.category === cat
                    ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                {formData.category === cat && <Check className="h-5 w-5 float-right text-purple-600" />}
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">Mots-clés (optionnel)</label>
          <p className="text-sm text-gray-600 mb-3">
            Ajoutez des mots-clés pour aider les visiteurs à vous trouver
          </p>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: bio, équitable, made in Senegal..."
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Ajouter
            </button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag: any) => (
                <span
                  key={tag}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-purple-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition"
        >
          <ChevronLeft className="h-5 w-5" />
          Précédent
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Suivant
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
}

// ============================================
// ÉTAPE 3 : SÉLECTION STAND + OPTIONS (CORRIGÉ)
// ============================================
function Step3BoothSelection({ formData, setFormData, event, onNext, onPrev }: StepProps) {
  const foireConfig = event?.foire_config || {}
  const pavillons = foireConfig.pavillons || {}
  const tarification = foireConfig.tarification || {}
  
  const PRIX_M2 = tarification.prix_m2 || 50000
  const TVA_POURCENT = tarification.tva_pourcent || 18
  const TAILLES_DISPONIBLES = tarification.tailles_disponibles || [6, 9, 12, 15, 18]
  const OPTIONS_MEUBLES = tarification.options_meubles || {}

  const [customSize, setCustomSize] = useState('')
  const [showCustomSize, setShowCustomSize] = useState(false)

  // Grouper par type
  const pavillonsPrincipaux = Object.entries(pavillons).filter(
    ([_, p]: any) => p.type === 'pavillon_principal' || p.type === 'pavillon_international'
  )
  const esplanades = Object.entries(pavillons).filter(([_, p]: any) => p.type === 'esplanade')

  function selectPavillon(code: string, type: string) {
    console.log('Sélection pavillon:', code, type) // DEBUG
    
    // Mise à jour directe
    const updated = {
      ...formData,
      pavillonCode: code,
      pavillonType: type,
      standSize: 0,
      subtotalHT: 0,
      furnitureTotalHT: 0,
      totalHT: 0,
      tvaAmount: 0,
      totalTTC: 0,
    }
    
    setFormData(updated)
  }

  function selectStandSize(size: number) {
    console.log('Sélection taille:', size)
    
    const subtotalHT = size * PRIX_M2
    const furnitureTotalHT = Object.entries(formData.furnitureOptions).reduce((total, [key, qty]: [string, any]) => {
      const option = OPTIONS_MEUBLES[key]
      return total + (option?.prix_unitaire || 0) * qty
    }, 0)
    
    const totalHT = subtotalHT + furnitureTotalHT
    const tvaAmount = Math.round((totalHT * TVA_POURCENT) / 100)
    const totalTTC = totalHT + tvaAmount
    
    const updated = {
      ...formData,
      standSize: size,
      subtotalHT,
      furnitureTotalHT,
      totalHT,
      tvaAmount,
      totalTTC,
    }
    
    setFormData(updated)
    setShowCustomSize(false) // Fermer le champ personnalisé
  }

  function selectCustomSize() {
    const size = parseFloat(customSize)
    
    if (!size || size < 1) {
      alert('Veuillez saisir une surface valide (minimum 1 m²)')
      return
    }

    if (size > 1000) {
      const confirm = window.confirm(
        `Vous avez saisi ${size} m². Cette surface est très importante. Confirmez-vous ?`
      )
      if (!confirm) return
    }

    selectStandSize(size)
  }

  function updateFurnitureOption(optionKey: string, quantity: number) {
    console.log('Mise à jour meuble:', optionKey, quantity) // DEBUG
    
    const updatedFurniture = { ...formData.furnitureOptions }
    
    if (quantity === 0) {
      delete updatedFurniture[optionKey]
    } else {
      updatedFurniture[optionKey] = quantity
    }
    
    // Recalcul avec nouveaux meubles
    const subtotalHT = formData.standSize * PRIX_M2
    
    const furnitureTotalHT = Object.entries(updatedFurniture).reduce((total, [key, qty]: [string, any]) => {
      const option = OPTIONS_MEUBLES[key]
      return total + (option?.prix_unitaire || 0) * qty
    }, 0)
    
    const totalHT = subtotalHT + furnitureTotalHT
    const tvaAmount = Math.round((totalHT * TVA_POURCENT) / 100)
    const totalTTC = totalHT + tvaAmount
    
    const updated = {
      ...formData,
      furnitureOptions: updatedFurniture,
      furnitureTotalHT,
      totalHT,
      tvaAmount,
      totalTTC,
    }
    
    setFormData(updated)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    console.log('Validation:', formData.pavillonCode, formData.standSize) // DEBUG
    
    if (!formData.pavillonCode || !formData.standSize) {
      alert('Veuillez sélectionner un pavillon et une taille de stand')
      return
    }
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Configuration de votre stand</h2>

      {/* DEBUG INFO */}
      <div suppressHydrationWarning className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
        <strong>Debug:</strong> Pavillon: {formData.pavillonCode || 'Aucun'} | 
        Taille: {formData.standSize || 0} m² | 
        Total TTC: {new Intl.NumberFormat('fr-FR').format(formData.totalTTC || 0)} FCFA
      </div>

      {/* PAVILLONS PRINCIPAUX */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">1. Choisissez votre pavillon</h3>
        
        {pavillonsPrincipaux.length === 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            ⚠️ Aucun pavillon disponible. Vérifiez la configuration Supabase.
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pavillonsPrincipaux.map(([key, pavillon]: any) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                console.log('Click pavillon:', pavillon.code) // DEBUG
                selectPavillon(pavillon.code, 'pavillon_principal')
              }}
              className={`p-4 border-2 rounded-lg text-left transition ${
                formData.pavillonCode === pavillon.code
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-lg mb-1">{pavillon.nom}</div>
                  <div className="text-sm text-gray-600 mb-2">{pavillon.description}</div>
                  <div className="text-xs text-gray-500">
                    {pavillon.superficie} m² disponibles
                  </div>
                </div>
                {formData.pavillonCode === pavillon.code && (
                  <Check className="h-6 w-6 text-purple-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ESPLANADES */}
      {esplanades.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Ou choisissez une esplanade extérieure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {esplanades.map(([key, pavillon]: any) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  console.log('Click esplanade:', pavillon.code) // DEBUG
                  selectPavillon(pavillon.code, 'esplanade')
                }}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  formData.pavillonCode === pavillon.code
                    ? 'border-orange-600 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold mb-1">{pavillon.nom}</div>
                    <div className="text-sm text-gray-600 mb-2">{pavillon.description}</div>
                    <div className="text-xs text-gray-500">
                      {pavillon.superficie} m² disponibles
                    </div>
                  </div>
                  {formData.pavillonCode === pavillon.code && (
                    <Check className="h-6 w-6 text-orange-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAILLE STAND */}
      {formData.pavillonCode && (
        <>
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">2. Choisissez la taille de votre stand</h3>
            <div suppressHydrationWarning className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                💰 <strong>Tarif :</strong> {new Intl.NumberFormat('fr-FR').format(PRIX_M2)} FCFA / m² HT
                {' • '}TVA {TVA_POURCENT}%
              </p>
            </div>

            {/* Tailles standard */}
            {TAILLES_DISPONIBLES.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Tailles standard (les plus fréquentes)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {TAILLES_DISPONIBLES.map((size: number) => {
                    const prixHT = size * PRIX_M2
                    const prixTTC = prixHT + Math.round((prixHT * TVA_POURCENT) / 100)
                    
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          console.log('Click taille:', size)
                          selectStandSize(size)
                        }}
                        className={`p-6 border-2 rounded-lg transition ${
                          formData.standSize === size && !showCustomSize
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-300 hover:border-purple-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">📐</div>
                          <div className="font-bold text-2xl mb-1">{size} m²</div>
                          <div className="text-xs text-gray-500 mb-2">
                            Stand {size}m²
                          </div>
                          <div suppressHydrationWarning className="text-sm font-semibold text-purple-600">
                            {new Intl.NumberFormat('fr-FR').format(prixTTC)} FCFA
                          </div>
                          <div className="text-xs text-gray-500">TTC</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {TAILLES_DISPONIBLES.length === 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded mb-6">
                ⚠️ Aucune taille disponible. Vérifiez la configuration Supabase.
              </div>
            )}

            {/* Taille personnalisée */}
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 bg-orange-50">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">✏️</span>
                Taille personnalisée (1 à 500+ m²)
              </h4>
              
              {!showCustomSize ? (
                <button
                  type="button"
                  onClick={() => setShowCustomSize(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Choisir une taille personnalisée
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold mb-2">
                        Surface souhaitée (m²) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        step="0.5"
                        value={customSize}
                        onChange={(e) => setCustomSize(e.target.value)}
                        placeholder="Ex: 25, 50, 100..."
                        className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-lg font-semibold"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        type="button"
                        onClick={selectCustomSize}
                        disabled={!customSize}
                        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-semibold transition whitespace-nowrap"
                      >
                        Valider
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomSize(false)
                          setCustomSize('')
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>

                  {customSize && parseFloat(customSize) > 0 && (
                    <div className="bg-white border-2 border-orange-300 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-semibold">
                          Stand {customSize} m²
                        </span>
                        <span suppressHydrationWarning className="text-2xl font-bold text-orange-600">
                          {new Intl.NumberFormat('fr-FR').format(
                            parseFloat(customSize) * PRIX_M2 + 
                            Math.round((parseFloat(customSize) * PRIX_M2 * TVA_POURCENT) / 100)
                          )} FCFA
                        </span>
                      </div>
                      <div suppressHydrationWarning className="text-sm text-gray-600">
                        HT: {new Intl.NumberFormat('fr-FR').format(parseFloat(customSize) * PRIX_M2)} FCFA
                        {' • '}
                        TVA: {new Intl.NumberFormat('fr-FR').format(Math.round((parseFloat(customSize) * PRIX_M2 * TVA_POURCENT) / 100))} FCFA
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-600">
                    💡 <strong>Conseil :</strong> Les stands de grande taille (50+ m²) bénéficient souvent 
                    d&apos;emplacements premium. Notre équipe vous contactera pour optimiser votre emplacement.
                  </div>
                </div>
              )}
            </div>

            {/* Affichage si taille personnalisée sélectionnée */}
            {formData.standSize > 0 && !TAILLES_DISPONIBLES.includes(formData.standSize) && !showCustomSize && (
              <div className="mt-4 bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-green-900 text-lg">
                      ✅ Stand personnalisé : {formData.standSize} m²
                    </p>
                    <p suppressHydrationWarning className="text-sm text-green-700">
                      Total TTC : {new Intl.NumberFormat('fr-FR').format(formData.subtotalHT + formData.tvaAmount)} FCFA
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomSize(true)
                      setCustomSize(formData.standSize.toString())
                    }}
                    className="text-orange-600 hover:text-orange-700 font-semibold underline"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* OPTIONS MEUBLES */}
          {formData.standSize > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">3. Options et équipements (optionnel)</h3>
              <p className="text-gray-600 mb-4">
                Complétez votre stand avec nos équipements professionnels
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(OPTIONS_MEUBLES).map(([key, option]: any) => {
                  const quantity = formData.furnitureOptions[key] || 0
                  
                  return (
                    <div
                      key={key}
                      className="border-2 border-gray-300 rounded-lg p-4 hover:border-purple-300 transition"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">🪑</div>
                        <div className="flex-1">
                          <h4 className="font-bold mb-1">{option.nom}</h4>
                          <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                          <div className="text-lg font-bold text-purple-600 mb-3">
                            <span suppressHydrationWarning>{new Intl.NumberFormat('fr-FR').format(option.prix_unitaire)} FCFA</span>
                            <span className="text-sm text-gray-500"> / unité</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => updateFurnitureOption(key, Math.max(0, quantity - 1))}
                              disabled={quantity === 0}
                              className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 p-2 rounded-lg transition"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-xl font-bold w-12 text-center">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateFurnitureOption(key, Math.min(option.quantite_max, quantity + 1))}
                              disabled={quantity >= option.quantite_max}
                              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-2 rounded-lg transition"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <span className="text-sm text-gray-500">
                              (max {option.quantite_max})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* RÉCAPITULATIF */}
          {formData.standSize > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Récapitulatif</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Stand {formData.standSize} m² (HT)</span>
                  <span suppressHydrationWarning className="font-semibold">
                    {new Intl.NumberFormat('fr-FR').format(formData.subtotalHT)} FCFA
                  </span>
                </div>

                {Object.entries(formData.furnitureOptions).length > 0 && (
                  <>
                    <div className="text-sm text-gray-600 font-semibold mt-3 mb-2">
                      Options et équipements :
                    </div>
                    {Object.entries(formData.furnitureOptions).map(([key, qty]: [string, any]) => {
                      const option = OPTIONS_MEUBLES[key]
                      return (
                        <div key={key} className="flex justify-between text-sm text-gray-600 pl-4">
                          <span>
                            {option.nom} x {qty}
                          </span>
                          <span suppressHydrationWarning>
                            {new Intl.NumberFormat('fr-FR').format(option.prix_unitaire * qty)} FCFA
                          </span>
                        </div>
                      )
                    })}
                    <div className="flex justify-between text-gray-700 pt-2">
                      <span>Sous-total options (HT)</span>
                      <span suppressHydrationWarning className="font-semibold">
                        {new Intl.NumberFormat('fr-FR').format(formData.furnitureTotalHT)} FCFA
                      </span>
                    </div>
                  </>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Total HT</span>
                    <span suppressHydrationWarning className="font-semibold">
                      {new Intl.NumberFormat('fr-FR').format(formData.totalHT)} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>TVA ({TVA_POURCENT}%)</span>
                    <span suppressHydrationWarning>
                      {new Intl.NumberFormat('fr-FR').format(formData.tvaAmount)} FCFA
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total TTC</span>
                    <span suppressHydrationWarning className="text-3xl font-bold text-purple-600">
                      {new Intl.NumberFormat('fr-FR').format(formData.totalTTC)} FCFA
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 text-sm text-gray-600">
                ✅ Stand équipé inclus : cloisons, éclairage de base, prise électrique
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition"
        >
          <ChevronLeft className="h-5 w-5" />
          Précédent
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Suivant
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
}

// ============================================
// ÉTAPE 4 : UPLOAD LOGO (AMÉLIORÉ)
// ============================================
function Step4Logo({ formData, setFormData, onNext, onPrev }: StepProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  function handleLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 2MB')
      return
    }

    setLogoFile(file)

    // Créer preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({ ...formData, logoUrl: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  function handleBannerSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 3MB')
      return
    }

    setBannerFile(file)

    // Créer preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({ ...formData, bannerUrl: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  function removeLogo() {
    setLogoFile(null)
    setFormData({ ...formData, logoUrl: '' })
  }

  function removeBanner() {
    setBannerFile(null)
    setFormData({ ...formData, bannerUrl: '' })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Logo optionnel, peut continuer sans
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Visuels de votre entreprise</h2>

      <p className="text-gray-600 mb-8">
        Ajoutez le logo et la bannière de votre entreprise pour améliorer votre visibilité dans le catalogue.
        Ces éléments sont optionnels mais fortement recommandés.
      </p>

      <div className="space-y-8">
        {/* LOGO */}
        <div>
          <label className="block text-lg font-semibold mb-4">
            Logo de l&apos;entreprise
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preview */}
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 flex items-center justify-center min-h-[280px]">
                {formData.logoUrl ? (
                  <div className="relative group">
                    <img
                      src={formData.logoUrl}
                      alt="Logo"
                      className="max-w-full max-h-64 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun logo sélectionné</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload */}
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 mb-2">
                    <strong>📋 Recommandations :</strong>
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Format : PNG avec fond transparent (idéal)</li>
                    <li>• Dimensions : 400 x 400 px minimum</li>
                    <li>• Taille max : 2 MB</li>
                    <li>• Ratio : Carré ou paysage</li>
                  </ul>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                  onChange={handleLogoSelect}
                />

                <label
                  htmlFor="logo-upload"
                  className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg font-semibold cursor-pointer transition"
                >
                  <Upload className="h-5 w-5" />
                  {formData.logoUrl ? 'Changer le logo' : 'Choisir un logo'}
                </label>

                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="w-full text-red-600 hover:text-red-700 font-semibold py-2"
                  >
                    Supprimer le logo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SÉPARATEUR */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* BANNIÈRE */}
        <div>
          <label className="block text-lg font-semibold mb-4">
            Bannière (optionnel)
          </label>

          <div className="grid grid-cols-1 gap-6">
            {/* Preview */}
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 min-h-[200px] flex items-center justify-center">
                {formData.bannerUrl ? (
                  <div className="relative group w-full">
                    <img
                      src={formData.bannerUrl}
                      alt="Bannière"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeBanner}
                      className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune bannière sélectionnée</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 mb-2">
                  <strong>📋 Recommandations :</strong>
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Format : JPG ou PNG</li>
                  <li>• Dimensions : 1200 x 400 px</li>
                  <li>• Taille max : 3 MB</li>
                  <li>• Ratio : Paysage (3:1)</li>
                </ul>
              </div>

              <div className="flex flex-col justify-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="banner-upload"
                  onChange={handleBannerSelect}
                />

                <label
                  htmlFor="banner-upload"
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg font-semibold cursor-pointer transition"
                >
                  <Upload className="h-5 w-5" />
                  {formData.bannerUrl ? 'Changer la bannière' : 'Choisir une bannière'}
                </label>

                {formData.bannerUrl && (
                  <button
                    type="button"
                    onClick={removeBanner}
                    className="w-full text-red-600 hover:text-red-700 font-semibold py-2 mt-2"
                  >
                    Supprimer la bannière
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          💡 <strong>Conseil :</strong> Un logo et une bannière de qualité améliorent significativement 
          votre visibilité dans le catalogue des exposants et sur votre page dédiée.
        </p>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition"
        >
          <ChevronLeft className="h-5 w-5" />
          Précédent
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Suivant
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
}

// ============================================
// ÉTAPE 5 : EXPOSANTS / STAFF
// ============================================
function Step5StaffMembers({ formData, setFormData, onNext, onPrev }: StepProps) {
  const [currentStaffIndex, setCurrentStaffIndex] = useState(0)

  // Initialiser les membres si vide
  useEffect(() => {
    if (formData.staffMembers.length === 0) {
      const initialStaff: StaffFormData[] = Array.from(
        { length: formData.numberOfStaff },
        () => ({
          firstName: '',
          lastName: '',
          function: '',
          email: '',
          phone: '',
          photo: null,
          photoPreview: null,
        })
      )
      setFormData({ ...formData, staffMembers: initialStaff })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function updateStaffMember(index: number, field: keyof StaffFormData, value: any) {
    const updated = [...formData.staffMembers]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, staffMembers: updated })
  }

  function handlePhotoUpload(index: number, file: File) {
    const reader = new FileReader()
    reader.onloadend = () => {
      updateStaffMember(index, 'photo', file)
      updateStaffMember(index, 'photoPreview', reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  function addStaffMember() {
    setFormData({
      ...formData,
      numberOfStaff: formData.numberOfStaff + 1,
      staffMembers: [
        ...formData.staffMembers,
        {
          firstName: '',
          lastName: '',
          function: '',
          email: '',
          phone: '',
          photo: null,
          photoPreview: null,
        },
      ],
    })
    setCurrentStaffIndex(formData.staffMembers.length)
  }

  function removeStaffMember(index: number) {
    if (formData.staffMembers.length <= 1) {
      alert('Vous devez avoir au moins un exposant')
      return
    }
    const updated = formData.staffMembers.filter((_: any, i: number) => i !== index)
    setFormData({
      ...formData,
      numberOfStaff: formData.numberOfStaff - 1,
      staffMembers: updated,
    })
    if (currentStaffIndex >= updated.length) {
      setCurrentStaffIndex(updated.length - 1)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validation : au moins un exposant avec nom/prénom
    const hasValidStaff = formData.staffMembers.some(
      (s: any) => s.firstName && s.lastName
    )

    if (!hasValidStaff) {
      alert('Veuillez renseigner au moins un exposant avec nom et prénom')
      return
    }

    onNext()
  }

  const currentStaff = formData.staffMembers[currentStaffIndex]

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Vos exposants</h2>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Renseignez les informations de chaque personne qui représentera votre entreprise.
          Ces informations serviront à l&apos;édition des badges.
        </p>

        {/* Navigation entre exposants */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {formData.staffMembers.map((staff: any, idx: number) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStaffIndex(idx)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                idx === currentStaffIndex
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Exposant {idx + 1}
              {staff.firstName && staff.lastName && (
                <span className="ml-2 text-xs">
                  ({staff.firstName} {staff.lastName})
                </span>
              )}
            </button>
          ))}

          <button
            type="button"
            onClick={addStaffMember}
            className="px-4 py-2 rounded-lg font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition whitespace-nowrap"
          >
            + Ajouter
          </button>
        </div>
      </div>

      {currentStaff && (
        <div className="space-y-6">
          {/* Photo badge */}
          <div className="text-center">
            <label className="block text-sm font-semibold mb-3">
              Photo pour le badge <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-col items-center">
              {currentStaff.photoPreview ? (
                <div className="relative">
                  <img
                    src={currentStaff.photoPreview}
                    alt="Photo badge"
                    className="w-32 h-32 object-cover rounded-lg border-4 border-purple-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateStaffMember(currentStaffIndex, 'photo', null)
                      updateStaffMember(currentStaffIndex, 'photoPreview', null)
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                id={`photo-${currentStaffIndex}`}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handlePhotoUpload(currentStaffIndex, file)
                }}
              />
              <label
                htmlFor={`photo-${currentStaffIndex}`}
                className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer transition"
              >
                {currentStaff.photoPreview ? 'Changer la photo' : 'Ajouter une photo'}
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Format portrait • Fond uni recommandé
              </p>
            </div>
          </div>

          {/* Informations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={currentStaff.firstName}
                onChange={(e) =>
                  updateStaffMember(currentStaffIndex, 'firstName', e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={currentStaff.lastName}
                onChange={(e) =>
                  updateStaffMember(currentStaffIndex, 'lastName', e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Fonction <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={currentStaff.function}
                onChange={(e) =>
                  updateStaffMember(currentStaffIndex, 'function', e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: Directeur Commercial"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={currentStaff.email}
                onChange={(e) =>
                  updateStaffMember(currentStaffIndex, 'email', e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Téléphone</label>
              <input
                type="tel"
                value={currentStaff.phone}
                onChange={(e) =>
                  updateStaffMember(currentStaffIndex, 'phone', e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Supprimer cet exposant */}
          {formData.staffMembers.length > 1 && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => removeStaffMember(currentStaffIndex)}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Supprimer cet exposant
              </button>
            </div>
          )}
        </div>
      )}

      {/* Compteur */}
      <div className="mt-8 p-4 bg-purple-50 rounded-lg text-center">
        <p className="text-purple-900 font-semibold">
          {formData.staffMembers.filter((s: any) => s.firstName && s.lastName).length} /{' '}
          {formData.staffMembers.length} exposant(s) renseigné(s)
        </p>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition"
        >
          <ChevronLeft className="h-5 w-5" />
          Précédent
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Suivant
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
}

// ============================================
// ÉTAPE 6 : PAIEMENT (AVEC COMPTANT)
// ============================================
function Step6Payment({
  formData,
  onPrev,
  onSubmit,
  submitting,
  event,
  params,
}: StepProps & { 
  onSubmit: (paymentMethod: string) => Promise<void>
  submitting: boolean
  params: { locale: string; slug: string; eventSlug: string }
}) {
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [processingPayment, setProcessingPayment] = useState(false)
  const router = useRouter()
  
  const foireConfig = event?.foire_config || {}
  const pavillon = Object.values(foireConfig.pavillons || {}).find(
    (p: any) => p.code === formData.pavillonCode
  ) as any

  async function handleFinalSubmit() {
    if (!paymentMethod) {
      alert('Veuillez sélectionner un mode de paiement')
      return
    }

    // Pour Wave/mobile : créer d'abord l'exhibitor, puis initier le paiement
    if (paymentMethod === 'mobile' || paymentMethod === 'wave') {
      await handleWavePayment()
      return
    }

    // Pour les autres modes (transfer, cash) : créer directement l'exhibitor
    await onSubmit(paymentMethod)
  }

  /**
   * Gère le paiement Wave
   * 1. Crée l'exhibitor avec status='pending' et payment_status='unpaid'
   * 2. Crée les staff members
   * 3. Initie le paiement Wave
   * 4. Redirige vers Wave
   */
  async function handleWavePayment() {
    setProcessingPayment(true)

    try {
      const supabase = createSupabaseBrowserClient()
      
      // 1. Générer slug unique
      const baseSlug = formData.companyName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50)
      const timestamp = Date.now()
      const slug = `${baseSlug}-${timestamp}`

      // 2. Créer l'exhibitor
      const exhibitorData = {
        event_id: eventData.id,
        organization_id: eventData.organization_id,
        company_name: formData.companyName,
        slug: slug,
        description: formData.description || null,
        logo_url: formData.logoUrl || null,
        banner_url: formData.bannerUrl || null,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        website: formData.website || null,
        booth_location: formData.pavillonCode,
        category: formData.category || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        approval_status: 'pending',
        status: 'pending', // Maintenir pour compatibilité
        payment_status: 'unpaid',
        payment_method: 'wave',
        payment_amount: formData.totalTTC,
        currency: 'FCFA',
        // Stocker les détails dans metadata pour la génération de facture
        metadata: {
          standSize: formData.standSize,
          pavillonCode: formData.pavillonCode,
          furnitureOptions: formData.furnitureOptions,
          subtotalHT: formData.subtotalHT,
          furnitureTotalHT: formData.furnitureTotalHT,
          totalHT: formData.totalHT,
          tvaAmount: formData.tvaAmount,
          totalTTC: formData.totalTTC,
        },
      }

      const { data: exhibitor, error: exhibitorError } = await (supabase
        .from('exhibitors') as any)
        .insert([exhibitorData])
        .select()
        .single()

      if (exhibitorError) {
        throw new Error(`Erreur lors de la création de l'exposant: ${exhibitorError.message}`)
      }

      const exhibitorData_result2 = exhibitor as any
      console.log('✅ Exposant créé:', exhibitorData_result2.id)

      // 3. Générer la facture PDF automatiquement via API (en arrière-plan, non bloquant)
      let invoiceUrl: string | undefined
      try {
        const response = await fetch(
          `/api/foires/${params.eventSlug}/invoices/${exhibitorData_result2.id}`,
          { method: 'POST' }
        )
        
        if (response.ok) {
          const result = await response.json()
          invoiceUrl = result.invoiceUrl
          console.log(`✅ Facture générée: ${result.invoiceNumber}`)
        } else {
          console.warn('⚠️ Erreur génération facture (non bloquant):', await response.text())
        }
      } catch (invoiceError) {
        console.warn('⚠️ Erreur génération facture (non bloquant):', invoiceError)
        // Continue même si la facture échoue
      }

      // 4. Envoyer email de confirmation avec facture (en arrière-plan, non bloquant)
      try {
        const { sendExhibitorConfirmationEmail } = await import('@/lib/services/email/templates')
        const foireConfig = event?.foire_config || {}
        const pavillons = foireConfig.pavillons || {}
        const pavillon = Object.values(pavillons).find(
          (p: any) => p.code === formData.pavillonCode
        ) as any

        // Construire l'URL de la facture (utiliser celle générée ou fallback vers endpoint API)
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || '')
        const invoiceApiUrl = invoiceUrl || `${baseUrl}/api/foires/${params.eventSlug}/invoices/${exhibitor.id}`

        await sendExhibitorConfirmationEmail({
          to: formData.contactEmail,
          exhibitorName: formData.contactName,
          companyName: formData.companyName,
          standNumber: exhibitor.booth_number || null,
          pavilionName: pavillon?.nom || formData.pavillonCode || 'Non assigné',
          surfaceArea: formData.standSize,
          totalPrice: formData.totalTTC,
          invoiceUrl: invoiceApiUrl,
        })
        console.log('✅ Email de confirmation avec facture envoyé')
      } catch (emailError) {
        console.warn('⚠️ Erreur envoi email (non bloquant):', emailError)
        // Continue même si l'email échoue
      }

      // 4. Créer les staff members
      const validStaff = formData.staffMembers.filter(
        (s: StaffFormData) => s.firstName && s.lastName
      )

      if (validStaff.length > 0) {
        const staffInserts = validStaff.map((staff: StaffFormData, index: number) => ({
          exhibitor_id: exhibitorData_result2.id,
          first_name: staff.firstName,
          last_name: staff.lastName,
          function: staff.function || '',
          email: staff.email || null,
          phone: staff.phone || null,
          badge_photo_url: staff.photoPreview || null,
          badge_id: `BADGE-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 11)}`,
          access_level: 'exhibitor',
          is_primary_contact: index === 0,
        }))

        const { error: staffError } = await (supabase
          .from('exhibitor_staff') as any)
          .insert(staffInserts)

        if (staffError) {
          console.warn('⚠️ Erreur création staff (non bloquant):', staffError)
        } else {
          console.log('✅ Staff créé avec succès')
        }
      }

      // 4. Créer le paiement Wave
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const paymentData: WavePaymentRequest = {
        amount: Math.round(formData.totalTTC), // Wave attend un entier
        currency: 'XOF',
        success_url: `${baseUrl}/${params.locale}/org/${params.slug}/foires/${params.eventSlug}/inscription/success?exhibitor=${exhibitorData_result2.id}&payment=wave`,
        error_url: `${baseUrl}/${params.locale}/org/${params.slug}/foires/${params.eventSlug}/inscription/error?exhibitor=${exhibitorData_result2.id}`,
        metadata: {
          exhibitor_id: exhibitorData_result2.id,
          event_id: eventData.id,
          organization_id: eventData.organization_id,
          company_name: formData.companyName,
          contact_email: formData.contactEmail,
        },
      }

      // Appeler l'endpoint API pour créer le paiement Wave (côté serveur)
      const response = await fetch(`/api/foires/${params.eventSlug}/payments/wave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`)
      }

      const payment = await response.json()

      // 5. Mettre à jour l'exhibitor avec la référence de paiement
      await (supabase
        .from('exhibitors') as any)
        .update({
          payment_reference: payment.id,
        })
        .eq('id', exhibitor.id)

      // 6. Rediriger vers Wave
      if (payment.wave_launch_url) {
        window.location.href = payment.wave_launch_url
      } else {
        throw new Error('URL de paiement Wave non reçue')
      }
    } catch (error: any) {
      console.error('Erreur paiement Wave:', error)
      alert(`❌ Erreur lors de l'initiation du paiement: ${error.message}`)
      setProcessingPayment(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Récapitulatif et paiement</h2>

      {/* RÉCAPITULATIF */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-lg mb-4">Votre inscription</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Entreprise</span>
            <span className="font-semibold">{formData.companyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Catégorie</span>
            <span className="font-semibold">{formData.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pavillon</span>
            <span className="font-semibold">{pavillon?.nom || formData.pavillonCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Taille du stand</span>
            <span className="font-semibold">{formData.standSize} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nombre d&apos;exposants</span>
            <span className="font-semibold">
              {formData.staffMembers.filter((s: any) => s.firstName && s.lastName).length} personne(s)
            </span>
          </div>

          {/* Détail prix */}
          {formData.totalHT > 0 && (
            <>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-gray-700">
                  <span>Total HT</span>
                  <span suppressHydrationWarning className="font-semibold">
                    {new Intl.NumberFormat('fr-FR').format(formData.totalHT)} FCFA
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>TVA (18%)</span>
                  <span suppressHydrationWarning>
                    {new Intl.NumberFormat('fr-FR').format(formData.tvaAmount)} FCFA
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total TTC</span>
            <span suppressHydrationWarning className="text-3xl font-bold text-purple-600">
              {new Intl.NumberFormat('fr-FR').format(formData.totalTTC || 0)} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* OPTIONS PAIEMENT */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4">Mode de paiement</h3>
        <div className="space-y-3">
          {/* Paiement en ligne */}
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`w-full p-5 border-2 rounded-lg transition text-left ${
              paymentMethod === 'card'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-300 hover:border-purple-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">💳</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg">Carte bancaire</span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                    Instantané
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Paiement sécurisé par carte bancaire • Validation immédiate
                </p>
              </div>
              {paymentMethod === 'card' && (
                <Check className="h-6 w-6 text-purple-600 flex-shrink-0" />
              )}
            </div>
          </button>

          {/* Wave / Orange Money */}
          <button
            type="button"
            onClick={() => setPaymentMethod('mobile')}
            className={`w-full p-5 border-2 rounded-lg transition text-left ${
              paymentMethod === 'mobile'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-300 hover:border-purple-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">📱</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg">Wave / Orange Money</span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                    Instantané
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Paiement par mobile money • Validation en quelques minutes
                </p>
              </div>
              {paymentMethod === 'mobile' && (
                <Check className="h-6 w-6 text-purple-600 flex-shrink-0" />
              )}
            </div>
          </button>

          {/* Virement bancaire */}
          <button
            type="button"
            onClick={() => setPaymentMethod('transfer')}
            className={`w-full p-5 border-2 rounded-lg transition text-left ${
              paymentMethod === 'transfer'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-300 hover:border-purple-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">🏦</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg">Virement bancaire</span>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">
                    2-3 jours
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Sur facture pro forma • Validation après réception du paiement
                </p>
              </div>
              {paymentMethod === 'transfer' && (
                <Check className="h-6 w-6 text-purple-600 flex-shrink-0" />
              )}
            </div>
          </button>

          {/* RÈGLEMENT AU COMPTANT - NOUVEAU */}
          <button
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`w-full p-5 border-2 rounded-lg transition text-left ${
              paymentMethod === 'cash'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-300 hover:border-purple-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">💵</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg">Règlement au comptant</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                    Sur place
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Paiement en espèces ou par chèque dans nos bureaux • RDV requis
                </p>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900 font-semibold mb-1">
                    📍 Adresse de paiement :
                  </p>
                  <p className="text-sm text-blue-800">
                    {foireConfig.lieu || 'CICES - Centre International du Commerce Extérieur'}
                  </p>
                  <p className="text-sm text-blue-800">
                    {foireConfig.adresse || 'Route de l\'Aéroport, VDN, Dakar'}
                  </p>
                  <p className="text-sm text-blue-800 mt-2">
                    <strong>Horaires :</strong> Lundi-Vendredi, 9h-17h
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Contact :</strong> {foireConfig.contact?.telephone || '+221 77 539 81 39'}
                  </p>
                </div>
              </div>
              {paymentMethod === 'cash' && (
                <Check className="h-6 w-6 text-purple-600 flex-shrink-0" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* INFO SELON MODE */}
      {paymentMethod === 'cash' && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            ⚠️ <strong>Important :</strong> Après validation de votre inscription, vous recevrez 
            un email avec les instructions détaillées pour effectuer votre règlement au comptant. 
            Votre stand sera réservé pendant 48h.
          </p>
        </div>
      )}

      {paymentMethod === 'transfer' && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            ℹ️ <strong>Note :</strong> Vous recevrez une facture pro forma par email avec les 
            coordonnées bancaires pour effectuer le virement.
          </p>
        </div>
      )}

      {(paymentMethod === 'card' || paymentMethod === 'mobile') && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-900">
            ✅ <strong>Validation immédiate :</strong> Votre inscription sera confirmée dès réception 
            du paiement (quelques minutes maximum).
          </p>
        </div>
      )}

      {/* CONDITIONS */}
      <div className="mb-8">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-1 h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700">
            J&apos;accepte les{' '}
            <a href="#" className="text-purple-600 hover:underline">
              conditions générales de vente
            </a>{' '}
            et le{' '}
            <a href="#" className="text-purple-600 hover:underline">
              règlement de la foire
            </a>
          </span>
        </label>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={submitting}
          className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 disabled:opacity-50 text-gray-700 px-8 py-3 rounded-lg font-semibold transition"
        >
          <ChevronLeft className="h-5 w-5" />
          Précédent
        </button>
        <button
          type="button"
          onClick={handleFinalSubmit}
          disabled={submitting || !paymentMethod}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-12 py-4 rounded-lg font-bold text-lg transition"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Inscription en cours...
            </>
          ) : (
            'Confirmer mon inscription'
          )}
        </button>
      </div>
    </div>
  )
}
