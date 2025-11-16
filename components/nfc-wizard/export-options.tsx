'use client'

import React from 'react'
import { NFCProfile } from '@/lib/store/nfc-editor-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, QrCode, Smartphone, Mail, Link as LinkIcon, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ExportOptionsProps {
  profile: NFCProfile
  onShare?: () => void
}

export function ExportOptions({ profile, onShare }: ExportOptionsProps) {
  const profileUrl = `https://xarala.sn/u/${profile.slug}`

  const generateVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.firstName} ${profile.lastName}
N:${profile.lastName};${profile.firstName};;;
TITLE:${profile.title}
ORG:${profile.company}
EMAIL:${profile.email}
TEL:${profile.phone}
URL:${profile.website}
ADR:;;${profile.location};;;;
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.firstName}-${profile.lastName}.vcf`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('VCard téléchargée !')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success('Lien copié !')
    } catch {
      toast.error('Erreur lors de la copie')
    }
  }

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.firstName} ${profile.lastName}`,
          text: profile.tagline || `Connectez-vous avec ${profile.firstName}`,
          url: profileUrl
        })
        toast.success('Partagé !')
      } catch {
        toast.error('Partage annulé')
      }
    } else {
      copyLink()
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Exporter et partager</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Download vCard */}
        <Button
          onClick={generateVCard}
          variant="outline"
          className="h-auto py-4 flex-col gap-2"
        >
          <Download className="w-6 h-6" />
          <span>Télécharger vCard</span>
        </Button>

        {/* QR Code */}
        {profile.enableQRCode && (
          <Button
            onClick={() => {
              // TODO: Generate QR Code modal
              toast('Génération du QR Code...')
            }}
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
          >
            <QrCode className="w-6 h-6" />
            <span>QR Code</span>
          </Button>
        )}

        {/* Share */}
        <Button
          onClick={shareProfile}
          variant="outline"
          className="h-auto py-4 flex-col gap-2"
        >
          <Share2 className="w-6 h-6" />
          <span>Partager</span>
        </Button>

        {/* Copy Link */}
        <Button
          onClick={copyLink}
          variant="outline"
          className="h-auto py-4 flex-col gap-2"
        >
          <LinkIcon className="w-6 h-6" />
          <span>Copier le lien</span>
        </Button>
      </div>

      {/* URL Display */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">URL publique:</span>
            <code className="flex-1 text-orange-600 font-mono text-xs truncate">
              {profileUrl}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

