'use client'

import React from 'react'
// Import des icônes temporairement désactivé pour éviter les erreurs

interface CardDesignerToolbarProps {
  activeTool: string
  onToolChange: (tool: string) => void
}

const tools = [
  { id: 'pointer', icon: '🖱️', label: 'Sélection', shortcut: 'V' },
  { id: 'text', icon: '📝', label: 'Texte', shortcut: 'T' },
  { id: 'rectangle', icon: '⬜', label: 'Rectangle', shortcut: 'R' },
  { id: 'circle', icon: '⭕', label: 'Cercle', shortcut: 'C' },
  { id: 'image', icon: '🖼️', label: 'Image', shortcut: 'I' },
  { id: 'qr', icon: '📱', label: 'QR Code', shortcut: 'Q' },
  { id: 'barcode', icon: '📊', label: 'Code-barres', shortcut: 'B' },
  { id: 'line', icon: '➖', label: 'Ligne', shortcut: 'L' },
  { id: 'crop', icon: '✂️', label: 'Recadrage', shortcut: 'X' },
  { id: 'lock', icon: '🔒', label: 'Verrouiller', shortcut: 'K' },
  { id: 'security', icon: '🛡️', label: 'Sécurité', shortcut: 'S' },
  { id: 'layers', icon: '📚', label: 'Calques', shortcut: 'G' },
  { id: 'move', icon: '↔️', label: 'Déplacer', shortcut: 'M' },
  { id: 'rotate', icon: '🔄', label: 'Rotation', shortcut: 'O' }
]

export function CardDesignerToolbar({ activeTool, onToolChange }: CardDesignerToolbarProps) {
  return (
    <div className="flex flex-col space-y-2 p-2">
      {tools.map((tool) => {
        const isActive = activeTool === tool.id
        
        return (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            className={`
              w-12 h-12 flex items-center justify-center rounded-lg transition-all
              ${isActive 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <span className="text-lg">{tool.icon}</span>
          </button>
        )
      })}
      
      {/* Separator */}
      <div className="border-t border-gray-200 my-2"></div>
      
      {/* Additional Tools */}
      <div className="space-y-2">
        <button
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
          title="Copier (Ctrl+C)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        
        <button
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
          title="Coller (Ctrl+V)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
        
        <button
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
          title="Dupliquer (Ctrl+D)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
      </div>
    </div>
  )
}
