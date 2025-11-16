/**
 * Transactional email service using Resend
 * 
 * Handles order confirmations, lead notifications, and other transactional emails
 */

import { Resend } from 'resend'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { renderOrderConfirmationEmail } from './templates/order-confirmation'
import { renderLeadNotificationEmail } from './templates/lead-notification'

let resendClient: Resend | null = null

/**
 * Get or create Resend client instance
 */
function getResendClient(): Resend {
  if (resendClient) {
    return resendClient
  }

  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set')
  }

  resendClient = new Resend(apiKey)
  return resendClient
}

/**
 * Get sender email address from environment or use default
 */
function getSenderEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL ||
    process.env.EMAIL_FROM ||
    'Xarala Solutions <notifications@mail.xarala.sn>'
  )
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send order confirmation email
 * 
 * @param orderId - Order UUID from database
 * @param locale - Locale for email content (default: 'fr')
 * @returns EmailResult indicating success or failure
 */
export async function sendOrderConfirmationEmail(
  orderId: string,
  locale: string = 'fr'
): Promise<EmailResult> {
  try {
    const supabase = createSupabaseServerClient()

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount,
        currency,
        status,
        payment_status,
        payment_method,
        shipping_address,
        billing_address,
        created_at,
        user_id
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('Order not found for email:', orderId, orderError)
      return {
        success: false,
        error: 'Order not found'
      }
    }

    // Fetch user details separately if user_id exists
    let userEmail: string | null = null
    if (order.user_id) {
      const { data: user } = await supabase
        .from('users')
        .select('email')
        .eq('id', order.user_id)
        .single()
      userEmail = user?.email || null
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        id,
        quantity,
        unit_price,
        total_price,
        product:products(id, name, image_url)
      `)
      .eq('order_id', orderId)

    if (itemsError) {
      console.error('Failed to fetch order items:', itemsError)
    }

    // Determine recipient email
    const shippingAddress = order.shipping_address as Record<string, unknown> | null
    const billingAddress = order.billing_address as Record<string, unknown> | null
    const recipientEmail =
      (shippingAddress?.email as string) ||
      (billingAddress?.email as string) ||
      userEmail

    if (!recipientEmail) {
      console.warn('No email address found for order:', orderId)
      return {
        success: false,
        error: 'No recipient email address'
      }
    }

    // Generate tracking URL
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://xarala.sn'
    const trackingUrl = `${baseUrl.replace(/\/$/, '')}/${locale}/orders/${order.id}`

    // Render email template
    const { subject, html, text } = renderOrderConfirmationEmail(
      {
        orderNumber: order.order_number,
        orderId: order.id,
        totalAmount: parseFloat(order.total_amount.toString()),
        currency: order.currency || 'XOF',
        paymentMethod: order.payment_method || 'N/A',
        paymentStatus: order.payment_status,
        items: (items || []).map((item) => ({
          name: (item.product as { name: string } | null)?.name || 'Produit',
          quantity: item.quantity,
          unitPrice: parseFloat(item.unit_price.toString()),
          totalPrice: parseFloat(item.total_price.toString()),
          imageUrl: (item.product as { image_url: string | null } | null)?.image_url || null
        })),
        shippingAddress: shippingAddress || {},
        billingAddress: billingAddress || {},
        trackingUrl,
        orderDate: new Date(order.created_at).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      },
      locale
    )

    // Send email via Resend
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: getSenderEmail(),
      to: recipientEmail,
      subject,
      html,
      text
    })

    if (error) {
      console.error('Resend API error:', error)
      return {
        success: false,
        error: error.message || 'Failed to send email'
      }
    }

    console.log('Order confirmation email sent:', {
      orderId,
      recipientEmail,
      messageId: data?.id
    })

    return {
      success: true,
      messageId: data?.id
    }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Send lead notification email to organization owner
 * 
 * @param leadId - Lead UUID from database
 * @param locale - Locale for email content (default: 'fr')
 * @returns EmailResult indicating success or failure
 */
export async function sendLeadNotificationEmail(
  leadId: string,
  locale: string = 'fr'
): Promise<EmailResult> {
  try {
    const supabase = createSupabaseServerClient()

    // Fetch lead details
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select(`
        id,
        name,
        email,
        phone,
        company,
        notes,
        source,
        status,
        created_at,
        card_id,
        organization_id,
        captured_by
      `)
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      console.error('Lead not found for email:', leadId, leadError)
      return {
        success: false,
        error: 'Lead not found'
      }
    }

    // Fetch organization details separately
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('name, owner_id')
      .eq('id', lead.organization_id)
      .single()

    if (orgError || !organization) {
      console.warn('Organization not found for lead:', leadId)
      return {
        success: false,
        error: 'Organization not found'
      }
    }

    // Fetch card details if available
    let cardName: string | null = null
    let cardCompany: string | null = null
    if (lead.card_id) {
      const { data: card } = await supabase
        .from('virtual_cards')
        .select('name, company')
        .eq('id', lead.card_id)
        .single()
      cardName = card?.name || null
      cardCompany = card?.company || null
    }

    // Get organization owner email
    const { data: owner, error: ownerError } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', organization.owner_id)
      .single()

    if (ownerError || !owner) {
      console.error('Organization owner not found:', ownerError)
      return {
        success: false,
        error: 'Organization owner not found'
      }
    }

    const recipientEmail = owner.email

    // Generate lead URL
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://xarala.sn'
    const leadUrl = `${baseUrl.replace(/\/$/, '')}/${locale}/dashboard/leads/${lead.id}`

    // Render email template
    const { subject, html, text } = renderLeadNotificationEmail(
      {
        leadName: lead.name,
        leadEmail: lead.email || null,
        leadPhone: lead.phone || null,
        leadCompany: lead.company || null,
        leadNotes: lead.notes || null,
        source: lead.source,
        cardName: cardName,
        cardCompany: cardCompany,
        organizationName: organization.name,
        leadUrl,
        capturedAt: new Date(lead.created_at).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      },
      locale
    )

    // Send email via Resend
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: getSenderEmail(),
      to: recipientEmail,
      subject,
      html,
      text
    })

    if (error) {
      console.error('Resend API error:', error)
      return {
        success: false,
        error: error.message || 'Failed to send email'
      }
    }

    console.log('Lead notification email sent:', {
      leadId,
      recipientEmail,
      messageId: data?.id
    })

    return {
      success: true,
      messageId: data?.id
    }
  } catch (error) {
    console.error('Error sending lead notification email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

