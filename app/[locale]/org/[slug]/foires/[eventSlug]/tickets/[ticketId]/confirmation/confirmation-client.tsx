'use client'

import { CheckCircle, Download, Mail, Calendar, MapPin, Ticket } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'

interface ConfirmationClientProps {
  ticket: any
  locale: string
  slug: string
}

export function ConfirmationClient({ 
  ticket, 
  locale, 
  slug 
}: ConfirmationClientProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [loadingQR, setLoadingQR] = useState(true)

  useEffect(() => {
    // Générer l'image QR code
    if (ticket.qr_code) {
      QRCode.toDataURL(ticket.qr_code, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then((url) => {
          setQrCodeUrl(url)
          setLoadingQR(false)
        })
        .catch((err) => {
          console.error('Erreur génération QR code:', err)
          setLoadingQR(false)
        })
    } else {
      setLoadingQR(false)
    }
  }, [ticket.qr_code])

  const handlePrint = () => {
    window.print()
  }

  const handleEmail = () => {
    const subject = encodeURIComponent(`Votre billet ${ticket.event.name}`)
    const body = encodeURIComponent(`
Bonjour,

Voici votre billet pour ${ticket.event.name}.

Type : ${ticket.ticket_type}
Quantité : ${ticket.quantity}
Prix : ${ticket.total_price.toLocaleString()} FCFA

Code QR : ${ticket.qr_code}

Présentez ce QR code à l'entrée de l'événement.

Cordialement,
L'équipe Foire Dakar
    `)
    window.location.href = `mailto:${ticket.buyer_email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header Success */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paiement réussi !
            </h1>
            <p className="text-gray-600">
              Votre billet a été généré avec succès
            </p>
          </div>

          {/* Event Info */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{ticket.event.name}</h2>
            <div className="space-y-3">
              {ticket.event.start_date && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span>
                    {new Date(ticket.event.start_date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {ticket.event.location && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span>{ticket.event.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* QR Code */}
          {loadingQR ? (
            <div className="text-center mb-6">
              <div className="inline-block p-4">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
              </div>
              <p className="text-sm text-gray-600 mt-4">Génération du QR code...</p>
            </div>
          ) : qrCodeUrl ? (
            <div className="text-center mb-6">
              <p className="text-sm font-medium text-gray-700 mb-4">
                Présentez ce QR code à l'entrée
              </p>
              <div className="inline-block p-6 bg-white border-4 border-green-500 rounded-xl shadow-lg">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code billet" 
                  className="w-64 h-64"
                />
              </div>
              <p className="text-xs text-gray-500 mt-3 font-mono">
                {ticket.qr_code}
              </p>
            </div>
          ) : (
            <div className="text-center mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                QR code non disponible. Contactez le support.
              </p>
            </div>
          )}

          {/* Ticket Details */}
          <div className="border-t pt-6 mb-6">
            <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
              <Ticket className="h-5 w-5 text-green-600" />
              <span>Détails du billet</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Type de billet</span>
                <span className="font-medium capitalize">{ticket.ticket_type}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Quantité</span>
                <span className="font-medium">{ticket.quantity}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Acheteur</span>
                <span className="font-medium">{ticket.buyer_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-sm">{ticket.buyer_email}</span>
              </div>
              {ticket.buyer_phone && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Téléphone</span>
                  <span className="font-medium">{ticket.buyer_phone}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Méthode de paiement</span>
                <span className="font-medium capitalize">
                  {ticket.payment_method?.replace('_', ' ') || 'Non défini'}
                </span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="font-bold text-lg">Total payé</span>
                <span className="font-bold text-green-600 text-xl">
                  {ticket.total_price.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 print:hidden">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Télécharger / Imprimer le billet</span>
            </button>

            <button
              onClick={handleEmail}
              className="w-full flex items-center justify-center space-x-2 border-2 border-green-600 text-green-600 py-3 px-6 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>Envoyer par email</span>
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">
              📧 Un email de confirmation a été envoyé à{' '}
              <span className="font-medium">{ticket.buyer_email}</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Conservez ce billet jusqu'au jour de l'événement
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

