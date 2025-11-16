import twilio from 'twilio'
import { requireEnv } from '@/lib/payments/env'
import { fetchOrderDetails } from '@/lib/orders/queries'

let twilioClient: ReturnType<typeof twilio> | null = null

function getTwilioClient() {
  if (twilioClient) return twilioClient
  twilioClient = twilio(requireEnv('TWILIO_ACCOUNT_SID'), requireEnv('TWILIO_AUTH_TOKEN'))
  return twilioClient
}

export async function sendOrderConfirmationWhatsApp(orderId: string) {
  const orderDetails = await fetchOrderDetails(orderId)

  if (!orderDetails) {
    console.warn('[WhatsApp] order not found', orderId)
    return
  }

  const shippingInfo = (orderDetails.order.shipping_address as any) ?? {}
  const recipientPhone = shippingInfo.phone ?? orderDetails.order.user?.phone

  if (!recipientPhone) {
    console.warn('[WhatsApp] missing phone number', orderId)
    return
  }

  const whatsappFrom = requireEnv('TWILIO_WHATSAPP_NUMBER')
  const trackingUrlBase =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://xarala.sn'
  const trackingUrl = `${trackingUrlBase.replace(/\/$/, '')}/orders/${orderId}`
  const orderRef = orderDetails.order.order_number ?? orderId.slice(0, 8).toUpperCase()

  const message = `Commande #${orderRef} confirmée ! Livraison sous 24h. Suivi : ${trackingUrl}`

  const client = getTwilioClient()
  await client.messages.create({
    from: `whatsapp:${whatsappFrom}`,
    to: `whatsapp:${recipientPhone}`,
    body: message
  })
}

