'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { 
  Download, Share2, Copy, CheckCircle, 
  Smartphone, Wallet, Link2, Mail, MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ExportStepProps {
  profile: any
}

export function ExportStep({ profile }: ExportStepProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  const profileUrl = `https://card.xarala.com/${profile.slug}`

  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(profileUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrCodeUrl(url)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }
    generateQR()
  }, [profileUrl])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopiedLink(true)
    toast.success('Lien copié !')
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const generateVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.firstName} ${profile.lastName}
N:${profile.lastName};${profile.firstName};;;
ORG:${profile.company}
TITLE:${profile.title}
TEL:${profile.phone}
EMAIL:${profile.email}
URL:${profile.website}
ADR:;;;;;;${profile.location}
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.firstName}-${profile.lastName}.vcf`
    a.click()
    toast.success('vCard téléchargée !')
  }

  const downloadQR = () => {
    if (!qrCodeUrl) return
    const a = document.createElement('a')
    a.href = qrCodeUrl
    a.download = 'qr-code.png'
    a.click()
    toast.success('QR Code téléchargé !')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Félicitations ! 🎉</h2>
        <p className="text-gray-600">Votre carte est prête à être partagée</p>
      </div>

      {qrCodeUrl && (
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-xl font-black text-gray-900 mb-2">Votre QR Code</h3>
          </div>
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-white rounded-2xl shadow-xl border-4 border-gray-100">
              <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={downloadQR}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Télécharger QR</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Link2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">Lien de partage</h3>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-mono text-sm"
          />
          <button
            onClick={handleCopyLink}
            className={`px-6 py-3 font-bold rounded-xl transition-all ${
              copiedLink ? 'bg-green-500 text-white' : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {copiedLink ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={generateVCard}
          className="flex items-start gap-4 p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-500 transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="font-black text-gray-900 mb-1">Télécharger vCard</div>
            <div className="text-sm text-gray-600">Format compatible</div>
          </div>
        </button>

        <button className="flex items-start gap-4 p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-800 transition-all text-left">
          <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-black text-gray-900 mb-1">Apple Wallet</div>
            <div className="text-sm text-gray-600">iOS</div>
          </div>
        </button>
      </div>
    </motion.div>
  )
}

