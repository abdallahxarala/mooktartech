'use client'

import React from 'react'
import { useCardEditorStore } from '@/lib/store/card-editor-store'
import { MinimalTheme } from './preview-themes/minimal-theme'
import { GradientTheme } from './preview-themes/gradient-theme'
import { GlassTheme } from './preview-themes/glass-theme'
import { BentoTheme } from './preview-themes/bento-theme'
import { Smartphone, Tablet, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PreviewPane() {
  const { card, previewDevice, setPreviewDevice } = useCardEditorStore()

  const renderTheme = () => {
    switch (card.theme) {
      case 'minimal':
        return <MinimalTheme card={card} />
      case 'gradient':
        return <GradientTheme card={card} />
      case 'glassmorphism':
        return <GlassTheme card={card} />
      case 'bento':
        return <BentoTheme card={card} />
      default:
        return <MinimalTheme card={card} />
    }
  }

  const deviceStyles = {
    mobile: 'w-[375px] h-[667px]',
    tablet: 'w-[768px] h-[1024px]',
    desktop: 'w-full h-full',
  }

  return (
    <div className="flex-1 bg-gray-100 overflow-hidden flex flex-col">
      {/* Toolbar preview */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          Prévisualisation en temps réel
        </h3>

        {/* Device selector */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              previewDevice === 'mobile'
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </button>

          <button
            onClick={() => setPreviewDevice('tablet')}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              previewDevice === 'tablet'
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Tablet className="w-4 h-4" />
            <span>Tablet</span>
          </button>

          <button
            onClick={() => setPreviewDevice('desktop')}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              previewDevice === 'desktop'
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* Preview container */}
      <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
        {previewDevice === 'desktop' ? (
          <div className="w-full max-w-4xl">
            {renderTheme()}
          </div>
        ) : (
          <div className="relative">
            {/* Device mockup */}
            <div className={cn(
              "bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-900",
              deviceStyles[previewDevice]
            )}>
              {/* Notch pour iPhone */}
              {previewDevice === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-50" />
              )}

              {/* Content scrollable */}
              <div className="w-full h-full overflow-y-auto">
                {renderTheme()}
              </div>
            </div>

            {/* Home indicator iPhone */}
            {previewDevice === 'mobile' && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-full" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
