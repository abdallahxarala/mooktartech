import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { saveAs } from 'file-saver'
import { CardData } from '@/lib/store/card-editor-store'
import { generateVCard } from './qr-generator'

export interface ExportOptions {
  format: 'png' | 'pdf' | 'vcard' | 'json'
  quality?: number
  filename?: string
  includeQR?: boolean
}

/**
 * Export card as PNG image
 */
export async function exportCardAsPNG(
  cardElement: HTMLElement,
  options: ExportOptions = { format: 'png' }
): Promise<void> {
  try {
    const canvas = await html2canvas(cardElement, {
      scale: 3, // High resolution
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      width: 400,
      height: 250
    })
    
    canvas.toBlob((blob) => {
      if (blob) {
        const filename = options.filename || `carte-${Date.now()}.png`
        saveAs(blob, filename)
      }
    }, 'image/png', options.quality || 0.95)
  } catch (error) {
    console.error('Error exporting PNG:', error)
    throw error
  }
}

/**
 * Export card as PDF
 */
export async function exportCardAsPDF(
  cardElement: HTMLElement,
  options: ExportOptions = { format: 'pdf' }
): Promise<void> {
  try {
    const canvas = await html2canvas(cardElement, {
      scale: 2,
      backgroundColor: '#FFFFFF',
      useCORS: true,
      allowTaint: true,
      width: 400,
      height: 250
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 53.98] // Credit card size
    })
    
    pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98)
    
    const filename = options.filename || `carte-${Date.now()}.pdf`
    pdf.save(filename)
  } catch (error) {
    console.error('Error exporting PDF:', error)
    throw error
  }
}

/**
 * Export card as vCard file
 */
export function exportCardAsVCard(card: CardData): void {
  try {
    const vcardContent = generateVCard(card)
    const blob = new Blob([vcardContent], { type: 'text/vcard' })
    
    const filename = options.filename || `${card.firstName}-${card.lastName}.vcf`
    saveAs(blob, filename)
  } catch (error) {
    console.error('Error exporting vCard:', error)
    throw error
  }
}

/**
 * Export card data as JSON
 */
export function exportCardAsJSON(card: CardData): void {
  try {
    const jsonContent = JSON.stringify(card, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    
    const filename = options.filename || `carte-${card.id}.json`
    saveAs(blob, filename)
  } catch (error) {
    console.error('Error exporting JSON:', error)
    throw error
  }
}

/**
 * Main export function
 */
export async function exportCard(
  cardElement: HTMLElement,
  card: CardData,
  options: ExportOptions
): Promise<void> {
  switch (options.format) {
    case 'png':
      await exportCardAsPNG(cardElement, options)
      break
    case 'pdf':
      await exportCardAsPDF(cardElement, options)
      break
    case 'vcard':
      exportCardAsVCard(card)
      break
    case 'json':
      exportCardAsJSON(card)
      break
    default:
      throw new Error(`Unsupported export format: ${options.format}`)
  }
}

/**
 * Generate print-ready version
 */
export async function generatePrintVersion(
  cardElement: HTMLElement,
  options: { copies?: number; bleed?: number } = {}
): Promise<void> {
  const { copies = 1, bleed = 3 } = options
  
  try {
    const canvas = await html2canvas(cardElement, {
      scale: 4, // Very high resolution for print
      backgroundColor: '#FFFFFF',
      useCORS: true,
      allowTaint: true,
      width: 400,
      height: 250
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'A4'
    })
    
    const cardWidth = 85.6 + (bleed * 2)
    const cardHeight = 53.98 + (bleed * 2)
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Calculate positions for multiple copies
    const cardsPerRow = Math.floor(pageWidth / cardWidth)
    const cardsPerColumn = Math.floor(pageHeight / cardHeight)
    const cardsPerPage = cardsPerRow * cardsPerColumn
    
    let currentPage = 1
    let cardsPlaced = 0
    
    for (let copy = 0; copy < copies; copy++) {
      if (cardsPlaced >= cardsPerPage) {
        pdf.addPage()
        currentPage++
        cardsPlaced = 0
      }
      
      const row = Math.floor(cardsPlaced / cardsPerRow)
      const col = cardsPlaced % cardsPerRow
      
      const x = col * cardWidth + bleed
      const y = row * cardHeight + bleed
      
      pdf.addImage(imgData, 'PNG', x, y, cardWidth - bleed, cardHeight - bleed)
      cardsPlaced++
    }
    
    pdf.save(`cartes-impression-${Date.now()}.pdf`)
  } catch (error) {
    console.error('Error generating print version:', error)
    throw error
  }
}

/**
 * Get export format recommendations
 */
export function getExportRecommendations(): Array<{
  format: ExportOptions['format']
  label: string
  description: string
  icon: string
}> {
  return [
    {
      format: 'png',
      label: 'PNG',
      description: 'Image haute qualité pour le web',
      icon: '🖼️'
    },
    {
      format: 'pdf',
      label: 'PDF',
      description: 'Document pour impression professionnelle',
      icon: '📄'
    },
    {
      format: 'vcard',
      label: 'vCard',
      description: 'Contact pour téléphones et logiciels',
      icon: '📇'
    },
    {
      format: 'json',
      label: 'JSON',
      description: 'Données brutes pour sauvegarde',
      icon: '💾'
    }
  ]
}

/**
 * Validate export options
 */
export function validateExportOptions(options: ExportOptions): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (options.quality && (options.quality < 0 || options.quality > 1)) {
    errors.push('La qualité doit être entre 0 et 1')
  }
  
  if (options.filename && !options.filename.match(/^[a-zA-Z0-9._-]+$/)) {
    errors.push('Le nom de fichier contient des caractères invalides')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
