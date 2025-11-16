/**
 * Composant de confirmation avec QR code
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Download, QrCode, Mail, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import { jsPDF } from 'jspdf'
import type { TicketPurchase } from '@/lib/types/ticket'

interface TicketConfirmationProps {
  ticket: TicketPurchase
  onDownloadPDF?: () => void
}

export function TicketConfirmation({ ticket, onDownloadPDF }: TicketConfirmationProps) {
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [85, 54], // Format carte de crédit
    })

    // Fond
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, 85, 54, 'F')

    // Titre
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('TICKET FOIRE', 42.5, 10, { align: 'center' })

    // Nom visiteur
    doc.setFontSize(12)
    doc.text(
      `${ticket.visitor_info.first_name} ${ticket.visitor_info.last_name}`,
      42.5,
      20,
      { align: 'center' }
    )

    // Badge ID
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Badge: ${ticket.badge_id}`, 42.5, 28, { align: 'center' })

    // QR Code (ajouter l'image base64)
    if (ticket.qr_code_url) {
      doc.addImage(ticket.qr_code_url, 'PNG', 30, 32, 25, 25)
    }

    // Type ticket
    doc.setFontSize(8)
    doc.setTextColor(0, 0, 0)
    doc.text(
      `Type: ${ticket.ticket_type.toUpperCase()}`,
      42.5,
      50,
      { align: 'center' }
    )

    doc.save(`ticket-${ticket.badge_id}.pdf`)
    onDownloadPDF?.()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Message de succès */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-900">Paiement confirmé !</h2>
              <p className="text-green-700">
                Votre ticket a été généré avec succès. Vous allez recevoir le QR code par SMS.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ticket */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Votre ticket</span>
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              {ticket.ticket_type.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              {ticket.qr_code_url ? (
                <Image
                  src={ticket.qr_code_url}
                  alt="QR Code Ticket"
                  width={200}
                  height={200}
                  className="w-[200px] h-[200px]"
                />
              ) : (
                <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 text-center">
              Présentez ce QR code à l'entrée de la foire
            </p>
          </div>

          {/* Informations */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">Badge ID</p>
              <p className="font-semibold">{ticket.badge_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Visiteur</p>
              <p className="font-semibold">
                {ticket.visitor_info.first_name} {ticket.visitor_info.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Téléphone</p>
              <p className="font-semibold">{ticket.visitor_info.phone}</p>
            </div>
            {ticket.visitor_info.email && (
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{ticket.visitor_info.email}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="flex-1 h-12"
            >
              <Download className="w-5 h-5 mr-2" />
              Télécharger PDF
            </Button>
            {ticket.sms_sent && (
              <Button variant="outline" className="flex-1 h-12" disabled>
                <MessageSquare className="w-5 h-5 mr-2" />
                SMS envoyé
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

