import { NextRequest, NextResponse } from 'next/server'
import { forwardLeadToZapier } from '@/lib/integrations/zapier'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await forwardLeadToZapier({
      type: 'lead.forwarded',
      payload: body
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Leads webhook] forward failed', error)
    return NextResponse.json({ error: 'Failed to forward lead' }, { status: 500 })
  }
}

