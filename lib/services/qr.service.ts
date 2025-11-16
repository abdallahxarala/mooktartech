/**
 * Service pour la génération de QR codes pour tickets
 */

import QRCode from 'qrcode'
import ShortUniqueId from 'short-unique-id'

const uid = new ShortUniqueId({ length: 12 })

export interface GenerateTicketQRParams {
  ticketId: string
  badgeId: string
  eventId: string
  ticketType: string
  visitorName: string
}

export interface TicketQRResult {
  qrCodeData: string // Data encodée dans le QR
  qrCodeUrl: string // URL de l'image QR code (base64)
  qrCodeSvg: string // SVG du QR code
}

/**
 * Générer un QR code pour un ticket
 */
export async function generateTicketQR(
  params: GenerateTicketQRParams
): Promise<TicketQRResult> {
  try {
    // Créer les données à encoder dans le QR code
    const qrData = JSON.stringify({
      ticket_id: params.ticketId,
      badge_id: params.badgeId,
      event_id: params.eventId,
      type: params.ticketType,
      name: params.visitorName,
      timestamp: Date.now(),
    })

    // URL de vérification du ticket
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const verifyUrl = `${baseUrl}/tickets/verify/${params.badgeId}`

    // Générer le QR code en PNG (base64)
    const qrCodeUrl = await QRCode.toDataURL(verifyUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // High pour plus de robustesse
    })

    // Générer le QR code en SVG
    const qrCodeSvg = await QRCode.toString(verifyUrl, {
      type: 'svg',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })

    return {
      qrCodeData: qrData,
      qrCodeUrl,
      qrCodeSvg,
    }
  } catch (error) {
    console.error('Error generating ticket QR code:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Erreur lors de la génération du QR code'
    )
  }
}

/**
 * Générer un ID de ticket unique
 */
export function generateTicketId(): string {
  return `TKT-${uid.rnd().toUpperCase()}`
}

