'use client'

import React, { useState } from 'react'
import { Grid3X3, List } from 'lucide-react'

type ViewMode = 'grid' | 'list'

interface ViewToggleProps {
  onViewChange: (view: ViewMode) => void
}

export default function ViewToggle({ onViewChange }: ViewToggleProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('grid')

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view)
    onViewChange(view)
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => handleViewChange('grid')}
        className={`p-2 rounded-md transition-colors ${
          currentView === 'grid'
            ? 'bg-white text-orange-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleViewChange('list')}
        className={`p-2 rounded-md transition-colors ${
          currentView === 'list'
            ? 'bg-white text-orange-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  )
}
