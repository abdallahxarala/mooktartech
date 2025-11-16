import { z } from 'zod'

/**
 * Schema for creating a lead from NFC card scan
 */
export const createLeadSchema = z.object({
  card_id: z.string().uuid('Invalid card ID format'),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().max(50, 'Phone too long').optional(),
  company: z.string().max(255, 'Company name too long').optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
  source: z.enum(['nfc_scan', 'qr_scan', 'manual', 'form']).default('nfc_scan'),
  metadata: z.record(z.unknown()).optional()
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>

/**
 * Lead status values
 */
export type LeadStatus = 'new' | 'contacted' | 'archived'

/**
 * Lead source values
 */
export type LeadSource = 'nfc_scan' | 'qr_scan' | 'manual' | 'form'

/**
 * Lead response from API
 */
export interface Lead {
  id: string
  card_id: string | null
  organization_id: string
  captured_by: string | null
  name: string
  email: string | null
  phone: string | null
  company: string | null
  notes: string | null
  status: LeadStatus
  source: LeadSource
  contacted_at: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

/**
 * API Response types
 */
export interface CreateLeadResponse {
  success: true
  lead: Pick<Lead, 'id' | 'card_id' | 'organization_id' | 'name' | 'email' | 'phone' | 'company' | 'status' | 'source' | 'created_at'>
}

export interface GetLeadsResponse {
  success: true
  leads: Array<Pick<Lead, 'id' | 'card_id' | 'name' | 'email' | 'phone' | 'company' | 'status' | 'source' | 'created_at'>>
  total: number
  limit: number
  offset: number
}

export interface ErrorResponse {
  success: false
  error: string
  details?: z.ZodError['errors']
}

