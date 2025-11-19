/**
 * Templates d'emails transactionnels pour la Foire Dakar 2025
 */

import { sendEmail } from './resend-client'

/**
 * Template : Email de confirmation d'inscription exposant
 * 
 * @param data - Données de l'exposant
 */
export async function sendExhibitorConfirmationEmail(data: {
  to: string
  exhibitorName: string
  companyName: string
  standNumber: string | null
  pavilionName: string
  surfaceArea: number
  totalPrice: number
  invoiceUrl?: string
}) {
  const subject = `✅ Confirmation d'inscription - Foire Dakar 2025`

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .info-box {
          background-color: #f8f9fa;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 25px 0;
        }
        .info-box h2 {
          margin-top: 0;
          color: #667eea;
          font-size: 20px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #666;
        }
        .info-value {
          color: #333;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
        }
        .button:hover {
          opacity: 0.9;
        }
        .next-steps {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 20px;
          margin: 25px 0;
        }
        .next-steps h3 {
          margin-top: 0;
          color: #856404;
        }
        .next-steps ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        .next-steps li {
          margin: 10px 0;
        }
        .contact {
          background-color: #e7f3ff;
          padding: 20px;
          margin: 25px 0;
          border-radius: 6px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
          }
          .content {
            padding: 20px !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bienvenue à la Foire Dakar 2025 !</h1>
        </div>
        
        <div class="content">
          <p class="greeting">Bonjour ${data.exhibitorName},</p>
          
          <p>Nous avons le plaisir de confirmer votre inscription en tant qu'exposant pour la <strong>Foire Internationale de Dakar 2025</strong> !</p>
          
          <div class="info-box">
            <h2>📋 Détails de votre inscription</h2>
            <div class="info-row">
              <span class="info-label">Entreprise :</span>
              <span class="info-value">${data.companyName}</span>
            </div>
            ${data.standNumber ? `
            <div class="info-row">
              <span class="info-label">Numéro de stand :</span>
              <span class="info-value">${data.standNumber}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="info-label">Pavillon :</span>
              <span class="info-value">${data.pavilionName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Surface :</span>
              <span class="info-value">${data.surfaceArea} m²</span>
            </div>
            <div class="info-row">
              <span class="info-label">Montant total :</span>
              <span class="info-value"><strong>${data.totalPrice.toLocaleString('fr-FR')} FCFA</strong></span>
            </div>
          </div>
          
          ${data.invoiceUrl ? `
          <p>Veuillez trouver ci-dessous le lien pour télécharger votre facture officielle :</p>
          
          <center>
            <a href="${data.invoiceUrl}" class="button">📄 Télécharger la facture</a>
          </center>
          ` : ''}
          
          <div class="next-steps">
            <h3>📅 Prochaines étapes</h3>
            <ol>
              <li><strong>Préparez vos produits et visuels</strong> pour votre stand</li>
              <li><strong>Envoyez la liste de votre staff</strong> pour la génération des badges d'accès</li>
              <li><strong>Participez à la réunion pré-événement</strong> (date à confirmer)</li>
              <li><strong>Planifiez votre logistique</strong> (transport, hébergement)</li>
            </ol>
          </div>
          
          <div class="contact">
            <p style="margin-top: 0;"><strong>📞 Besoin d'aide ?</strong></p>
            <p style="margin: 10px 0;">
              Email: <a href="mailto:contact@foire-dakar-2025.com">contact@foire-dakar-2025.com</a><br>
              Téléphone: <a href="tel:+221338275397">+221 33 827 53 97</a><br>
              WhatsApp: <a href="https://wa.me/221775398139">+221 77 539 81 39</a>
            </p>
          </div>
          
          <p>Nous avons hâte de vous accueillir au <strong>Centre International de Commerce Extérieur (CICES)</strong> !</p>
          
          <p style="margin-top: 30px;">
            Cordialement,<br>
            <strong>L'équipe Foire Dakar 2025</strong>
          </p>
        </div>
        
        <div class="footer">
          <p>Foire Internationale de Dakar 2025<br>
          CICES - Route de Ouakam, Dakar, Sénégal</p>
          <p style="font-size: 12px; color: #999;">
            Cet email a été envoyé à ${data.to}. Si vous n'êtes pas concerné, veuillez ignorer ce message.<br>
            <a href="#" style="color: #999;">Se désabonner</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({ to: data.to, subject, html })
}

/**
 * Template : Email de rappel de paiement
 * 
 * @param data - Données du rappel
 */
export async function sendPaymentReminderEmail(data: {
  to: string
  exhibitorName: string
  companyName: string
  amountDue: number
  dueDate: string
  paymentUrl: string
}) {
  const subject = `⏰ Rappel de paiement - Foire Dakar 2025`

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #f39c12 0%, #e74c3c 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 30px;
        }
        .alert-box {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 20px;
          margin: 20px 0;
        }
        .alert-box p {
          margin: 8px 0;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #f39c12 0%, #e74c3c 100%);
          color: white !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .button:hover {
          opacity: 0.9;
        }
        .payment-methods {
          background-color: #f8f9fa;
          padding: 20px;
          margin: 20px 0;
          border-radius: 6px;
        }
        .payment-methods ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
          }
          .content {
            padding: 20px !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Rappel de paiement</h1>
        </div>
        
        <div class="content">
          <p>Bonjour ${data.exhibitorName},</p>
          
          <p>Nous vous rappelons qu'un paiement est en attente pour votre inscription à la <strong>Foire Internationale de Dakar 2025</strong>.</p>
          
          <div class="alert-box">
            <p style="margin-top: 0;"><strong>📊 Détails du paiement</strong></p>
            <p>Entreprise : <strong>${data.companyName}</strong></p>
            <p>Montant dû : <strong style="font-size: 18px; color: #e74c3c;">${data.amountDue.toLocaleString('fr-FR')} FCFA</strong></p>
            <p>Date limite : <strong>${data.dueDate}</strong></p>
          </div>
          
          <p>Pour sécuriser votre stand, merci de procéder au règlement avant la date limite.</p>
          
          <center>
            <a href="${data.paymentUrl}" class="button">💳 Effectuer le paiement</a>
          </center>
          
          <div class="payment-methods">
            <p style="margin-top: 0;"><strong>Modes de paiement acceptés :</strong></p>
            <ul>
              <li>Wave (paiement mobile)</li>
              <li>Orange Money</li>
              <li>Virement bancaire</li>
              <li>Espèces (sur place)</li>
            </ul>
          </div>
          
          <p>Si vous avez déjà effectué le paiement, merci d'ignorer ce message.</p>
          
          <p style="margin-top: 30px;">
            Cordialement,<br>
            <strong>L'équipe Foire Dakar 2025</strong>
          </p>
        </div>
        
        <div class="footer">
          <p>📞 Contact : +221 33 827 53 97 | 📧 contact@foire-dakar-2025.com</p>
          <p style="font-size: 12px; color: #999; margin-top: 10px;">
            <a href="#" style="color: #999;">Se désabonner</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({ to: data.to, subject, html })
}

/**
 * Template : Email avec billets QR codes
 * 
 * @param data - Données des billets
 */
export async function sendTicketsEmail(data: {
  to: string
  buyerName: string
  eventName: string
  tickets: Array<{
    id: string
    type: string
    qrCode: string // Base64 data URL du QR code
  }>
  eventSlug?: string
  eventDate?: string
  eventLocation?: string
}) {
  const subject = `🎟️ Vos billets - ${data.eventName}`

  const ticketTypeLabels: Record<string, string> = {
    adulte: 'Billet Visiteur',
    enfant: 'Billet Enfant',
    groupe: 'Billet Groupe',
    vip: 'Pass VIP',
    standard: 'Billet Standard',
  }

  const ticketsHtml = data.tickets
    .map(
      (ticket, index) => `
    <div style="background: white; border: 2px dashed #667eea; padding: 25px; margin: 20px 0; text-align: center; border-radius: 10px;">
      <h3 style="margin-top: 0; color: #667eea;">${ticketTypeLabels[ticket.type] || ticket.type} - Billet ${index + 1}</h3>
      <img src="${ticket.qrCode}" alt="QR Code Billet ${index + 1}" style="width: 250px; height: 250px; margin: 20px 0; max-width: 100%;" />
      <p style="font-weight: 600; color: #e74c3c;">⚠️ Présentez ce QR code à l'entrée</p>
      <p style="font-size: 12px; color: #666;">Billet valable uniquement pour les dates de l'événement</p>
    </div>
  `
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 30px;
        }
        .event-info {
          background-color: #e7f3ff;
          padding: 20px;
          margin: 25px 0;
          border-radius: 6px;
        }
        .event-info p {
          margin: 8px 0;
        }
        .important {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 20px;
          margin: 25px 0;
        }
        .important ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
          }
          .content {
            padding: 20px !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎟️ Vos billets pour ${data.eventName}</h1>
        </div>
        
        <div class="content">
          <p>Bonjour ${data.buyerName},</p>
          
          <p>Merci pour votre achat ! Veuillez trouver ci-dessous ${data.tickets.length === 1 ? 'votre billet' : `vos ${data.tickets.length} billets`} pour la <strong>${data.eventName}</strong>.</p>
          
          ${ticketsHtml}
          
          <div class="event-info">
            <p style="margin-top: 0;"><strong>📅 Informations événement</strong></p>
            <p>📍 <strong>Lieu :</strong> ${data.eventLocation || 'Centre International de Commerce Extérieur (CICES)'}</p>
            <p>📆 <strong>Dates :</strong> ${data.eventDate || 'À confirmer'}</p>
            <p>🕐 <strong>Horaires :</strong> 10h00 - 19h00</p>
          </div>
          
          <div class="important">
            <p style="margin-top: 0;"><strong>⚠️ Important :</strong></p>
            <ul>
              <li>Conservez ce email ou prenez une capture d'écran de vos QR codes</li>
              <li>Présentez le QR code à l'entrée pour scanner</li>
              <li>Chaque billet ne peut être utilisé qu'une seule fois</li>
              <li>Les enfants de moins de 5 ans entrent gratuitement (sans billet)</li>
            </ul>
          </div>
          
          <p>Nous avons hâte de vous accueillir !</p>
          
          <p style="margin-top: 30px;">
            Cordialement,<br>
            <strong>L'équipe ${data.eventName}</strong>
          </p>
        </div>
        
        <div class="footer">
          <p>${data.eventName}<br>
          ${data.eventLocation || 'CICES - Route de Ouakam, Dakar, Sénégal'}</p>
          <p style="font-size: 12px; color: #999; margin-top: 10px;">
            Cet email a été envoyé à ${data.to}<br>
            <a href="#" style="color: #999;">Se désabonner</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({ to: data.to, subject, html })
}

