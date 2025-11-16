/**
 * Utilitaires pour exporter le canvas Fabric.js en PNG et PDF
 */

import { Canvas } from 'fabric'
import jsPDF from 'jspdf'
import { downloadFile } from '@/lib/utils'

/**
 * Exporte le canvas en PNG
 */
export async function exportCanvasToPNG(
  canvas: Canvas,
  filename: string = 'badge-design.png'
): Promise<void> {
  try {
    // Obtenir l'image en haute qualité
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2, // 2x pour meilleure qualité
    })

    // Convertir en blob
    const response = await fetch(dataURL)
    const blob = await response.blob()

    // Télécharger
    downloadFile(blob, filename)
  } catch (error) {
    console.error('Erreur lors de l\'export PNG:', error)
    throw error
  }
}

/**
 * Exporte le canvas en PDF
 */
export async function exportCanvasToPDF(
  canvas: Canvas,
  dimensions: { width: number; height: number }, // en mm
  filename: string = 'badge-design.pdf'
): Promise<void> {
  try {
    // Obtenir l'image du canvas
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    })

    // Créer le PDF avec les dimensions correctes
    const pdf = new jsPDF({
      orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [dimensions.width, dimensions.height],
    })

    // Ajouter l'image au PDF
    pdf.addImage(dataURL, 'PNG', 0, 0, dimensions.width, dimensions.height)

    // Générer le blob et télécharger
    const pdfBlob = pdf.output('blob')
    downloadFile(pdfBlob, filename)
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error)
    throw error
  }
}

/**
 * Exporte le canvas recto et verso en PDF
 */
export async function exportCanvasDuplexToPDF(
  rectoCanvas: Canvas,
  versoCanvas: Canvas,
  dimensions: { width: number; height: number },
  filename: string = 'badge-design-duplex.pdf'
): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [dimensions.width, dimensions.height],
    })

    // Recto
    const rectoDataURL = rectoCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    })
    pdf.addImage(rectoDataURL, 'PNG', 0, 0, dimensions.width, dimensions.height)

    // Verso (nouvelle page)
    pdf.addPage([dimensions.width, dimensions.height])
    const versoDataURL = versoCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    })
    pdf.addImage(versoDataURL, 'PNG', 0, 0, dimensions.width, dimensions.height)

    // Télécharger
    const pdfBlob = pdf.output('blob')
    downloadFile(pdfBlob, filename)
  } catch (error) {
    console.error('Erreur lors de l\'export PDF duplex:', error)
    throw error
  }
}

