import { Resend } from 'resend'
import { requireEnv } from '@/lib/payments/env'
import { fetchOrderDetails, calculateOrderTotals } from '@/lib/orders/queries'
import { OrderConfirmationEmail } from '@/lib/email-templates/order-confirmation'

let resendClient: Resend | null = null

function getResend() {
  if (resendClient) return resendClient
  resendClient = new Resend(requireEnv('RESEND_API_KEY'))
  return resendClient
}

export async function sendOrderConfirmationEmail(orderId: string) {
  const orderDetails = await fetchOrderDetails(orderId)

  if (!orderDetails) {
    console.warn('sendOrderConfirmationEmail: order not found', orderId)
    return
  }

  const shippingInfo = (orderDetails.order.shipping_address as any) ?? {}
  const recipientEmail = shippingInfo.email ?? orderDetails.order.user?.email

  if (!recipientEmail) {
    console.warn('sendOrderConfirmationEmail: missing recipient email', orderId)
    return
  }

  const totals = calculateOrderTotals(orderDetails)
  const trackingUrlBase =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://xarala.sn'
  const trackingUrl = `${trackingUrlBase.replace(/\/$/, '')}/orders/${orderId}`

  const resend = getResend()

  await resend.emails.send({
    from: 'Xarala Solutions <notifications@mail.xarala.sn>',
    to: recipientEmail,
    subject: `Confirmation de votre commande ${orderDetails.order.order_number ?? orderId}`,
    react: OrderConfirmationEmail({
      order: orderDetails.order,
      items: orderDetails.items,
      totals,
      trackingUrl
    })
  })
}

