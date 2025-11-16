'use client'

import React, { forwardRef } from 'react'
import { useCardEditorStore } from '@/lib/store/card-editor-store'
import { CardCanvasContent } from './card-canvas-content'

interface CardCanvasProps {
  className?: string
}

export const CardCanvas = forwardRef<HTMLDivElement, CardCanvasProps>(
  ({ className = '' }, ref) => {
    const { card } = useCardEditorStore()

    return (
      <div 
        ref={ref}
        className={`flex items-center justify-center ${className}`}
      >
        <div className="relative">
          {/* Card Container */}
          <div className="w-[400px] h-[250px] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <CardCanvasContent card={card} />
          </div>
          
          {/* Card Frame */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-2 border-gray-300 rounded-2xl opacity-20" />
          </div>
        </div>
      </div>
    )
  }
)

CardCanvas.displayName = 'CardCanvas'
