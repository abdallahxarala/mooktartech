import QRCode from 'qrcode'
import { CardData } from '@/lib/store/card-editor-store'

export interface QRCodeOptions {
  color: string
  shape: 'square' | 'round' | 'dots'
  logo?: string | null
  size: number
}

export interface QRCodeData {
  type: 'vcard' | 'url' | 'whatsapp' | 'email'
  content: string
}

/**
 * Generate QR Code data based on type and card data
 */
export function generateQRData(card: CardData): QRCodeData {
  switch (card.qrType) {
    case 'vcard':
      return {
        type: 'vcard',
        content: generateVCard(card)
      }
    
    case 'url':
      return {
        type: 'url',
        content: card.shortUrl || `https://xarala.sn/c/${card.id}`
      }
    
    case 'whatsapp':
      return {
        type: 'whatsapp',
        content: `https://wa.me/${card.phone.replace(/[^\d]/g, '')}`
      }
    
    case 'email':
      return {
        type: 'email',
        content: `mailto:${card.email}`
      }
    
    default:
      return {
        type: 'vcard',
        content: generateVCard(card)
      }
  }
}

/**
 * Generate vCard format string
 */
export function generateVCard(card: CardData): string {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${card.firstName} ${card.lastName}`,
    `N:${card.lastName};${card.firstName};;;`,
  ]

  if (card.title) vcard.push(`TITLE:${card.title}`)
  if (card.company) vcard.push(`ORG:${card.company}`)
  if (card.email) vcard.push(`EMAIL:${card.email}`)
  if (card.phone) vcard.push(`TEL:${card.phone}`)
  if (card.website) vcard.push(`URL:${card.website}`)
  if (card.address) vcard.push(`ADR:;;${card.address};;;;`)

  vcard.push('END:VCARD')
  
  return vcard.join('\n')
}

/**
 * Generate QR Code as data URL
 */
export async function generateQRCode(
  data: string, 
  options: QRCodeOptions
): Promise<string> {
  try {
    const qrOptions: QRCode.QRCodeToDataURLOptions = {
      width: options.size,
      margin: 2,
      color: {
        dark: options.color,
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    }

    let qrDataURL = await QRCode.toDataURL(data, qrOptions)
    
    // Add logo if provided
    if (options.logo) {
      qrDataURL = await addLogoToQR(qrDataURL, options.logo, options.size)
    }
    
    return qrDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

/**
 * Add logo to QR code center
 */
async function addLogoToQR(
  qrDataURL: string, 
  logoDataURL: string, 
  qrSize: number
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    canvas.width = qrSize
    canvas.height = qrSize
    
    const qrImage = new Image()
    qrImage.onload = () => {
      // Draw QR code
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize)
      
      // Draw logo in center
      const logoSize = qrSize * 0.2 // 20% of QR size
      const logoX = (qrSize - logoSize) / 2
      const logoY = (qrSize - logoSize) / 2
      
      const logoImage = new Image()
      logoImage.onload = () => {
        // Draw white background for logo
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4)
        
        // Draw logo
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize)
        
        resolve(canvas.toDataURL())
      }
      logoImage.src = logoDataURL
    }
    qrImage.src = qrDataURL
  })
}

/**
 * Generate QR code with custom styling
 */
export async function generateStyledQRCode(
  card: CardData
): Promise<string> {
  const qrData = generateQRData(card)
  return generateQRCode(qrData.content, card.qrStyle)
}

/**
 * Download QR code as image
 */
export function downloadQRCode(qrDataURL: string, filename: string = 'qr-code.png') {
  const link = document.createElement('a')
  link.download = filename
  link.href = qrDataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Get QR code size recommendations
 */
export function getQRSizeRecommendations(): Array<{ size: number; label: string; description: string }> {
  return [
    { size: 80, label: 'Petit', description: 'Pour cartes compactes' },
    { size: 100, label: 'Moyen', description: 'Taille standard' },
    { size: 120, label: 'Grand', description: 'Pour visibilité maximale' },
    { size: 150, label: 'Très grand', description: 'Pour affichage distant' }
  ]
}

/**
 * Validate QR code data
 */
export function validateQRData(card: CardData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (card.qrType === 'vcard') {
    if (!card.firstName && !card.lastName) {
      errors.push('Le nom est requis pour le QR code vCard')
    }
    if (!card.email && !card.phone) {
      errors.push('Au moins un email ou téléphone est requis')
    }
  }
  
  if (card.qrType === 'url' && !card.shortUrl) {
    errors.push('URL courte requise pour le QR code URL')
  }
  
  if (card.qrType === 'whatsapp' && !card.phone) {
    errors.push('Numéro de téléphone requis pour WhatsApp')
  }
  
  if (card.qrType === 'email' && !card.email) {
    errors.push('Email requis pour le QR code email')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
