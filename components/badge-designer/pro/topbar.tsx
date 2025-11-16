'use client'

import { Undo2, Redo2, ZoomIn, ZoomOut, Grid, Eye, Download, Save } from 'lucide-react'
import { useBadgeDesignerStore } from '@/lib/store/badge-designer-store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface BadgeDesignerTopbarProps {
  locale: string
}

export function BadgeDesignerTopbar({ locale }: BadgeDesignerTopbarProps) {
  const {
    zoom,
    showGrid,
    showGuides,
    setZoom,
    toggleGrid,
    toggleGuides,
  } = useBadgeDesignerStore()

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 400))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 25))
  }

  const handleZoomReset = () => {
    setZoom(100)
  }

  return (
    <header className="h-14 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
          <span className="text-sm font-semibold text-orange-400">Badge Designer Pro</span>
        </div>

        <Separator orientation="vertical" className="h-6 bg-slate-700" />

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleGrid}
          className={`h-8 px-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800 ${
            showGrid ? 'bg-slate-800 text-orange-400' : ''
          }`}
        >
          <Grid className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleGuides}
          className={`h-8 px-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800 ${
            showGuides ? 'bg-slate-800 text-orange-400' : ''
          }`}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {/* Center Section - Zoom */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="h-8 px-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomReset}
          className="h-8 px-3 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800"
        >
          {zoom}%
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="h-8 px-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-slate-300 hover:text-slate-100 hover:bg-slate-800"
        >
          <Undo2 className="w-4 h-4 mr-2" />
          Annuler
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-slate-300 hover:text-slate-100 hover:bg-slate-800"
        >
          <Redo2 className="w-4 h-4 mr-2" />
          Refaire
        </Button>

        <Separator orientation="vertical" className="h-6 bg-slate-700" />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-slate-300 hover:text-slate-100 hover:bg-slate-800"
        >
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>

        <Button
          size="sm"
          className="h-8 px-4 bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
    </header>
  )
}

