'use client'

import React from 'react'
import { CardData } from '@/lib/store/card-editor-store'
import { Button } from '@/components/ui/button'
import { X, Download, Share2 } from 'lucide-react'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  canvasRef: React.RefObject<HTMLDivElement>
}

export function PreviewModal({ isOpen, onClose, canvasRef }: PreviewModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Aperçu de la carte</h2>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            {canvasRef.current ? (
              <div className="scale-150 origin-center">
                {canvasRef.current.cloneNode(true) as React.ReactElement}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Aperçu non disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
