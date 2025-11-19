/**
 * Client Resend pour l'envoi d'emails transactionnels
 * Foire Internationale de Dakar 2025
 */

import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Fonction générique d'envoi d'email
 * 
 * @param options - Options d'envoi
 * @returns Données de l'email envoyé
 * @throws Error si l'envoi échoue
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = 'Foire Dakar 2025 <noreply@foire-dakar-2025.com>',
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log('✅ Email sent successfully:', data?.id)
    return data
  } catch (error) {
    console.error('Error in sendEmail:', error)
    throw error
  }
}

