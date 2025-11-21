'use client'

import { useState, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from '@/lib/utils/next-intl-fallback'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { slugify, isValidEmail } from '@/lib/utils'
import type { ExhibitorStatus } from '@/types/exhibitor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Check, Building2 } from 'lucide-react'
import { toast } from 'sonner'

// Constants
const EXHIBITOR_CATEGORIES = [
  { value: 'tech', labelKey: 'categories.tech' },
  { value: 'finance', labelKey: 'categories.finance' },
  { value: 'retail', labelKey: 'categories.retail' },
  { value: 'food', labelKey: 'categories.food' },
  { value: 'fashion', labelKey: 'categories.fashion' },
  { value: 'health', labelKey: 'categories.health' },
  { value: 'education', labelKey: 'categories.education' },
  { value: 'services', labelKey: 'categories.services' },
  { value: 'other', labelKey: 'categories.other' }
] as const

const EXHIBITOR_STATUSES: ExhibitorStatus[] = ['pending', 'approved', 'active', 'rejected']

// Zod schemas
const exhibitorFormSchema = z.object({
  company_name: z.string().min(1, 'companyNameRequired'),
  slug: z.string(),
  contact_name: z.string().min(1, 'contactNameRequired'),
  contact_email: z.string().email('invalidEmail'),
  contact_phone: z.string().optional(),
  category: z.string().min(1, 'categoryRequired'),
  booth_number: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url('invalidUrl').optional().or(z.literal('')),
  logo_url: z.string().optional(),
  status: z.enum(['pending', 'approved', 'active', 'rejected'])
})

type ExhibitorFormData = z.infer<typeof exhibitorFormSchema>

interface Step {
  number: number
  titleKey: string
}

const STEPS: Step[] = [
  { number: 1, titleKey: 'steps.companyInfo' },
  { number: 2, titleKey: 'steps.contactInfo' },
  { number: 3, titleKey: 'steps.review' }
]

export default function NewExhibitorPage() {
  const params = useParams()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('badgeEditor.exhibitors.new')
  const tCommon = useTranslations('common')
  const tCategories = useTranslations('badgeEditor.exhibitors.categories')
  const tStatuses = useTranslations('badgeEditor.exhibitors.statuses')
  const tErrors = useTranslations('badgeEditor.exhibitors.errors')

  const eventId = params.eventId as string

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof ExhibitorFormData, string>>>({})

  const [formData, setFormData] = useState<ExhibitorFormData>({
    company_name: '',
    slug: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    category: 'other',
    booth_number: '',
    description: '',
    website: '',
    logo_url: '',
    status: 'pending'
  })

  const updateField = useCallback((field: keyof ExhibitorFormData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-generate slug when company name changes
      if (field === 'company_name' && value.trim()) {
        const baseSlug = slugify(value)
        const timestamp = Date.now()
        updated.slug = `${baseSlug}-${timestamp}`
      }

      return updated
    })

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }, [validationErrors])

  const validateStep1 = useCallback((): boolean => {
    const errors: Partial<Record<keyof ExhibitorFormData, string>> = {}

    if (!formData.company_name.trim()) {
      errors.company_name = tErrors('companyNameRequired')
    }
    if (!formData.category) {
      errors.category = tErrors('categoryRequired')
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData.company_name, formData.category, tErrors])

  const validateStep2 = useCallback((): boolean => {
    const errors: Partial<Record<keyof ExhibitorFormData, string>> = {}

    if (!formData.contact_name.trim()) {
      errors.contact_name = tErrors('contactNameRequired')
    }
    if (!formData.contact_email.trim()) {
      errors.contact_email = tErrors('contactEmailRequired')
    } else if (!isValidEmail(formData.contact_email)) {
      errors.contact_email = tErrors('invalidEmail')
    }
    if (formData.website && formData.website.trim()) {
      try {
        new URL(formData.website)
      } catch {
        errors.website = tErrors('invalidUrl')
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData.contact_name, formData.contact_email, formData.website, tErrors])

  const handleNext = useCallback(() => {
    if (currentStep === 1 && !validateStep1()) {
      toast.error(tErrors('validationFailed'))
      return
    }
    if (currentStep === 2 && !validateStep2()) {
      toast.error(tErrors('validationFailed'))
      return
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
  }, [currentStep, validateStep1, validateStep2, tErrors])

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }, [])

  const handleSubmit = useCallback(async () => {
    // Validate all steps
    if (!validateStep1() || !validateStep2()) {
      toast.error(tErrors('validationFailed'))
      return
    }

    // Final Zod validation
    const validationResult = exhibitorFormSchema.safeParse(formData)
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors
      const translatedErrors: Partial<Record<keyof ExhibitorFormData, string>> = {}
      
      Object.entries(errors).forEach(([field, messages]) => {
        if (messages && messages[0]) {
          translatedErrors[field as keyof ExhibitorFormData] = tErrors(messages[0] as string) || messages[0]
        }
      })
      
      setValidationErrors(translatedErrors)
      toast.error(tErrors('validationFailed'))
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        toast.error(tErrors('mustBeLoggedIn'))
        setIsSubmitting(false)
        return
      }

      const { data: membership, error: membershipError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

      if (membershipError || !membership) {
        toast.error(tErrors('organizationNotFound'))
        setIsSubmitting(false)
        return
      }

      const organizationId = (membership as { organization_id: string }).organization_id

      const exhibitorData = {
        event_id: eventId,
        organization_id: organizationId,
        company_name: formData.company_name.trim(),
        slug: formData.slug,
        contact_name: formData.contact_name.trim(),
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone?.trim() || null,
        category: formData.category,
        booth_number: formData.booth_number?.trim() || null,
        description: formData.description?.trim() || null,
        website: formData.website?.trim() || null,
        logo_url: formData.logo_url?.trim() || null,
        status: formData.status
      }

      const { data: exhibitor, error: exhibitorError } = await supabase
        .from('exhibitors')
        .insert([exhibitorData] as any)
        .select()
        .single()

      if (exhibitorError) {
        console.error('Exhibitor creation error:', exhibitorError)
        toast.error(tErrors('creationFailed'))
        setIsSubmitting(false)
        return
      }

      toast.success(t('success'))
      router.push(`/${locale}/badge-editor/events/${eventId}/exhibitors`)
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error(tErrors('unexpectedError'))
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, eventId, locale, router, validateStep1, validateStep2, t, tErrors])

  const stepTitle = useMemo(() => {
    if (currentStep === 1) return t('stepTitles.companyInfo')
    if (currentStep === 2) return t('stepTitles.contactInfo')
    return t('stepTitles.review')
  }, [currentStep, t])

  const categoryLabel = useMemo(() => {
    const category = EXHIBITOR_CATEGORIES.find((cat) => cat.value === formData.category)
    return category ? tCategories(category.labelKey.split('.')[1]) : ''
  }, [formData.category, tCategories])

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {tCommon('back')}
        </Button>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-gray-600 mt-1">{t('subtitle')}</p>
      </div>

      <div className="flex items-center justify-center mb-8">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                currentStep >= step.number
                  ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
            </div>
            <div className="ml-2 text-sm font-medium">{t(step.titleKey)}</div>
            {index < STEPS.length - 1 && <div className="w-16 h-0.5 mx-4 bg-gray-200" />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{stepTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="company_name">
                  {t('fields.companyName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  placeholder={t('placeholders.companyName')}
                  required
                  aria-invalid={!!validationErrors.company_name}
                  aria-describedby={validationErrors.company_name ? 'company_name-error' : undefined}
                />
                {validationErrors.company_name && (
                  <p id="company_name-error" className="text-sm text-red-500 mt-1">
                    {validationErrors.company_name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">
                  {t('fields.category')} <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXHIBITOR_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {tCategories(category.labelKey.split('.')[1])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.category && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.category}</p>
                )}
              </div>

              <div>
                <Label htmlFor="booth_number">{t('fields.boothNumber')}</Label>
                <Input
                  id="booth_number"
                  value={formData.booth_number}
                  onChange={(e) => updateField('booth_number', e.target.value)}
                  placeholder={t('placeholders.boothNumber')}
                />
              </div>

              <div>
                <Label htmlFor="description">{t('fields.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder={t('placeholders.description')}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="website">{t('fields.website')}</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder={t('placeholders.website')}
                  aria-invalid={!!validationErrors.website}
                  aria-describedby={validationErrors.website ? 'website-error' : undefined}
                />
                {validationErrors.website && (
                  <p id="website-error" className="text-sm text-red-500 mt-1">
                    {validationErrors.website}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="contact_name">
                  {t('fields.contactName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => updateField('contact_name', e.target.value)}
                  placeholder={t('placeholders.contactName')}
                  required
                  aria-invalid={!!validationErrors.contact_name}
                  aria-describedby={validationErrors.contact_name ? 'contact_name-error' : undefined}
                />
                {validationErrors.contact_name && (
                  <p id="contact_name-error" className="text-sm text-red-500 mt-1">
                    {validationErrors.contact_name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contact_email">
                  {t('fields.contactEmail')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  placeholder={t('placeholders.contactEmail')}
                  required
                  aria-invalid={!!validationErrors.contact_email}
                  aria-describedby={validationErrors.contact_email ? 'contact_email-error' : undefined}
                />
                {validationErrors.contact_email && (
                  <p id="contact_email-error" className="text-sm text-red-500 mt-1">
                    {validationErrors.contact_email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contact_phone">{t('fields.contactPhone')}</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => updateField('contact_phone', e.target.value)}
                  placeholder={t('placeholders.contactPhone')}
                />
              </div>

              <div>
                <Label htmlFor="status">{t('fields.status')}</Label>
                <Select value={formData.status} onValueChange={(value) => updateField('status', value as ExhibitorStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXHIBITOR_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {tStatuses(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="text-lg font-semibold">{formData.company_name}</h3>
                    <p className="text-sm text-gray-600">{categoryLabel}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{t('review.contact')}:</span>
                    <p className="font-medium">{formData.contact_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">{t('review.email')}:</span>
                    <p className="font-medium">{formData.contact_email}</p>
                  </div>
                  {formData.contact_phone && (
                    <div>
                      <span className="text-gray-600">{t('review.phone')}:</span>
                      <p className="font-medium">{formData.contact_phone}</p>
                    </div>
                  )}
                  {formData.booth_number && (
                    <div>
                      <span className="text-gray-600">{t('review.booth')}:</span>
                      <p className="font-medium">{formData.booth_number}</p>
                    </div>
                  )}
                  {formData.website && (
                    <div className="col-span-2">
                      <span className="text-gray-600">{t('review.website')}:</span>
                      <p className="font-medium">{formData.website}</p>
                    </div>
                  )}
                  {formData.description && (
                    <div className="col-span-2">
                      <span className="text-gray-600">{t('review.description')}:</span>
                      <p className="font-medium">{formData.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600">{t('review.note')}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {tCommon('previous')}
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-orange-500 to-pink-600"
              >
                {tCommon('next')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-500 to-pink-600"
              >
                {isSubmitting ? t('creating') : t('createButton')}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
