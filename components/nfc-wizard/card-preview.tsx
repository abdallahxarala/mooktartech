'use client'

import React from 'react'
import { 
  ClassicTemplate,
  MinimalistTemplate,
  CorporateTemplate,
  CreativeTemplate
} from './card-templates'

interface CardData {
  firstName: string
  lastName: string
  title: string
  company: string
  email: string
  phone: string
  website: string
  location: string
  template: string
  primaryColor: string
  secondaryColor: string
  avatar?: string
  logo?: string
  backgroundImage?: string
}

interface CardPreviewProps {
  data: CardData
  className?: string
}

export function CardPreview({ data, className = '' }: CardPreviewProps) {
  const templates = {
    classic: ClassicTemplate,
    minimalist: MinimalistTemplate,
    corporate: CorporateTemplate,
    creative: CreativeTemplate,
    // Fallbacks pour anciens noms
    sunset: ClassicTemplate,
    ocean: MinimalistTemplate,
    forest: CorporateTemplate,
    midnight: CorporateTemplate,
    royal: CreativeTemplate,
    dawn: CreativeTemplate
  }

  const TemplateComponent = templates[data.template as keyof typeof templates] || ClassicTemplate

  return (
    <div className={`relative ${className}`}>
      {/* Phone Frame */}
      <div className="relative mx-auto w-full max-w-sm">
        <div className="relative aspect-[9/19.5] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
          {/* Screen */}
          <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
            
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 text-xs font-semibold z-10 bg-white/80 backdrop-blur-sm">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-full bg-gray-300" />
                <div className="w-4 h-4 rounded-full bg-gray-300" />
                <div className="w-4 h-4 rounded-full bg-gray-300" />
              </div>
            </div>

            {/* Card Content */}
            <div className="h-full pt-12 overflow-y-auto">
              <TemplateComponent data={data} />
            </div>
          </div>

          {/* Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-full z-20" />
        </div>
      </div>

      {/* Floating label */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white rounded-full shadow-xl border-2 border-gray-100">
        <div className="text-sm font-bold text-gray-900">
          Aperçu en temps réel ✨
        </div>
      </div>
    </div>
  )
}

