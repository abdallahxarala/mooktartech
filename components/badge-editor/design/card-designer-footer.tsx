'use client'

import React from 'react'
import { CardProject } from '@/lib/store/card-designer-store'

interface CardDesignerFooterProps {
  project: CardProject
  canvasMode: 'recto' | 'verso'
  zoom: number
  selectedCount: number
}

export function CardDesignerFooter({ 
  project, 
  canvasMode, 
  zoom, 
  selectedCount 
}: CardDesignerFooterProps) {
  const currentDesign = canvasMode === 'recto' ? project.recto : project.verso
  const elementCount = currentDesign.elements.length

  return (
    <footer className="h-12 bg-white border-t border-gray-200 px-6 flex items-center justify-between">
      {/* Left Section - Project Info */}
      <div className="flex items-center space-x-6">
        {/* Dimensions */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="w-4 h-4">📏</span>
          <span>Format: CR80 (85.6 × 53.98mm) - Ratio 1.586:1</span>
        </div>

        {/* Resolution */}
        <div className="text-sm text-gray-600">
          {project.dimensions.dpi} DPI
        </div>

        {/* Mode */}
        <div className="text-sm text-gray-600">
          {canvasMode === 'recto' ? 'Recto' : 'Verso'}
        </div>
      </div>

      {/* Center Section - Status */}
      <div className="flex items-center space-x-6">
        {/* Elements Count */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="w-4 h-4">🖱️</span>
          <span>{elementCount} éléments</span>
          {selectedCount > 0 && (
            <span className="text-orange-600">({selectedCount} sélectionnés)</span>
          )}
        </div>

        {/* Zoom */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="w-4 h-4">🔍</span>
          <span>{zoom}%</span>
        </div>

        {/* Bleed */}
        <div className="text-sm text-gray-600">
          Fond perdu: {currentDesign.bleed}mm
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-4">
        {/* Last Saved */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="w-4 h-4">🕐</span>
          <span>Sauvegardé il y a 2min</span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Prêt</span>
        </div>
      </div>
    </footer>
  )
}
