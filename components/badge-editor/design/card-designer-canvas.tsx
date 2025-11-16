'use client'

import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { CardProject } from '@/lib/store/card-designer-store'

interface CardDesignerCanvasProps {
  project: CardProject
  mode: 'recto' | 'verso'
  zoom: number
  activeTool: string
  selectedElements: string[]
  showGrid: boolean
  showGuides: boolean
  showRulers: boolean
}

export const CardDesignerCanvas = forwardRef<HTMLDivElement, CardDesignerCanvasProps>(
  ({ project, mode, zoom, activeTool, selectedElements, showGrid, showGuides, showRulers }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isReady, setIsReady] = useState(false)

    // Initialisation simple du canvas
    useEffect(() => {
      if (!canvasRef.current) return

      // Simuler l'initialisation
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 500)

      return () => clearTimeout(timer)
    }, []) // ⚠️ IMPORTANT : Dépendances vides pour n'exécuter qu'une fois

    if (!isReady) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Initialisation du canvas...</p>
          </div>
        </div>
      )
    }

    return (
      <div ref={ref} className="w-full h-full relative bg-gray-100 overflow-hidden">
        {/* Règles */}
        {showRulers && (
          <>
            {/* Règle horizontale */}
            <div className="absolute top-0 left-16 right-0 h-6 bg-gray-200 border-b border-gray-300 flex items-center px-2 text-xs text-gray-600">
              <span>0mm</span>
              <span className="ml-20">20mm</span>
              <span className="ml-20">40mm</span>
              <span className="ml-20">60mm</span>
              <span className="ml-20">80mm</span>
            </div>
            
            {/* Règle verticale */}
            <div className="absolute left-0 top-6 bottom-0 w-16 bg-gray-200 border-r border-gray-300 flex flex-col items-center py-2 text-xs text-gray-600">
              <span>0mm</span>
              <span className="mt-16">10mm</span>
              <span className="mt-16">20mm</span>
              <span className="mt-16">30mm</span>
              <span className="mt-16">40mm</span>
              <span className="mt-16">50mm</span>
            </div>
          </>
        )}

        {/* Canvas Container */}
        <div className={`absolute ${showRulers ? 'top-6 left-16' : 'top-0 left-0'} right-0 bottom-0 flex items-center justify-center`}>
          {/* Grille de fond */}
          {showGrid && (
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #ccc 1px, transparent 1px),
                  linear-gradient(to bottom, #ccc 1px, transparent 1px)
                `,
                backgroundSize: '10px 10px'
              }}
            />
          )}

          {/* Canvas simplifié */}
          <div 
            className="bg-white shadow-2xl rounded-lg overflow-hidden"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center'
            }}
          >
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={250}
                className="block"
                style={{ 
                  width: '400px', 
                  height: '250px',
                  cursor: activeTool === 'pointer' ? 'default' : 'crosshair'
                }}
              />
              
              {/* Placeholder pour tester */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-400">
                  <p className="text-4xl mb-2">🎨</p>
                  <p className="text-sm">Zone d'édition</p>
                  <p className="text-xs">Glissez des éléments ici</p>
                </div>
              </div>
            </div>
          </div>

          {/* Indicateur de mode */}
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {mode === 'recto' ? 'Recto' : 'Verso'}
          </div>

          {/* Dimensions */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
            {project.dimensions.width} × {project.dimensions.height}mm
          </div>
        </div>
      </div>
    )
  }
)

CardDesignerCanvas.displayName = 'CardDesignerCanvas'
