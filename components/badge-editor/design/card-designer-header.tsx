'use client'

import React from 'react'
import { EditorSelector } from '@/components/editor-selector'
import { CardProject } from '@/lib/store/card-designer-store'

interface CardDesignerHeaderProps {
  project: CardProject
  canvasMode: 'recto' | 'verso'
  onCanvasModeChange: (mode: 'recto' | 'verso') => void
  onZoomChange: (zoom: number) => void
  zoom: number
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onToggleGrid: () => void
  onToggleGuides: () => void
  onToggleRulers: () => void
  showGrid: boolean
  showGuides: boolean
  showRulers: boolean
}

export function CardDesignerHeader({
  project,
  canvasMode,
  onCanvasModeChange,
  onZoomChange,
  zoom,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onToggleGrid,
  onToggleGuides,
  onToggleRulers,
  showGrid,
  showGuides,
  showRulers
}: CardDesignerHeaderProps) {
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, 400)
    onZoomChange(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, 25)
    onZoomChange(newZoom)
  }

  const handleZoomReset = () => {
    onZoomChange(100)
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        {/* Project Info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CD</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{project.name}</h1>
            <p className="text-sm text-gray-500">v{project.version} • {project.dimensions.width}×{project.dimensions.height}mm</p>
          </div>
        </div>
        
        {/* Sélecteur d'éditeur */}
        <EditorSelector />

        {/* Canvas Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onCanvasModeChange('recto')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              canvasMode === 'recto'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recto
          </button>
          <button
            onClick={() => onCanvasModeChange('verso')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              canvasMode === 'verso'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Verso
          </button>
        </div>
      </div>

      {/* Center Section - Tools */}
      <div className="flex items-center space-x-4">
        {/* History */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Annuler (Ctrl+Z)"
          >
            <span className="w-4 h-4">↶</span>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Refaire (Ctrl+Y)"
          >
            <span className="w-4 h-4">↷</span>
          </button>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-1 border-l border-gray-200 pl-4">
          <button
            onClick={onToggleGrid}
            className={`p-2 rounded-lg transition-colors ${
              showGrid ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
            }`}
            title="Grille (Ctrl+G)"
          >
            <span className="w-4 h-4">⊞</span>
          </button>
          <button
            onClick={onToggleGuides}
            className={`p-2 rounded-lg transition-colors ${
              showGuides ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
            }`}
            title="Guides"
          >
            <span className="w-4 h-4">👁️</span>
          </button>
          <button
            onClick={onToggleRulers}
            className={`p-2 rounded-lg transition-colors ${
              showRulers ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
            }`}
            title="Règles"
          >
            <span className="w-4 h-4">📏</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 border-l border-gray-200 pl-4">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Zoom arrière"
          >
            <span className="w-4 h-4">🔍-</span>
          </button>
          <button
            onClick={handleZoomReset}
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {zoom}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Zoom avant"
          >
            <span className="w-4 h-4">🔍+</span>
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Preview */}
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
          <span className="mr-2">👁️</span>
          Aperçu
        </button>

        {/* Export */}
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
          <span className="mr-2">⬇️</span>
          Export
        </button>

        {/* Print */}
        <button className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors">
          <span className="mr-2">🖨️</span>
          Imprimer
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          title="Sauvegarder (Ctrl+S)"
        >
          <span className="mr-2">💾</span>
          Sauvegarder
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="w-4 h-4">⚙️</span>
        </button>
      </div>
    </header>
  )
}
