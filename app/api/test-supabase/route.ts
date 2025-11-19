import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test simple
    const { data, error } = await supabase
      .from('organizations')
      .select('id')
      .limit(1)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase server client works!',
      data: data || [],
      error: error?.message || null,
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  }
}

