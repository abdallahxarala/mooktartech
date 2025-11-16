'use client'

import React, { useState } from 'react'
import { CardData } from '@/lib/store/card-editor-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { X, Copy, Check, ExternalLink, QrCode } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  card: CardData
}

export function ShareModal({ isOpen, onClose, card }: ShareModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  if (!isOpen) return null

  const publicUrl = card.shortUrl || `https://xarala.sn/c/${card.id}`

  const copyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch (error) {
      console.error('Copy error:', error)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      // Simulate publish action
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Carte publiée avec succès !')
    } catch (error) {
      console.error('Publish error:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Partager votre carte</h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* URL publique */}
          <div>
            <Label>URL publique</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                value={publicUrl}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={copyPublicUrl}
                size="sm"
                variant="outline"
                className="flex items-center space-x-2"
              >
                {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUrl ? 'Copié' : 'Copier'}</span>
              </Button>
              <Button
                onClick={() => window.open(publicUrl, '_blank')}
                size="sm"
                variant="outline"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div>
            <div className="flex items-center justify-between">
              <Label>QR Code de partage</Label>
              <Button
                onClick={() => setShowQR(!showQR)}
                size="sm"
                variant="outline"
                className="flex items-center space-x-2"
              >
                <QrCode className="w-4 h-4" />
                <span>{showQR ? 'Masquer' : 'Afficher'}</span>
              </Button>
            </div>
            {showQR && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg text-center">
                <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center mb-2">
                  <span className="text-gray-400">QR Code</span>
                </div>
                <p className="text-sm text-gray-500">
                  Scannez pour accéder à votre carte
                </p>
              </div>
            )}
          </div>

          {/* Options de partage */}
          <div className="space-y-4">
            <h3 className="font-medium">Options de partage</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Carte publique</Label>
                <p className="text-sm text-gray-500">Visible par tous</p>
              </div>
              <Switch
                checked={card.isPublic}
                onCheckedChange={(checked) => {
                  // This would be handled by the store
                  console.log('Public toggle:', checked)
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Protégé par mot de passe</Label>
                <p className="text-sm text-gray-500">Accès sécurisé</p>
              </div>
              <Switch disabled />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Expiration</Label>
                <p className="text-sm text-gray-500">Date d'expiration</p>
              </div>
              <Switch disabled />
            </div>
          </div>

          {/* Statistiques */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-3">Statistiques</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{card.views}</div>
                <div className="text-sm text-gray-500">Vues</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{card.downloads}</div>
                <div className="text-sm text-gray-500">Téléchargements</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{card.socialLinks.length}</div>
                <div className="text-sm text-gray-500">Liens</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              onClick={handlePublish}
              disabled={isPublishing || card.isPublic}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Publication...
                </>
              ) : card.isPublic ? (
                '✅ Déjà publiée'
              ) : (
                'Publier la carte'
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
