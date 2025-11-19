import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createExhibitor } from '@/lib/services/exhibitor.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await createExhibitor(body)
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ exhibitor: result.exhibitor })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

