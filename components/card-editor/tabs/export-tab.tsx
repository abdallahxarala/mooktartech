'use client'

import React, { useState } from 'react'
import { useCardEditorStore } from '@/lib/store/card-editor-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { exportCard, getExportRecommendations } from '@/lib/utils/card-exporter'
import { 
  Download, 
  Share2, 
  Eye, 
  FileImage, 
  FileText, 
  Smartphone, 
  Database,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react'

export function ExportTab() {
  const { card, publish, generatePublicUrl } = useCardEditorStore()
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const exportRecommendations = getExportRecommendations()

  const handleExport = async (format: 'png' | 'pdf' | 'vcard' | 'json') => {
    setIsExporting(format)
    try {
      // Get canvas element for PNG/PDF export
      const canvasElement = document.querySelector('[data-card-canvas]') as HTMLElement
      
      if (format === 'png' || format === 'pdf') {
        if (!canvasElement) {
          throw new Error('Canvas non trouvé')
        }
        await exportCard(canvasElement, card, { format })
      } else {
        // For vCard and JSON, we don't need canvas
        await exportCard(canvasElement || document.body, card, { format })
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Erreur lors de l\'export')
    } finally {
      setIsExporting(null)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      await publish()
      alert('Carte publiée avec succès !')
    } catch (error) {
      console.error('Publish error:', error)
      alert('Erreur lors de la publication')
    } finally {
      setIsPublishing(false)
    }
  }

  const copyPublicUrl = async () => {
    const url = generatePublicUrl()
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch (error) {
      console.error('Copy error:', error)
    }
  }

  const publicUrl = generatePublicUrl()

  return (
    <div className="p-4 space-y-6">
      {/* Exporter la carte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Exporter la carte</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {exportRecommendations.map((rec) => {
              const Icon = rec.icon === '🖼️' ? FileImage :
                          rec.icon === '📄' ? FileText :
                          rec.icon === '📇' ? Smartphone :
                          Database
              
              return (
                <Button
                  key={rec.format}
                  variant="outline"
                  onClick={() => handleExport(rec.format)}
                  disabled={isExporting === rec.format}
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                >
                  <Icon className="w-6 h-6" />
                  <div className="text-center">
                    <p className="font-medium">{rec.label}</p>
                    <p className="text-xs text-gray-500">{rec.description}</p>
                  </div>
                  {isExporting === rec.format && (
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Partager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Partager</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          {/* QR Code pour partage */}
          <div>
            <div className="flex items-center justify-between">
              <Label>QR Code de partage</Label>
              <Button
                onClick={() => setShowQR(!showQR)}
                size="sm"
                variant="outline"
              >
                {showQR ? 'Masquer' : 'Afficher'}
              </Button>
            </div>
            {showQR && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg text-center">
                <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-gray-400">QR Code</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Scannez pour accéder à votre carte
                </p>
              </div>
            )}
          </div>

          {/* Bouton Publier */}
          <Button
            onClick={handlePublish}
            disabled={isPublishing || card.isPublic}
            className="w-full bg-orange-500 hover:bg-orange-600"
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
        </CardContent>
      </Card>

      {/* Options de partage */}
      <Card>
        <CardHeader>
          <CardTitle>Options de partage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Statistiques</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}
