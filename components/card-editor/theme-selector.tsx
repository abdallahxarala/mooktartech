'use client'

import React from 'react'
import { useCardEditorStore } from '@/lib/store/card-editor-store'
import { cn } from '@/lib/utils'

const THEMES = [
  {
    id: 'minimal',
    name: 'Minimaliste',
    description: 'Clean et professionnel',
    icon: '🎯',
    preview: 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Coloré et dynamique',
    icon: '🌈',
    preview: 'linear-gradient(135deg, #F97316 0%, #EC4899 50%, #8B5CF6 100%)',
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Moderne et élégant',
    icon: '✨',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'bento',
    name: 'Bento',
    description: 'Grid cards modernes',
    icon: '📱',
    preview: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
  },
]

export function ThemeSelector() {
  const { card, setTheme } = useCardEditorStore()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Choisir un design
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id as any)}
            className={cn(
              "relative p-4 rounded-2xl border-2 transition-all text-left hover:scale-105",
              card.theme === theme.id
                ? "border-orange-500 ring-4 ring-orange-100 shadow-lg"
                : "border-gray-200 hover:border-orange-300"
            )}
          >
            {/* Preview gradient */}
            <div 
              className="h-24 rounded-xl mb-3 shadow-inner"
              style={{ background: theme.preview }}
            />

            {/* Info */}
            <div className="flex items-start gap-3">
              <span className="text-3xl">{theme.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {theme.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {theme.description}
                </p>
              </div>
            </div>

            {/* Badge sélectionné */}
            {card.theme === theme.id && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
