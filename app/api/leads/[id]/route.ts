import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'
import { z } from 'zod'

const updateSchema = z.object({
  status: z.enum(['new', 'contacted', 'archived']).optional(),
  notes: z.string().optional()
})

function getServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const payload = updateSchema.parse(body)
    const serviceClient = getServiceClient()

    const updateValues: Database['public']['Tables']['leads']['Update'] = {}

    if (payload.status) {
      updateValues.status = payload.status
      if (payload.status === 'contacted') {
        updateValues.contacted_at = new Date().toISOString()
      }
    }

    if (payload.notes !== undefined) {
      updateValues.notes = payload.notes
    }

    const { data, error } = await serviceClient
      .from('leads')
      .update(updateValues)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, lead: data })
  } catch (error) {
    console.error('[Leads] update failed', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

