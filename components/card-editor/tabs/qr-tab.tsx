'use client'

import React, { useState, useEffect } from 'react'
import { useCardEditorStore } from '@/lib/store/card-editor-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChromePicker } from 'react-color'
import { generateQRCode, validateQRData, getQRSizeRecommendations } from '@/lib/utils/qr-generator'
import { QrCode, Download, Smartphone, Mail, Globe, MessageCircle } from 'lucide-react'

const qrTypes = [
  { id: 'vcard', name: 'vCard', description: 'Contact complet', icon: Smartphone },
  { id: 'url', name: 'URL', description: 'Lien vers votre carte', icon: Globe },
  { id: 'whatsapp', name: 'WhatsApp', description: 'Message direct', icon: MessageCircle },
  { id: 'email', name: 'Email', description: 'Email direct', icon: Mail }
]

const qrShapes = [
  { id: 'square', name: 'Carré', preview: '■' },
  { id: 'round', name: 'Rond', preview: '●' },
  { id: 'dots', name: 'Pointillé', preview: '⋯' }
]

export function QRTab() {
  const { card, updateQRStyle, updateField } = useCardEditorStore()
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [validation, setValidation] = useState({ isValid: true, errors: [] })

  const sizeRecommendations = getQRSizeRecommendations()

  useEffect(() => {
    generateQRCode()
  }, [card.qrType, card.qrStyle])

  const generateQRCode = async () => {
    setIsGenerating(true)
    try {
      const validation = validateQRData(card)
      setValidation(validation)
      
      if (validation.isValid) {
        const { generateStyledQRCode } = await import('@/lib/utils/qr-generator')
        const qrUrl = await generateStyledQRCode(card)
        setQrCodeUrl(qrUrl)
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleColorChange = (color: any) => {
    updateQRStyle({ color: color.hex })
  }

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.download = `qr-code-${card.id}.png`
      link.href = qrCodeUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Type de QR Code */}
      <Card>
        <CardHeader>
          <CardTitle>Type de QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {qrTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => updateField('qrType', type.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    card.qrType === type.id 
                      ? 'border-orange-500 ring-2 ring-orange-200' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-medium">{type.name}</p>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Validation */}
      {!validation.isValid && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-red-600">
              <p className="font-medium mb-2">⚠️ Informations manquantes :</p>
              <ul className="text-sm space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Style du QR Code */}
      <Card>
        <CardHeader>
          <CardTitle>Style du QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Couleur */}
          <div>
            <Label>Couleur</Label>
            <div className="flex items-center space-x-3 mt-2">
              <div 
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                style={{ backgroundColor: card.qrStyle.color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              <span className="text-sm text-gray-600">{card.qrStyle.color}</span>
            </div>
            
            {showColorPicker && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
                <ChromePicker
                  color={card.qrStyle.color}
                  onChange={handleColorChange}
                />
              </div>
            )}
          </div>

          {/* Forme */}
          <div>
            <Label>Forme</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {qrShapes.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => updateQRStyle({ shape: shape.id as any })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    card.qrStyle.shape === shape.id 
                      ? 'border-orange-500 ring-2 ring-orange-200' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{shape.preview}</div>
                  <p className="text-sm font-medium">{shape.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Taille */}
          <div>
            <Label>Taille: {card.qrStyle.size}px</Label>
            <Slider
              value={[card.qrStyle.size]}
              onValueChange={([value]) => updateQRStyle({ size: value })}
              min={60}
              max={150}
              step={10}
              className="mt-2"
            />
            <div className="text-xs text-gray-500 mt-1">
              {sizeRecommendations.find(s => s.size === card.qrStyle.size)?.description || 'Taille personnalisée'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu QR Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Aperçu QR Code</span>
            {qrCodeUrl && (
              <Button
                onClick={downloadQRCode}
                size="sm"
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger</span>
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            {isGenerating ? (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <span>Génération...</span>
              </div>
            ) : qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="max-w-full max-h-48"
              />
            ) : (
              <div className="text-center text-gray-500">
                <QrCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>QR Code non disponible</p>
                <p className="text-sm">Vérifiez les informations requises</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informations */}
      <Card>
        <CardHeader>
          <CardTitle>ℹ️ Informations</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>• Le QR Code se met à jour automatiquement</p>
          <p>• Téléchargez-le pour l'utiliser ailleurs</p>
          <p>• Testez-le avec votre téléphone</p>
          <p>• Plus la taille est grande, plus il est lisible</p>
        </CardContent>
      </Card>
    </div>
  )
}
