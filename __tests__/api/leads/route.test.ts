/**
 * Jest tests for /api/leads route
 * 
 * Run with: npm test -- leads/route.test.ts
 */

import { POST, GET } from '@/app/api/leads/route'
import { createLeadSchema } from '@/lib/types/leads'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        })),
        order: jest.fn(() => ({
          range: jest.fn()
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    }))
  }))
}))

// Mock Next.js
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200
    }))
  }
}))

describe('/api/leads', () => {
  const mockSession = {
    user: {
      id: 'user-123'
    }
  }

  const mockMembership = {
    organization_id: 'org-456'
  }

  const mockLead = {
    id: 'lead-789',
    card_id: 'card-abc',
    organization_id: 'org-456',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+221 77 123 45 67',
    company: 'TechCorp',
    status: 'new',
    source: 'nfc_scan',
    created_at: '2025-01-30T10:00:00Z'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/leads - Success path', () => {
    it('should create a lead successfully with valid data', async () => {
      const { createSupabaseServerClient } = require('@/lib/supabase/server')
      const mockSupabase = createSupabaseServerClient()

      // Mock session
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      // Mock organization membership lookup
      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: mockMembership,
            error: null
          })
        }))
      }))

      // Mock card check (optional)
      const mockCardSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: { id: 'card-abc', user_id: 'user-123' },
            error: null
          })
        }))
      }))

      // Mock lead creation
      const mockInsert = jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: mockLead,
            error: null
          })
        }))
      }))

      // Mock analytics insert (non-blocking)
      const mockAnalyticsInsert = jest.fn().mockResolvedValue({
        error: null
      })

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'organization_members') {
          return { select: mockSelect }
        }
        if (table === 'virtual_cards') {
          return { select: mockCardSelect }
        }
        if (table === 'leads') {
          return { insert: mockInsert }
        }
        if (table === 'card_analytics') {
          return { insert: mockAnalyticsInsert }
        }
        return {}
      })

      const request = new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: 'card-abc',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+221 77 123 45 67',
          company: 'TechCorp',
          source: 'nfc_scan'
        })
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
      expect(responseData.lead).toMatchObject({
        id: mockLead.id,
        name: mockLead.name,
        email: mockLead.email
      })
      expect(mockInsert).toHaveBeenCalled()
    })

    it('should create a lead with minimal required fields', async () => {
      const { createSupabaseServerClient } = require('@/lib/supabase/server')
      const mockSupabase = createSupabaseServerClient()

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: mockMembership,
            error: null
          })
        }))
      }))

      const mockInsert = jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: { ...mockLead, email: null, phone: null, company: null },
            error: null
          })
        }))
      }))

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'organization_members') {
          return { select: mockSelect }
        }
        if (table === 'leads') {
          return { insert: mockInsert }
        }
        return {}
      })

      const request = new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: 'card-abc',
          name: 'Jane Doe',
          source: 'nfc_scan'
        })
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
      expect(responseData.lead.name).toBe('Jane Doe')
    })
  })

  describe('POST /api/leads - Validation errors', () => {
    it('should return 400 for invalid card_id format', async () => {
      const { createSupabaseServerClient } = require('@/lib/supabase/server')
      const mockSupabase = createSupabaseServerClient()

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      const request = new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: 'invalid-uuid',
          name: 'John Doe'
        })
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Validation failed')
      expect(responseData.details).toBeDefined()
    })

    it('should return 400 for missing required name field', async () => {
      const { createSupabaseServerClient } = require('@/lib/supabase/server')
      const mockSupabase = createSupabaseServerClient()

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      const request = new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: '550e8400-e29b-41d4-a716-446655440000'
        })
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Validation failed')
    })

    it('should return 400 for invalid email format', async () => {
      const { createSupabaseServerClient } = require('@/lib/supabase/server')
      const mockSupabase = createSupabaseServerClient()

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      const request = new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'John Doe',
          email: 'invalid-email'
        })
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Validation failed')
    })

    it('should return 400 for invalid JSON payload', async () => {
      const { createSupabaseServerClient } = require('@/lib/supabase/server')
      const mockSupabase = createSupabaseServerClient()

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      const request = new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json{'
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Invalid JSON payload')
    })
  })

  describe('POST /api/leads - Authentication errors', () => {
    it('should return 401 when user is not authenticated', async () => {
      const { createSupabaseServerClient } = require('@/lib/supabase/server')
      const mockSupabase = createSupabaseServerClient()

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      const request = new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: 'card-abc',
          name: 'John Doe'
        })
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(401)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Unauthorized')
    })

    it('should return 404 when organization membership not found', async () => {
      const { createSupabaseServerClient } = require('@/lib/supabase/server')
      const mockSupabase = createSupabaseServerClient()

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Not found' }
          })
        }))
      }))

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'organization_members') {
          return { select: mockSelect }
        }
        return {}
      })

      const request = new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: 'card-abc',
          name: 'John Doe'
        })
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(404)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Organization not found')
    })
  })

  describe('Zod schema validation', () => {
    it('should validate correct lead data', () => {
      const validData = {
        card_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+221 77 123 45 67',
        company: 'TechCorp',
        source: 'nfc_scan' as const
      }

      const result = createLeadSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
      }
    })

    it('should reject invalid UUID format', () => {
      const invalidData = {
        card_id: 'not-a-uuid',
        name: 'John Doe'
      }

      const result = createLeadSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty name', () => {
      const invalidData = {
        card_id: '550e8400-e29b-41d4-a716-446655440000',
        name: ''
      }

      const result = createLeadSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept optional fields as empty strings', () => {
      const validData = {
        card_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'John Doe',
        email: '',
        phone: '',
        company: ''
      }

      const result = createLeadSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})

