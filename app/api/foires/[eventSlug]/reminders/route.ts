import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { sendPaymentReminderEmail } from '@/lib/services/email/templates'

/**
 * Endpoint pour gérer les rappels de paiement
 * 
 * GET /api/foires/[eventSlug]/reminders - Liste des exposants avec paiement en attente
 * POST /api/foires/[eventSlug]/reminders - Envoyer un rappel à un exposant spécifique
 * POST /api/foires/[eventSlug]/reminders?bulk=true - Envoyer des rappels en masse
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { eventSlug: string } }
) {
  try {
    const supabase = await createSupabaseServerClient()

    // 1. Récupérer l'événement
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('slug', params.eventSlug)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const eventData_get = event as any;

    // 2. Récupérer les exposants avec paiement en attente
    const { data: exhibitors, error: exhibitorsError } = await supabase
      .from('exhibitors')
      .select('id, company_name, contact_name, contact_email, payment_status, payment_amount, created_at')
      .eq('event_id', eventData_get.id)
      .in('payment_status', ['unpaid', 'pending'])

    if (exhibitorsError) {
      return NextResponse.json(
        { error: 'Failed to fetch exhibitors' },
        { status: 500 }
      )
    }

    // Calculer les jours depuis l'inscription
    const exhibitorsWithDays = exhibitors?.map(exhibitor => {
      const daysSinceRegistration = Math.floor(
        (Date.now() - new Date(exhibitor.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      return {
        ...exhibitor,
        daysSinceRegistration,
      }
    }) || []

    return NextResponse.json({
      event: {
        id: eventData_get.id,
        name: eventData_get.name,
        slug: eventData_get.slug,
      },
      exhibitors: exhibitorsWithDays,
      total: exhibitorsWithDays.length,
    })
  } catch (error) {
    console.error('Error fetching payment reminders:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch payment reminders',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { eventSlug: string } }
) {
  try {
    const supabase = await createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const isBulk = searchParams.get('bulk') === 'true'

    // 1. Récupérer l'événement
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('slug', params.eventSlug)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const eventData_post = event as any;

    if (isBulk) {
      // Envoi en masse
      const { data: exhibitors, error: exhibitorsError } = await supabase
        .from('exhibitors')
        .select('*')
        .eq('event_id', eventData_post.id)
        .in('payment_status', ['unpaid', 'pending'])

      if (exhibitorsError) {
        return NextResponse.json(
          { error: 'Failed to fetch exhibitors' },
          { status: 500 }
        )
      }

      const results = {
        sent: 0,
        errors: 0,
        details: [] as Array<{ exhibitorId: string; status: 'sent' | 'error'; error?: string }>,
      }

      for (const exhibitor of exhibitors || []) {
        try {
          const exhibitorData_bulk = exhibitor as any;
          await sendReminderToExhibitor(exhibitorData_bulk, eventData_post)
          results.sent++
          results.details.push({ exhibitorId: exhibitorData_bulk.id, status: 'sent' })
        } catch (error) {
          const exhibitorData_bulk = exhibitor as any;
          results.errors++
          results.details.push({
            exhibitorId: exhibitorData_bulk.id,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }

      return NextResponse.json({
        success: true,
        ...results,
      })
    } else {
      // Envoi à un exposant spécifique
      const body = await request.json()
      const { exhibitorId } = body

      if (!exhibitorId) {
        return NextResponse.json(
          { error: 'exhibitorId is required' },
          { status: 400 }
        )
      }

      const { data: exhibitor, error: exhibitorError } = await supabase
        .from('exhibitors')
        .select('*')
        .eq('id', exhibitorId)
        .eq('event_id', eventData_post.id)
        .single()

      if (exhibitorError || !exhibitor) {
        return NextResponse.json(
          { error: 'Exhibitor not found' },
          { status: 404 }
        )
      }

      const exhibitorData = exhibitor as any;
      await sendReminderToExhibitor(exhibitorData, eventData_post)

      return NextResponse.json({
        success: true,
        message: 'Reminder sent successfully',
      })
    }
  } catch (error) {
    console.error('Error sending payment reminders:', error)
    return NextResponse.json(
      {
        error: 'Failed to send payment reminders',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Envoie un rappel de paiement à un exposant
 */
async function sendReminderToExhibitor(exhibitor: any, event: any): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foire-dakar-2025.com'
  const paymentUrl = `${baseUrl}/fr/org/foire-dakar-2025/foires/${event.slug}/inscription?exhibitor=${exhibitor.id}`

  // Calculer la date limite (7 jours après inscription)
  const registrationDate = new Date(exhibitor.created_at)
  const dueDate = new Date(registrationDate)
  dueDate.setDate(dueDate.getDate() + 7)

  await sendPaymentReminderEmail({
    to: exhibitor.contact_email,
    exhibitorName: exhibitor.contact_name,
    companyName: exhibitor.company_name,
    amountDue: exhibitor.payment_amount || 0,
    dueDate: dueDate.toLocaleDateString('fr-FR'),
    paymentUrl,
  })
}

