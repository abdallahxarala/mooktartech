'use client'

import React from 'react'
import { CardData } from '@/lib/store/card-editor-store'
import { MinimalTheme } from './minimal-theme'
import { GradientTheme } from './gradient-theme'
import { GlassTheme } from './glass-theme'
import { BentoTheme } from './bento-theme'

interface ThemePreviewProps {
  card: CardData
  device: 'mobile' | 'tablet' | 'desktop'
}

export function ThemePreview({ card, device }: ThemePreviewProps) {
  const getDeviceClass = () => {
    switch (device) {
      case 'mobile':
        return 'w-80 h-[600px] mx-auto'
      case 'tablet':
        return 'w-96 h-[700px] mx-auto'
      case 'desktop':
        return 'w-full h-[800px]'
      default:
        return 'w-80 h-[600px] mx-auto'
    }
  }

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

  return (
    <div className={`${getDeviceClass()} overflow-hidden rounded-3xl shadow-2xl border border-gray-200 bg-white`}>
      <div className="w-full h-full overflow-auto">
        {renderTheme()}
      </div>
    </div>
  )
}
