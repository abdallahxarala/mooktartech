/**
 * Order confirmation email template
 * 
 * Premium, lightweight HTML email template matching Xarala's brand
 */

export interface OrderConfirmationData {
  orderNumber: string
  orderId: string
  totalAmount: number
  currency: string
  paymentMethod: string
  paymentStatus: string
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number
    imageUrl: string | null
  }>
  shippingAddress: Record<string, unknown>
  billingAddress: Record<string, unknown>
  trackingUrl: string
  orderDate: string
}

const translations = {
  fr: {
    subject: (orderNumber: string) => `Confirmation de commande ${orderNumber} - Xarala Solutions`,
    greeting: (name: string) => `Bonjour ${name || 'Cher client'},`,
    thankYou: 'Merci pour votre commande !',
    orderNumber: 'Numéro de commande',
    orderDate: 'Date de commande',
    paymentMethod: 'Méthode de paiement',
    paymentStatus: 'Statut du paiement',
    items: 'Articles commandés',
    quantity: 'Quantité',
    unitPrice: 'Prix unitaire',
    total: 'Total',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    tax: 'TVA',
    totalAmount: 'Montant total',
    shippingAddress: 'Adresse de livraison',
    billingAddress: 'Adresse de facturation',
    trackOrder: 'Suivre ma commande',
    questions: 'Des questions ?',
    contactUs: 'Contactez-nous',
    footer: 'Xarala Solutions - Solutions d\'identification professionnelle',
    footerAddress: 'Dakar, Sénégal',
    footerPhone: '+221 77 539 81 39',
    footerEmail: 'contact@xarala.sn'
  },
  en: {
    subject: (orderNumber: string) => `Order Confirmation ${orderNumber} - Xarala Solutions`,
    greeting: (name: string) => `Hello ${name || 'Dear customer'},`,
    thankYou: 'Thank you for your order!',
    orderNumber: 'Order number',
    orderDate: 'Order date',
    paymentMethod: 'Payment method',
    paymentStatus: 'Payment status',
    items: 'Ordered items',
    quantity: 'Quantity',
    unitPrice: 'Unit price',
    total: 'Total',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    totalAmount: 'Total amount',
    shippingAddress: 'Shipping address',
    billingAddress: 'Billing address',
    trackOrder: 'Track my order',
    questions: 'Questions?',
    contactUs: 'Contact us',
    footer: 'Xarala Solutions - Professional identification solutions',
    footerAddress: 'Dakar, Senegal',
    footerPhone: '+221 77 539 81 39',
    footerEmail: 'contact@xarala.sn'
  }
}

export function renderOrderConfirmationEmail(
  data: OrderConfirmationData,
  locale: string = 'fr'
): { subject: string; html: string; text: string } {
  const t = translations[locale as keyof typeof translations] || translations.fr

  const customerName =
    (data.shippingAddress?.name as string) ||
    (data.billingAddress?.name as string) ||
    'Cher client'

  const subject = t.subject(data.orderNumber)

  // Calculate totals
  const subtotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0)
  const shipping = 0 // Could be calculated from data
  const tax = 0 // Could be calculated from data
  const total = data.totalAmount

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: data.currency === 'XOF' ? 'XOF' : 'EUR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const html = `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF7A00 0%, #FF6B9D 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Xarala Solutions</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                ${t.greeting(customerName)}
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 18px; color: #FF7A00; font-weight: 600;">
                ${t.thankYou}
              </p>
              
              <!-- Order Info -->
              <table role="presentation" style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                    <strong style="color: #666666;">${t.orderNumber}:</strong>
                    <span style="color: #333333; margin-left: 10px;">${data.orderNumber}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                    <strong style="color: #666666;">${t.orderDate}:</strong>
                    <span style="color: #333333; margin-left: 10px;">${data.orderDate}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                    <strong style="color: #666666;">${t.paymentMethod}:</strong>
                    <span style="color: #333333; margin-left: 10px;">${data.paymentMethod}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <strong style="color: #666666;">${t.paymentStatus}:</strong>
                    <span style="color: #10b981; margin-left: 10px; font-weight: 600;">${data.paymentStatus === 'paid' ? 'Payé' : data.paymentStatus}</span>
                  </td>
                </tr>
              </table>
              
              <!-- Order Items -->
              <h2 style="margin: 30px 0 20px 0; font-size: 20px; color: #333333; font-weight: 600;">
                ${t.items}
              </h2>
              
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; font-size: 14px; color: #666666; font-weight: 600; border-bottom: 2px solid #e5e5e5;">Article</th>
                    <th style="padding: 12px; text-align: center; font-size: 14px; color: #666666; font-weight: 600; border-bottom: 2px solid #e5e5e5;">${t.quantity}</th>
                    <th style="padding: 12px; text-align: right; font-size: 14px; color: #666666; font-weight: 600; border-bottom: 2px solid #e5e5e5;">${t.total}</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.items
                    .map(
                      (item) => `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
                      <div style="font-weight: 600; color: #333333;">${item.name}</div>
                      <div style="font-size: 14px; color: #666666; margin-top: 4px;">${formatCurrency(item.unitPrice)} × ${item.quantity}</div>
                    </td>
                    <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e5e5; color: #333333;">${item.quantity}</td>
                    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e5e5; color: #333333; font-weight: 600;">${formatCurrency(item.totalPrice)}</td>
                  </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
              
              <!-- Totals -->
              <table role="presentation" style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; text-align: right; color: #666666;">${t.subtotal}:</td>
                  <td style="padding: 8px 0; padding-left: 20px; text-align: right; color: #333333; width: 120px;">${formatCurrency(subtotal)}</td>
                </tr>
                ${shipping > 0 ? `
                <tr>
                  <td style="padding: 8px 0; text-align: right; color: #666666;">${t.shipping}:</td>
                  <td style="padding: 8px 0; padding-left: 20px; text-align: right; color: #333333;">${formatCurrency(shipping)}</td>
                </tr>
                ` : ''}
                ${tax > 0 ? `
                <tr>
                  <td style="padding: 8px 0; text-align: right; color: #666666;">${t.tax}:</td>
                  <td style="padding: 8px 0; padding-left: 20px; text-align: right; color: #333333;">${formatCurrency(tax)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 12px 0; border-top: 2px solid #e5e5e5; text-align: right; font-size: 18px; font-weight: 700; color: #333333;">${t.totalAmount}:</td>
                  <td style="padding: 12px 0; padding-left: 20px; border-top: 2px solid #e5e5e5; text-align: right; font-size: 18px; font-weight: 700; color: #FF7A00;">${formatCurrency(total)}</td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; margin-bottom: 30px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${data.trackingUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FF7A00 0%, #FF6B9D 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      ${t.trackOrder}
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Contact -->
              <p style="margin: 30px 0 0 0; font-size: 14px; color: #666666; text-align: center;">
                ${t.questions} <a href="mailto:contact@xarala.sn" style="color: #FF7A00; text-decoration: none;">${t.contactUs}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666; font-weight: 600;">
                ${t.footer}
              </p>
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #999999;">
                ${t.footerAddress}
              </p>
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #999999;">
                ${t.footerPhone} | <a href="mailto:${t.footerEmail}" style="color: #FF7A00; text-decoration: none;">${t.footerEmail}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  // Plain text version
  const text = `
${t.greeting(customerName)}

${t.thankYou}

${t.orderNumber}: ${data.orderNumber}
${t.orderDate}: ${data.orderDate}
${t.paymentMethod}: ${data.paymentMethod}
${t.paymentStatus}: ${data.paymentStatus}

${t.items}:
${data.items.map((item) => `- ${item.name} (${item.quantity}x) - ${formatCurrency(item.totalPrice)}`).join('\n')}

${t.totalAmount}: ${formatCurrency(total)}

${t.trackOrder}: ${data.trackingUrl}

${t.questions} ${t.contactUs}: contact@xarala.sn

${t.footer}
${t.footerAddress}
${t.footerPhone} | ${t.footerEmail}
  `.trim()

  return { subject, html, text }
}

