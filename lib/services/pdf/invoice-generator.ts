/**
 * Générateur de factures PDF pour les inscriptions exposants
 * Foire Internationale de Dakar 2025
 */

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Import conditionnel du client serveur Supabase
 * Ne s'exécute que côté serveur pour éviter le bundling dans le client
 */
async function getSupabaseServerClient() {
  if (typeof window !== 'undefined') {
    throw new Error('getSupabaseServerClient ne peut être utilisé que côté serveur')
  }
  const { createSupabaseServerClient } = await import('@/lib/supabase/server')
  return await createSupabaseServerClient()
}

/**
 * Interface pour les données de facture
 */
export interface InvoiceData {
  invoice_number: string // Format: FD2025-0001
  invoice_date: string // Format: DD/MM/YYYY
  exhibitor: {
    company_name: string
    contact_name: string
    email: string
    phone: string
    address?: string
  }
  items: Array<{
    description: string
    quantity: number
    unit_price: number
    total: number
  }>
  subtotal: number
  tva_rate: number // 18% au Sénégal
  tva_amount: number
  total: number
  payment_status: 'paid' | 'unpaid' | 'refunded' | 'failed' // Valeurs autorisées par Supabase CHECK constraint
}

/**
 * Génère un PDF de facture professionnel
 * 
 * @param data - Données de la facture
 * @returns Blob du PDF généré
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Blob> {
  const doc = new jsPDF()

  // 1. En-tête avec logo (si disponible)
  // TODO: Ajouter logo Foire Dakar si disponible
  // const logoUrl = '/logos/foire-dakar-logo.png'
  // doc.addImage(logoUrl, 'PNG', 15, 10, 40, 20)

  // 2. Titre "FACTURE" centré en haut
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('FACTURE', 105, 25, { align: 'center' })

  // 3. Informations Foire Dakar (gauche)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const foireInfo = [
    'Foire Internationale de Dakar 2025',
    'Centre International de Commerce Extérieur (CICES)',
    'Route de Ouakam, Dakar, Sénégal',
    'Tél: +221 33 827 53 97',
    'Email: contact@foire-dakar-2025.com',
  ]
  foireInfo.forEach((line, i) => {
    doc.text(line, 15, 40 + i * 5)
  })

  // 4. Informations facture (droite)
  const invoiceInfo = [
    `N° Facture: ${data.invoice_number}`,
    `Date: ${data.invoice_date}`,
    `Statut: ${data.payment_status === 'paid' ? 'PAYÉE' : data.payment_status === 'unpaid' ? 'NON PAYÉE' : data.payment_status === 'refunded' ? 'REMBOURSÉE' : 'ÉCHEC'}`,
  ]
  invoiceInfo.forEach((line, i) => {
    doc.text(line, 140, 40 + i * 5)
  })

  // 5. Informations client (encadré)
  doc.rect(15, 65, 180, 30) // Bordure
  doc.setFont('helvetica', 'bold')
  doc.text('FACTURÉ À:', 20, 72)
  doc.setFont('helvetica', 'normal')
  const clientInfo = [
    data.exhibitor.company_name,
    data.exhibitor.contact_name,
    data.exhibitor.email,
    data.exhibitor.phone,
    data.exhibitor.address || '',
  ].filter(Boolean) // Retirer les lignes vides

  clientInfo.forEach((line, i) => {
    doc.text(line, 20, 78 + i * 5)
  })

  // 6. Tableau des articles
  autoTable(doc, {
    startY: 105,
    head: [['Description', 'Quantité', 'Prix Unitaire', 'Total']],
    body: data.items.map(item => [
      item.description,
      item.quantity.toString(),
      `${item.unit_price.toLocaleString('fr-FR')} FCFA`,
      `${item.total.toLocaleString('fr-FR')} FCFA`,
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [102, 126, 234], // Bleu/violet Foire Dakar
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
  })

  // 7. Totaux (alignés à droite)
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFont('helvetica', 'normal')
  doc.text('Sous-total:', 145, finalY)
  doc.text(`${data.subtotal.toLocaleString('fr-FR')} FCFA`, 195, finalY, { align: 'right' })

  doc.text(`TVA (${data.tva_rate}%):`, 145, finalY + 7)
  doc.text(`${data.tva_amount.toLocaleString('fr-FR')} FCFA`, 195, finalY + 7, { align: 'right' })

  // Total en gras
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('TOTAL:', 145, finalY + 17)
  doc.text(`${data.total.toLocaleString('fr-FR')} FCFA`, 195, finalY + 17, { align: 'right' })

  // 8. Informations de paiement
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const paymentInfo = [
    'INFORMATIONS BANCAIRES:',
    'Banque: CBAO Groupe Attijariwafa Bank',
    'IBAN: SN08 SN01 5011 0000 0000 0000 0000',
    'Swift: CBAOSNDA',
  ]
  paymentInfo.forEach((line, i) => {
    doc.text(line, 15, finalY + 30 + i * 5)
  })

  // 9. Pied de page
  doc.setFontSize(8)
  doc.setTextColor(128)
  doc.text(
    'Merci de votre participation à la Foire Internationale de Dakar 2025',
    105,
    280,
    { align: 'center' }
  )

  // Retourner le Blob pour upload
  return doc.output('blob')
}

/**
 * Upload une facture vers Supabase Storage
 * 
 * @param invoiceBlob - Blob du PDF
 * @param exhibitorId - ID de l'exposant
 * @param invoiceNumber - Numéro de facture
 * @returns URL publique de la facture
 */
export async function uploadInvoiceToStorage(
  invoiceBlob: Blob,
  exhibitorId: string,
  invoiceNumber: string
): Promise<string> {
  const supabase = await getSupabaseServerClient()

  const fileName = `invoices/${exhibitorId}/${invoiceNumber}.pdf`

  const { data, error } = await supabase.storage
    .from('foire-dakar-documents')
    .upload(fileName, invoiceBlob, {
      contentType: 'application/pdf',
      upsert: true, // Remplacer si existe déjà
    })

  if (error) {
    console.error('Error uploading invoice:', error)
    throw new Error(`Failed to upload invoice: ${error.message}`)
  }

  // Obtenir URL publique
  const { data: { publicUrl } } = supabase.storage
    .from('foire-dakar-documents')
    .getPublicUrl(fileName)

  if (!publicUrl) {
    throw new Error('Failed to get public URL for invoice')
  }

  return publicUrl
}

/**
 * Génère un numéro de facture unique et séquentiel
 * Format: FD2025-0001
 * 
 * @param exhibitorNumber - Numéro séquentiel de l'exposant
 * @returns Numéro de facture formaté
 */
export function generateInvoiceNumber(exhibitorNumber: number): string {
  return `FD2025-${exhibitorNumber.toString().padStart(4, '0')}`
}

/**
 * Construit les données de facture à partir d'un exposant
 * 
 * @param exhibitor - Données de l'exposant depuis Supabase
 * @param event - Données de l'événement
 * @returns Données formatées pour la facture
 */
export function buildInvoiceDataFromExhibitor(
  exhibitor: any,
  event: any
): InvoiceData {
  const items: InvoiceData['items'] = []

  // Récupérer la config de l'événement
  const foireConfig = event?.foire_config || {}
  const tarification = foireConfig.tarification || {}
  const prixM2 = tarification.prix_m2 || 0
  const tva_rate = tarification.tva_pourcent || 18

  // Récupérer les données depuis metadata si disponible, sinon utiliser les colonnes directes
  const metadata = exhibitor.metadata || {}
  
  // Essayer de récupérer standSize depuis différentes sources
  let standSize = 0
  if (metadata.stand_size) standSize = metadata.stand_size
  else if (metadata.standSize) standSize = metadata.standSize
  else if (metadata.stand_size_m2) standSize = metadata.stand_size_m2
  
  // Si toujours 0, essayer de calculer depuis payment_amount et prixM2
  if (standSize === 0 && exhibitor.payment_amount && prixM2 > 0) {
    standSize = Math.round(exhibitor.payment_amount / prixM2)
  }
  
  const pavillonCode = exhibitor.booth_location || metadata.pavillon_code || metadata.pavillonCode || ''
  const furnitureOptions = metadata.furniture_options || metadata.furnitureOptions || {}
  const optionsMeubles = tarification.options_meubles || {}

  // Item 1 : Location stand
  if (standSize > 0) {
    const standPrice = prixM2 > 0 ? prixM2 : (exhibitor.payment_amount || 0) / (standSize || 1)
    items.push({
      description: `Location stand ${standSize}m²${pavillonCode ? ` - Pavillon ${pavillonCode}` : ''}`,
      quantity: standSize,
      unit_price: standPrice,
      total: standSize * standPrice,
    })
  }

  // Items 2+ : Meubles et équipements (si disponibles)
  Object.entries(furnitureOptions).forEach(([key, quantity]: [string, any]) => {
    const furnitureOption = optionsMeubles[key]
    if (furnitureOption && quantity > 0) {
      items.push({
        description: `${furnitureOption.nom || key} (location)`,
        quantity: Number(quantity),
        unit_price: furnitureOption.prix || 0,
        total: Number(quantity) * (furnitureOption.prix || 0),
      })
    }
  })

  // Si aucun item trouvé, créer un item générique basé sur payment_amount
  if (items.length === 0 && exhibitor.payment_amount) {
    // Calculer le montant HT depuis le montant TTC
    const totalTTC = exhibitor.payment_amount
    const totalHT = totalTTC / (1 + tva_rate / 100)
    const tvaAmount = totalTTC - totalHT

    items.push({
      description: `Inscription Foire Dakar 2025 - Stand ${pavillonCode || 'non assigné'}`,
      quantity: 1,
      unit_price: totalHT,
      total: totalHT,
    })
  }

  // Calculer les totaux
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const tva_amount = Math.round(subtotal * (tva_rate / 100))
  const total = subtotal + tva_amount

  // Si payment_amount existe et diffère, utiliser celui-ci comme référence
  const finalTotal = exhibitor.payment_amount && Math.abs(exhibitor.payment_amount - total) > 1
    ? exhibitor.payment_amount
    : total

  // Générer le numéro de facture
  // Utiliser booth_number si disponible, sinon un compteur basé sur l'ID
  const exhibitorNumber = exhibitor.booth_number
    ? parseInt(exhibitor.booth_number) || 1
    : parseInt(exhibitor.id.slice(0, 4), 16) % 10000 || 1
  const invoiceNumber = generateInvoiceNumber(exhibitorNumber)

  return {
    invoice_number: invoiceNumber,
    invoice_date: exhibitor.created_at
      ? new Date(exhibitor.created_at).toLocaleDateString('fr-FR')
      : new Date().toLocaleDateString('fr-FR'),
    exhibitor: {
      company_name: exhibitor.company_name || '',
      contact_name: exhibitor.contact_name || '',
      email: exhibitor.contact_email || '',
      phone: exhibitor.contact_phone || '',
      address: metadata.address || '',
    },
    items,
    subtotal,
    tva_rate,
    tva_amount,
    total: finalTotal,
    payment_status: (exhibitor.payment_status || 'unpaid') as 'paid' | 'unpaid' | 'refunded' | 'failed',
  }
}

/**
 * Fonction principale : Génère une facture complète pour un exposant
 * 
 * Cette fonction fait tout le processus :
 * 1. Récupère les données exhibitor + event depuis Supabase
 * 2. Construit les données de facture
 * 3. Génère le PDF
 * 4. Upload vers Supabase Storage
 * 5. Met à jour exhibitors.invoice_url
 * 
 * @param exhibitorId - ID de l'exposant
 * @returns URL publique de la facture et numéro de facture
 */
export async function generateExhibitorInvoice(
  exhibitorId: string
): Promise<{ invoiceUrl: string; invoiceNumber: string }> {
  const supabase = await getSupabaseServerClient()

  try {
    // 1. Récupérer l'exposant
    const { data: exhibitor, error: exhibitorError } = await supabase
      .from('exhibitors')
      .select('*')
      .eq('id', exhibitorId)
      .single()

    if (exhibitorError || !exhibitor) {
      throw new Error(`Exhibitor not found: ${exhibitorId}`)
    }

    // 2. Récupérer l'événement
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', exhibitor.event_id)
      .single()

    if (eventError || !event) {
      throw new Error(`Event not found for exhibitor ${exhibitorId}`)
    }

    // 3. Vérifier si une facture existe déjà dans metadata
    const metadata = exhibitor.metadata || {}
    if (metadata.invoice_url && metadata.invoice_number) {
      console.log(`ℹ️ Facture déjà générée pour ${exhibitorId}: ${metadata.invoice_number}`)
      return {
        invoiceUrl: metadata.invoice_url,
        invoiceNumber: metadata.invoice_number,
      }
    }

    // 4. Construire les données de facture
    const invoiceData = buildInvoiceDataFromExhibitor(exhibitor, event)

    // 5. Générer le PDF
    const pdfBlob = await generateInvoicePDF(invoiceData)

    // 6. Upload vers Supabase Storage
    const invoiceUrl = await uploadInvoiceToStorage(
      pdfBlob,
      exhibitorId,
      invoiceData.invoice_number
    )

    // 7. Mettre à jour exhibitors.invoice_url dans la base
    const { error: updateError } = await supabase
      .from('exhibitors')
      .update({
        invoice_url: invoiceUrl, // Colonne directe si elle existe
        metadata: {
          ...metadata,
          invoice_url: invoiceUrl,
          invoice_number: invoiceData.invoice_number,
          invoice_generated_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', exhibitorId)

    if (updateError) {
      console.warn('⚠️ Erreur mise à jour invoice_url (non bloquant):', updateError)
      // Continue quand même, la facture est générée
    }

    console.log(`✅ Facture générée pour ${exhibitorId}: ${invoiceData.invoice_number}`)

    return {
      invoiceUrl,
      invoiceNumber: invoiceData.invoice_number,
    }
  } catch (error) {
    console.error(`❌ Erreur génération facture pour ${exhibitorId}:`, error)
    throw error
  }
}

