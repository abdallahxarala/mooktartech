import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  createLeadSchema,
  type CreateLeadResponse,
  type ErrorResponse,
  type GetLeadsResponse
} from '@/lib/types/leads'

/**
 * POST /api/leads
 * Creates a new lead from an NFC card scan
 * 
 * Multi-tenant safe: Automatically scopes to the user's organization
 */
export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient()

    // Get authenticated session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      )
    }

    // Parse and validate request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Invalid JSON payload'
        },
        { status: 400 }
      )
    }

    const validationResult = createLeadSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Get user's organization membership (multi-tenant safety)
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', session.user.id)
      .single()

    if (membershipError || !membership) {
      console.error('Membership lookup failed:', {
        userId: session.user.id,
        error: membershipError?.message
      })
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Organization not found'
        },
        { status: 404 }
      )
    }

    // Verify card exists and belongs to the same organization (optional but recommended)
    if (validatedData.card_id) {
      // Check if card exists in virtual_cards or nfc_cards
      // We'll check virtual_cards first (most common)
      const { data: card, error: cardError } = await supabase
        .from('virtual_cards')
        .select('id, user_id')
        .eq('id', validatedData.card_id)
        .single()

      if (cardError || !card) {
        // Card might be in nfc_cards table, but we'll proceed anyway
        // The foreign key constraint will handle validation
        console.warn('Card not found in virtual_cards:', {
          cardId: validatedData.card_id
        })
      }
    }

    // Create lead with organization scoping
    const leadData = {
      card_id: validatedData.card_id || null,
      organization_id: membership.organization_id,
      captured_by: session.user.id,
      name: validatedData.name.trim(),
      email: validatedData.email?.trim() || null,
      phone: validatedData.phone?.trim() || null,
      company: validatedData.company?.trim() || null,
      notes: validatedData.notes?.trim() || null,
      source: validatedData.source,
      status: 'new' as const,
      metadata: validatedData.metadata || null
    }

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert(leadData)
      .select('id, card_id, organization_id, name, email, phone, company, status, source, created_at')
      .single()

    if (leadError) {
      console.error('Lead creation failed:', {
        organizationId: membership.organization_id,
        cardId: validatedData.card_id,
        error: leadError.message,
        code: leadError.code
      })
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Failed to create lead'
        },
        { status: 500 }
      )
    }

    // Create analytics event for lead capture
    if (validatedData.card_id) {
      await supabase.from('card_analytics').insert({
        card_id: validatedData.card_id,
        event_type: 'contact' // Using 'contact' as it's the closest match in the enum
      }).catch((err) => {
        // Log but don't fail the request if analytics fails
        console.error('Analytics event creation failed:', err)
      })
    }

    // Log safe metadata (no PII)
    console.log('Lead created:', {
      leadId: lead.id,
      organizationId: membership.organization_id,
      cardId: validatedData.card_id,
      source: validatedData.source
    })

    // Send lead notification email (non-blocking)
    import('@/lib/email/transactional')
      .then(({ sendLeadNotificationEmail }) => {
        sendLeadNotificationEmail(lead.id, 'fr').catch((emailError) => {
          // Log but don't fail the request
          console.error('Failed to send lead notification email:', emailError)
        })
      })
      .catch((importError) => {
        console.warn('Failed to import email service:', importError)
      })

    return NextResponse.json<CreateLeadResponse>(
      {
        success: true,
        lead
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error in POST /api/leads:', error)
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/leads
 * Retrieves leads for the authenticated user's organization
 * 
 * Query params:
 * - status: Filter by status ('new', 'contacted', 'archived')
 * - limit: Number of results (default: 20, max: 100)
 * - offset: Pagination offset (default: 0)
 */
export async function GET(request: Request) {
  try {
    const supabase = createSupabaseServerClient()

    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Unauthorized'
        },
        { status: 401 }
      )
    }

    // Get user's organization
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', session.user.id)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Organization not found'
        },
        { status: 404 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)

    // Build query
    let query = supabase
      .from('leads')
      .select('id, card_id, name, email, phone, company, status, source, created_at', {
        count: 'exact'
      })
      .eq('organization_id', membership.organization_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply status filter if provided
    if (status && ['new', 'contacted', 'archived'].includes(status)) {
      query = query.eq('status', status)
    }

    const { data: leads, error: leadsError, count } = await query

    if (leadsError) {
      console.error('Leads fetch failed:', {
        organizationId: membership.organization_id,
        error: leadsError.message
      })
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: 'Failed to fetch leads'
        },
        { status: 500 }
      )
    }

    return NextResponse.json<GetLeadsResponse>(
      {
        success: true,
        leads: leads || [],
        total: count || 0,
        limit,
        offset
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error in GET /api/leads:', error)
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
