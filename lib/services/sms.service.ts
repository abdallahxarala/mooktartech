/**
 * Service pour l'envoi de SMS (Twilio)
 */

export interface SendSMSParams {
  to: string
  message: string
}

export interface SendSMSResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Envoyer un SMS via Twilio
 */
export async function sendSMS(params: SendSMSParams): Promise<SendSMSResult> {
  try {
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.warn('Twilio credentials not configured, skipping SMS')
      return {
        success: false,
        error: 'Twilio non configuré',
      }
    }

    // Formater le numéro de téléphone (ajouter + si nécessaire)
    const formattedPhone = params.to.startsWith('+') ? params.to : `+${params.to}`

    // Appel API Twilio
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          From: twilioPhoneNumber,
          To: formattedPhone,
          Body: params.message,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Twilio API error:', errorData)
      return {
        success: false,
        error: `Erreur Twilio: ${response.status}`,
      }
    }

    const data = await response.json()

    return {
      success: true,
      messageId: data.sid,
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Envoyer un SMS de confirmation de ticket
 */
export async function sendTicketConfirmationSMS(
  phone: string,
  ticketInfo: {
    badgeId: string
    ticketType: string
    eventName: string
    qrCodeUrl?: string
  }
): Promise<SendSMSResult> {
  const message = `🎫 Ticket confirmé pour ${ticketInfo.eventName}!\n\n` +
    `Badge: ${ticketInfo.badgeId}\n` +
    `Type: ${ticketInfo.ticketType}\n\n` +
    `Présentez ce QR code à l'entrée.\n` +
    `Merci de votre confiance!`

  return sendSMS({
    to: phone,
    message,
  })
}

