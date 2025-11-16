'use client'

import React, { useState } from 'react'
import { CardData, useCardEditorStore } from '@/lib/store/card-editor-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Smartphone, Monitor, Tablet } from 'lucide-react'

interface CardPreviewProps {
  className?: string
}

export function CardPreview({ className = '' }: CardPreviewProps) {
  const { card } = useCardEditorStore()
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')

  const devices = [
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
    { id: 'tablet', label: 'Tablet', icon: Tablet },
    { id: 'desktop', label: 'Desktop', icon: Monitor }
  ] as const

  const getDeviceFrame = () => {
    switch (selectedDevice) {
      case 'mobile':
        return 'w-64 h-96 bg-gray-900 rounded-[2rem] p-2'
      case 'tablet':
        return 'w-80 h-56 bg-gray-800 rounded-2xl p-2'
      case 'desktop':
        return 'w-80 h-48 bg-gray-700 rounded-lg p-2'
      default:
        return 'w-64 h-96 bg-gray-900 rounded-[2rem] p-2'
    }
  }

  const getCardScale = () => {
    switch (selectedDevice) {
      case 'mobile':
        return 'scale-75'
      case 'tablet':
        return 'scale-90'
      case 'desktop':
        return 'scale-100'
      default:
        return 'scale-75'
    }
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Device Selector */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Aperçu</h3>
        <div className="flex space-x-2">
          {devices.map((device) => {
            const Icon = device.icon
            return (
              <Button
                key={device.id}
                variant={selectedDevice === device.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDevice(device.id)}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{device.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4 bg-gray-50">
        <div className="flex items-center justify-center h-full">
          <div className={getDeviceFrame()}>
            <div className="w-full h-full bg-white rounded-lg overflow-hidden">
              <div className={`w-full h-full ${getCardScale()} origin-center`}>
                {/* Card Preview - Same as canvas but scaled */}
                <div 
                  className="w-[400px] h-[250px] bg-white rounded-2xl shadow-lg overflow-hidden"
                  style={{
                    background: card.backgroundType === 'gradient' 
                      ? card.colors.background 
                      : undefined,
                    backgroundColor: card.backgroundType === 'color' 
                      ? card.colors.background 
                      : undefined
                  }}
                >
                  <div className="w-full h-full p-6 flex items-center justify-between">
                    <div className="flex-1">
                      {card.photo && (
                        <img
                          src={card.photo}
                          alt="Photo"
                          className="w-12 h-12 rounded-full object-cover mb-2"
                        />
                      )}
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {card.firstName} {card.lastName}
                      </h3>
                      {card.title && (
                        <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                      )}
                      {card.company && (
                        <p className="text-xs text-gray-500">{card.company}</p>
                      )}
                    </div>
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500">QR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Stats */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">{card.views}</div>
            <div className="text-xs text-gray-500">Vues</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{card.downloads}</div>
            <div className="text-xs text-gray-500">Téléchargements</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{card.socialLinks.length}</div>
            <div className="text-xs text-gray-500">Liens</div>
          </div>
        </div>
      </div>
    </div>
  )
}