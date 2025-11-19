import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  generateInvoicePDF,
  uploadInvoiceToStorage,
  buildInvoiceDataFromExhibitor,
  generateExhibitorInvoice,
} from '@/lib/services/pdf/invoice-generator'

/**
 * Endpoint API pour générer et télécharger une facture PDF
 * 
 * GET /api/foires/[eventSlug]/invoices/[exhibitorId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { eventSlug: string; exhibitorId: string } }
) {
  try {
    const supabase = await createSupabaseServerClient()

    // 1. Récupérer l'événement par slug
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

    // 2. Récupérer les données de l'exposant
    const { data: exhibitor, error: exhibitorError } = await supabase
      .from('exhibitors')
      .select('*')
      .eq('id', params.exhibitorId)
      .eq('event_id', event.id)
      .single()

    if (exhibitorError || !exhibitor) {
      return NextResponse.json(
        { error: 'Exhibitor not found' },
        { status: 404 }
      )
    }

    // 3. Construire les données de facture
    const invoiceData = buildInvoiceDataFromExhibitor(exhibitor, event)

    // 4. Générer le PDF
    const pdfBlob = await generateInvoicePDF(invoiceData)

    // 5. Upload vers Supabase Storage (optionnel, peut être fait en arrière-plan)
    try {
      const publicUrl = await uploadInvoiceToStorage(
        pdfBlob,
        params.exhibitorId,
        invoiceData.invoice_number
      )

      // Mettre à jour l'exposant avec l'URL de la facture dans metadata
      const currentMetadata = exhibitor.metadata || {}
      await supabase
        .from('exhibitors')
        .update({
          metadata: {
            ...currentMetadata,
            invoice_url: publicUrl,
            invoice_number: invoiceData.invoice_number,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.exhibitorId)
    } catch (uploadError) {
      console.warn('Failed to upload invoice to storage:', uploadError)
      // Continue quand même, on retourne le PDF directement
    }

    // 6. Retourner le PDF
    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="facture-${invoiceData.invoice_number}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate invoice',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST : Générer, uploader, et enregistrer la facture
 * 
 * POST /api/foires/[eventSlug]/invoices/[exhibitorId]
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { eventSlug: string; exhibitorId: string } }
) {
  try {
    const supabase = await createSupabaseServerClient()

    // 1. Vérifier que l'événement existe
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('slug', params.eventSlug)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // 2. Vérifier que l'exposant existe et appartient à l'événement
    const { data: exhibitor, error: exhibitorError } = await supabase
      .from('exhibitors')
      .select('id')
      .eq('id', params.exhibitorId)
      .eq('event_id', event.id)
      .single()

    if (exhibitorError || !exhibitor) {
      return NextResponse.json(
        { error: 'Exhibitor not found' },
        { status: 404 }
      )
    }

    // 3. Générer la facture (fonction principale qui fait tout)
    const { invoiceUrl, invoiceNumber } = await generateExhibitorInvoice(params.exhibitorId)

    return NextResponse.json({
      success: true,
      invoiceUrl,
      invoiceNumber,
      message: 'Facture générée et enregistrée avec succès',
    })
  } catch (error) {
    console.error('Error generating and saving invoice:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate invoice',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

