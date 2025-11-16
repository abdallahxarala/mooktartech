/**
 * Example: Creating a lead from an NFC card scan
 * 
 * This example shows how to call the /api/leads endpoint from a React component
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { CreateLeadInput, CreateLeadResponse, ErrorResponse } from '@/lib/types/leads'

interface LeadFormProps {
  cardId: string
  onSuccess?: () => void
}

export function LeadCaptureForm({ cardId, onSuccess }: LeadFormProps) {
  const t = useTranslations('leads')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateLeadInput>({
    card_id: cardId,
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    source: 'nfc_scan'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data: CreateLeadResponse | ErrorResponse = await response.json()

      if (!response.ok || !data.success) {
        const error = data as ErrorResponse
        toast.error(error.error || 'Failed to create lead')
        
        // Log validation errors if present
        if (error.details) {
          console.error('Validation errors:', error.details)
        }
        return
      }

      const successData = data as CreateLeadResponse
      toast.success(t('createdSuccessfully'))
      
      // Reset form
      setFormData({
        card_id: cardId,
        name: '',
        email: '',
        phone: '',
        company: '',
        notes: '',
        source: 'nfc_scan'
      })

      // Call success callback
      onSuccess?.()
    } catch (error) {
      console.error('Error creating lead:', error)
      toast.error(t('unexpectedError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">
          {t('name')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t('namePlaceholder')}
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={t('emailPlaceholder')}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="phone">{t('phone')}</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder={t('phonePlaceholder')}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="company">{t('company')}</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder={t('companyPlaceholder')}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="notes">{t('notes')}</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder={t('notesPlaceholder')}
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t('creating') : t('createLead')}
      </Button>
    </form>
  )
}

/**
 * Example: Fetching leads list
 */
export function useLeadsList(status?: 'new' | 'contacted' | 'archived') {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLeads = async (limit = 20, offset = 0) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      })
      
      if (status) {
        params.append('status', status)
      }

      const response = await fetch(`/api/leads?${params.toString()}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch leads')
      }

      setLeads(data.leads)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { leads, loading, error, fetchLeads }
}

