'use client'

import { motion } from 'framer-motion'

import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Repeat,
  Grid3x3,
  Ruler,
  Type
} from 'lucide-react'

import { useCardStore } from '../store/useCardStore'

import { Button } from '@/components/ui/button'

import { Separator } from '@/components/ui/separator'

export function CardControls() {
  const zoom = useCardStore((state) => state.zoom)
  const zoomIn = useCardStore((state) => state.zoomIn)
  const zoomOut = useCardStore((state) => state.zoomOut)
  const resetZoom = useCardStore((state) => state.resetZoom)

  const flipCard = useCardStore((state) => state.flipCard)
  const cardFace = useCardStore((state) => state.cardFace)

  const showGrid = useCardStore((state) => state.showGrid)
  const toggleGrid = useCardStore((state) => state.toggleGrid)
  const showSafeZones = useCardStore((state) => state.showSafeZones)
  const toggleSafeZones = useCardStore((state) => state.toggleSafeZones)

  const canvases = useCardStore((state) => state.canvases)

  const handleAddText = async () => {
    try {
      const canvas = canvases[cardFace]

      if (!canvas) {
        console.warn('⚠️ [CardControls] Aucun canvas disponible pour', cardFace)
        return
      }

      const { fabric } = await import('fabric')

      const text = new fabric.Textbox('Nouveau texte', {
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        fontSize: 28,
        fontFamily: 'Inter, system-ui, sans-serif',
        fill: '#111827',
        originX: 'center',
        originY: 'center',
        fontWeight: '500',
        cornerColor: '#f97316',
        cornerStyle: 'circle',
        cornerSize: 12,
        transparentCorners: false,
        borderColor: '#f97316',
        padding: 8,
        editable: true
      })

      canvas.add(text)
      canvas.setActiveObject(text)
      canvas.renderAll()
      console.log('✏️ [CardControls] Texte ajouté sur', cardFace)
    } catch (error) {
      console.error('❌ [CardControls] Erreur ajout texte :', error)
    }
  }

  return (
    <motion.div
      className="mt-4 flex items-center justify-center"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/80 px-2 py-1 shadow-[0_18px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl">
        {/* Groupe Contenu (Texte) */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddText}
            className="h-9 w-9 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-slate-50"
            title="Ajouter un texte sur la face active"
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-1 h-7 bg-slate-700" />

        {/* Groupe Zoom */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomOut}
            className="h-9 w-9 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-slate-50"
            title="Zoom arrière"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <div className="relative flex h-9 w-16 items-center justify-center">
            <span className="text-xs font-semibold tabular-nums text-slate-200">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={zoomIn}
            className="h-9 w-9 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-slate-50"
            title="Zoom avant"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-1 h-7 bg-slate-700" />

        {/* Groupe Vue */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={resetZoom}
            className="h-9 w-9 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-slate-50"
            title="Réinitialiser la vue"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={flipCard}
            className="relative h-9 w-9 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-slate-50"
            title="Retourner la carte (Recto/Verso)"
          >
            <Repeat className="h-4 w-4" />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium text-orange-400">
              {cardFace === 'front' ? 'Recto' : 'Verso'}
            </span>
          </Button>
        </div>

        <Separator orientation="vertical" className="mx-1 h-7 bg-slate-700" />

        {/* Groupe Guides */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleGrid}
            className={`h-9 w-9 rounded-xl text-xs transition-colors ${
              showGrid
                ? 'bg-slate-800 text-orange-400 hover:bg-slate-700'
                : 'text-slate-300 hover:bg-slate-800 hover:text-slate-50'
            }`}
            title="Afficher la grille"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSafeZones}
            className={`h-9 w-9 rounded-xl text-xs transition-colors ${
              showSafeZones
                ? 'bg-slate-800 text-orange-400 hover:bg-slate-700'
                : 'text-slate-300 hover:bg-slate-800 hover:text-slate-50'
            }`}
            title="Afficher les marges de sécurité"
          >
            <Ruler className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
