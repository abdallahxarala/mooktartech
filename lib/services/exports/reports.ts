/**
 * Service d'export de rapports Excel
 * Foire Internationale de Dakar 2025
 */

import ExcelJS from 'exceljs'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Exporte la liste des exposants vers Excel
 * 
 * @param eventId - ID de l'événement
 * @returns Blob du fichier Excel
 */
export async function exportExhibitorsReport(eventId: string): Promise<Blob> {
  const supabase = await createSupabaseServerClient()

  // Récupérer tous les exposants
  const { data: exhibitors, error } = await supabase
    .from('exhibitors')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch exhibitors: ${error.message}`)
  }

  // Créer un nouveau workbook
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Exposants')

  // Définir les colonnes
  worksheet.columns = [
    { header: 'Entreprise', key: 'company_name', width: 30 },
    { header: 'Contact', key: 'contact_name', width: 25 },
    { header: 'Email', key: 'contact_email', width: 30 },
    { header: 'Téléphone', key: 'contact_phone', width: 20 },
    { header: 'Pavillon', key: 'booth_location', width: 15 },
    { header: 'Surface (m²)', key: 'surface', width: 15 },
    { header: 'Prix (FCFA)', key: 'payment_amount', width: 20 },
    { header: 'Statut Paiement', key: 'payment_status', width: 20 },
    { header: 'Statut', key: 'status', width: 15 },
    { header: 'Date Inscription', key: 'created_at', width: 20 },
  ]

  // Style de l'en-tête
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF667EEA' },
  }
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

  // Ajouter les données
  exhibitors?.forEach((exhibitor) => {
    const metadata = exhibitor.metadata || {}
    const standSize = metadata.standSize || metadata.stand_size || 0

    worksheet.addRow({
      company_name: exhibitor.company_name || '',
      contact_name: exhibitor.contact_name || '',
      contact_email: exhibitor.contact_email || '',
      contact_phone: exhibitor.contact_phone || '',
      booth_location: exhibitor.booth_location || 'Non assigné',
      surface: standSize,
      payment_amount: exhibitor.payment_amount || 0,
      payment_status: exhibitor.payment_status || 'Non payé',
      status: exhibitor.status || 'pending',
      created_at: new Date(exhibitor.created_at).toLocaleDateString('fr-FR'),
    })
  })

  // Formater les colonnes numériques
  worksheet.getColumn('surface').numFmt = '#,##0'
  worksheet.getColumn('payment_amount').numFmt = '#,##0 "FCFA"'

  // Alterner les couleurs des lignes
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber > 1) {
      // Lignes paires en gris clair
      if (rowNumber % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF5F5F5' },
        }
      }
    }
  })

  // Générer le buffer Excel
  const buffer = await workbook.xlsx.writeBuffer()

  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

/**
 * Télécharge un fichier Excel
 * 
 * @param blob - Blob du fichier Excel
 * @param filename - Nom du fichier
 */
export function downloadExcel(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

