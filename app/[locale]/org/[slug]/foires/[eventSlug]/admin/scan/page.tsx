'use client'

import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { CheckCircle2, XCircle, AlertCircle, Loader2, Upload, Camera } from 'lucide-react'
import { useParams } from 'next/navigation'

interface ValidationResult {
  success: boolean
  valid: boolean
  ticket?: {
    id: string
    buyerName: string
    buyerEmail: string
    ticketType: string
    quantity: number
    used: boolean
    usedAt: string | null
  }
  error?: string
  message?: string
  markedAsUsed?: boolean
}

export default function ScanQRPage() {
  const params = useParams<{ locale: string; slug: string; eventSlug: string }>()
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraId, setCameraId] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scanAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Nettoyer le scanner au démontage
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current = null
          })
          .catch(() => {
            scannerRef.current = null
          })
      }
    }
  }, [])

  async function startScanning() {
    try {
      setError(null)
      setResult(null)

      // Obtenir la liste des caméras
      const devices = await Html5Qrcode.getCameras()
      if (devices.length === 0) {
        throw new Error('Aucune caméra trouvée')
      }

      // Utiliser la première caméra disponible (ou la caméra arrière si disponible)
      const preferredCamera = devices.find((d) => d.label.toLowerCase().includes('back')) || devices[0]
      setCameraId(preferredCamera.id)

      // Créer le scanner
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      // Démarrer le scan
      await scanner.start(
        preferredCamera.id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // QR code détecté
          handleQRScanned(decodedText)
        },
        (errorMessage) => {
          // Erreur de scan (ignorer les erreurs de décodage continu)
        }
      )

      setScanning(true)
    } catch (err) {
      console.error('Error starting scanner:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors du démarrage du scanner')
      setScanning(false)
    }
  }

  async function stopScanning() {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        await scannerRef.current.clear()
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
      scannerRef.current = null
    }
    setScanning(false)
    setCameraId(null)
  }

  async function handleQRScanned(qrData: string) {
    // Arrêter le scanner temporairement
    await stopScanning()

    try {
      // Valider le QR code via l'API
      const response = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrData,
          eventSlug: params.eventSlug,
          markAsUsed: true, // Marquer automatiquement comme utilisé si valide
        }),
      })

      const data = await response.json()
      setResult(data)

      // Si valide, attendre 2 secondes puis redémarrer le scan
      if (data.valid && data.markedAsUsed) {
        setTimeout(() => {
          setResult(null)
          startScanning()
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la validation')
      setResult({
        success: false,
        valid: false,
        error: 'Erreur lors de la validation du QR code',
      })
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setError(null)
      setResult(null)

      // Lire le fichier comme data URL
      const fileReader = new FileReader()
      fileReader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string

        try {
          // Utiliser Html5Qrcode pour décoder depuis l'image
          const scanner = new Html5Qrcode('qr-reader')
          
          // Convertir base64 en File
          const response = await fetch(imageDataUrl)
          const blob = await response.blob()
          const file = new File([blob], 'qr-upload.png', { type: 'image/png' })
          
          // Scanner le fichier
          const qrData = await scanner.scanFile(file, true)

          // Valider le QR code
          await handleQRScanned(qrData)
        } catch (err) {
          console.error('Erreur scan QR:', err)
          setError('Impossible de lire le code QR de cette image')
          setResult({
            success: false,
            valid: false,
            error: 'QR code introuvable dans l\'image',
          })
        }
      }
      fileReader.readAsDataURL(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du traitement de l\'image')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Scanner QR Code</h1>
          <p className="text-gray-600">Validez les billets à l'entrée de l'événement</p>
        </div>

        {/* Scanner Area */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div id="qr-reader" className="w-full max-w-md mx-auto mb-4" ref={scanAreaRef}></div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!scanning ? (
              <button
                onClick={startScanning}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                <Camera className="h-5 w-5" />
                Démarrer le scan
              </button>
            ) : (
              <button
                onClick={stopScanning}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Arrêter le scan
              </button>
            )}

            <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer">
              <Upload className="h-5 w-5" />
              Upload image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {result.valid && result.markedAsUsed ? (
              <div className="text-center">
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600 mb-2">✅ Billet Valide</h2>
                {result.ticket && (
                  <div className="mt-4 text-left max-w-md mx-auto">
                    <p><strong>Nom :</strong> {result.ticket.buyerName}</p>
                    <p><strong>Email :</strong> {result.ticket.buyerEmail}</p>
                    <p><strong>Type :</strong> {result.ticket.ticketType}</p>
                    <p><strong>Quantité :</strong> {result.ticket.quantity}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Billet marqué comme utilisé à {new Date().toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
            ) : result.valid && !result.markedAsUsed ? (
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-yellow-600 mb-2">⚠️ Billet Valide (Non marqué)</h2>
                <p className="text-gray-600">{result.message}</p>
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-600 mb-2">❌ Billet Invalide</h2>
                <p className="text-gray-600">{result.error || 'Erreur lors de la validation'}</p>
                {result.ticket?.used && (
                  <p className="mt-2 text-sm text-red-600">
                    Ce billet a déjà été utilisé le {result.ticket.usedAt ? new Date(result.ticket.usedAt).toLocaleString('fr-FR') : 'date inconnue'}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold mb-2">📋 Instructions :</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Cliquez sur "Démarrer le scan" pour activer la caméra</li>
            <li>Positionnez le QR code du billet devant la caméra</li>
            <li>Le billet sera automatiquement validé et marqué comme utilisé</li>
            <li>Vous pouvez aussi uploader une image contenant un QR code</li>
            <li>Chaque billet ne peut être utilisé qu'une seule fois</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

