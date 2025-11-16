/**
 * Lead notification email template
 * 
 * Notifies organization owners when a new lead is captured
 */

export interface LeadNotificationData {
  leadName: string
  leadEmail: string | null
  leadPhone: string | null
  leadCompany: string | null
  leadNotes: string | null
  source: string
  cardName: string | null
  cardCompany: string | null
  organizationName: string
  leadUrl: string
  capturedAt: string
}

const translations = {
  fr: {
    subject: (leadName: string) => `Nouveau contact : ${leadName} - Xarala Solutions`,
    greeting: (orgName: string) => `Bonjour ${orgName},`,
    newLead: 'Vous avez reçu un nouveau contact !',
    leadDetails: 'Détails du contact',
    name: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    company: 'Entreprise',
    notes: 'Notes',
    source: 'Source',
    card: 'Carte',
    capturedAt: 'Capturé le',
    viewLead: 'Voir le contact',
    footer: 'Xarala Solutions - Solutions d\'identification professionnelle',
    footerAddress: 'Dakar, Sénégal',
    footerPhone: '+221 77 539 81 39',
    footerEmail: 'contact@xarala.sn'
  },
  en: {
    subject: (leadName: string) => `New Lead: ${leadName} - Xarala Solutions`,
    greeting: (orgName: string) => `Hello ${orgName},`,
    newLead: 'You have received a new lead!',
    leadDetails: 'Lead details',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company',
    notes: 'Notes',
    source: 'Source',
    card: 'Card',
    capturedAt: 'Captured on',
    viewLead: 'View lead',
    footer: 'Xarala Solutions - Professional identification solutions',
    footerAddress: 'Dakar, Senegal',
    footerPhone: '+221 77 539 81 39',
    footerEmail: 'contact@xarala.sn'
  }
}

export function renderLeadNotificationEmail(
  data: LeadNotificationData,
  locale: string = 'fr'
): { subject: string; html: string; text: string } {
  const t = translations[locale as keyof typeof translations] || translations.fr

  const subject = t.subject(data.leadName)

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
                ${t.greeting(data.organizationName)}
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 18px; color: #FF7A00; font-weight: 600;">
                ${t.newLead}
              </p>
              
              <!-- Lead Info -->
              <table role="presentation" style="width: 100%; margin-bottom: 30px; border-collapse: collapse; background-color: #f9fafb; border-radius: 6px; overflow: hidden;">
                <tr>
                  <td style="padding: 20px;">
                    <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #333333; font-weight: 600;">
                      ${t.leadDetails}
                    </h2>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-weight: 600; width: 120px;">${t.name}:</td>
                        <td style="padding: 8px 0; color: #333333;">${data.leadName}</td>
                      </tr>
                      ${data.leadEmail ? `
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-weight: 600;">${t.email}:</td>
                        <td style="padding: 8px 0; color: #333333;">
                          <a href="mailto:${data.leadEmail}" style="color: #FF7A00; text-decoration: none;">${data.leadEmail}</a>
                        </td>
                      </tr>
                      ` : ''}
                      ${data.leadPhone ? `
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-weight: 600;">${t.phone}:</td>
                        <td style="padding: 8px 0; color: #333333;">
                          <a href="tel:${data.leadPhone}" style="color: #FF7A00; text-decoration: none;">${data.leadPhone}</a>
                        </td>
                      </tr>
                      ` : ''}
                      ${data.leadCompany ? `
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-weight: 600;">${t.company}:</td>
                        <td style="padding: 8px 0; color: #333333;">${data.leadCompany}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-weight: 600;">${t.source}:</td>
                        <td style="padding: 8px 0; color: #333333;">
                          <span style="display: inline-block; padding: 4px 12px; background-color: #e0f2fe; color: #0369a1; border-radius: 4px; font-size: 12px; font-weight: 600;">
                            ${data.source === 'nfc_scan' ? 'Scan NFC' : data.source === 'manual' ? 'Manuel' : data.source === 'import' ? 'Import' : data.source}
                          </span>
                        </td>
                      </tr>
                      ${data.cardName ? `
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-weight: 600;">${t.card}:</td>
                        <td style="padding: 8px 0; color: #333333;">${data.cardName}${data.cardCompany ? ` (${data.cardCompany})` : ''}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-weight: 600;">${t.capturedAt}:</td>
                        <td style="padding: 8px 0; color: #333333;">${data.capturedAt}</td>
                      </tr>
                      ${data.leadNotes ? `
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-weight: 600; vertical-align: top;">${t.notes}:</td>
                        <td style="padding: 8px 0; color: #333333;">${data.leadNotes}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; margin-bottom: 30px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${data.leadUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FF7A00 0%, #FF6B9D 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      ${t.viewLead}
                    </a>
                  </td>
                </tr>
              </table>
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
${t.greeting(data.organizationName)}

${t.newLead}

${t.leadDetails}:
${t.name}: ${data.leadName}
${data.leadEmail ? `${t.email}: ${data.leadEmail}` : ''}
${data.leadPhone ? `${t.phone}: ${data.leadPhone}` : ''}
${data.leadCompany ? `${t.company}: ${data.leadCompany}` : ''}
${t.source}: ${data.source}
${data.cardName ? `${t.card}: ${data.cardName}${data.cardCompany ? ` (${data.cardCompany})` : ''}` : ''}
${t.capturedAt}: ${data.capturedAt}
${data.leadNotes ? `${t.notes}: ${data.leadNotes}` : ''}

${t.viewLead}: ${data.leadUrl}

${t.footer}
${t.footerAddress}
${t.footerPhone} | ${t.footerEmail}
  `.trim()

  return { subject, html, text }
}

