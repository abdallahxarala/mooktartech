'use client'

import { useEffect, useRef } from 'react'
import { CARD_CONSTANTS } from '../constants'
import { useCardStore } from '../store/useCardStore'

export function CardCanvas() {
  const frontCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const cardFace = useCardStore((state) => state.cardFace)
  const registerCanvas = useCardStore((state) => state.registerCanvas)
  const setCanvasReady = useCardStore((state) => state.setCanvasReady)

  useEffect(() => {
    let isCancelled = false
    let frontCanvas: any | null = null
    let backCanvas: any | null = null

    const init = async () => {
      try {
        console.log('🎨 [CardCanvas] Initialisation Fabric recto/verso...')
        const { fabric } = await import('fabric')

        const frontEl = frontCanvasRef.current
        const backEl = backCanvasRef.current

        if (!frontEl || !backEl) {
          console.warn('⚠️ [CardCanvas] Canvas HTML non trouvé')
          return
        }
        if (isCancelled) return

        const baseOptions = {
          width: CARD_CONSTANTS.CANVAS.WIDTH,
          height: CARD_CONSTANTS.CANVAS.HEIGHT,
          backgroundColor: '#f9fafb',
          selection: true,
          preserveObjectStacking: true,
          renderOnAddRemove: true
        }

        // 🎴 RECTO
        frontCanvas = new fabric.Canvas(frontEl, baseOptions)

        const frontText = new fabric.Textbox('Recto — double-cliquez pour éditer', {
          left: CARD_CONSTANTS.CANVAS.WIDTH / 2,
          top: CARD_CONSTANTS.CANVAS.HEIGHT / 2,
          fontSize: 30,
          fontFamily: 'Inter, system-ui, sans-serif',
          fill: '#111827', // texte foncé
          originX: 'center',
          originY: 'center',
          fontWeight: '600',
          cornerColor: '#f97316',
          cornerStyle: 'circle',
          cornerSize: 12,
          transparentCorners: false,
          borderColor: '#f97316',
          padding: 10,
          editable: true
        })

        frontCanvas.add(frontText)
        frontCanvas.setActiveObject(frontText)
        frontCanvas.renderAll()
        console.log('✅ [CardCanvas] Recto initialisé avec texte de démo')

        // 🎴 VERSO
        backCanvas = new fabric.Canvas(backEl, baseOptions)

        const backText = new fabric.Textbox('Verso — contenu indépendant', {
          left: CARD_CONSTANTS.CANVAS.WIDTH / 2,
          top: CARD_CONSTANTS.CANVAS.HEIGHT / 2,
          fontSize: 30,
          fontFamily: 'Inter, system-ui, sans-serif',
          fill: '#111827',
          originX: 'center',
          originY: 'center',
          fontWeight: '600',
          cornerColor: '#22c55e',
          cornerStyle: 'circle',
          cornerSize: 12,
          transparentCorners: false,
          borderColor: '#22c55e',
          padding: 10,
          editable: true
        })

        backCanvas.add(backText)
        backCanvas.setActiveObject(backText)
        backCanvas.renderAll()
        console.log('✅ [CardCanvas] Verso initialisé avec texte de démo')

        // 🔗 Stockage dans Zustand
        registerCanvas('front', frontCanvas)
        registerCanvas('back', backCanvas)
        setCanvasReady(true)
        console.log('✅ [CardCanvas] Canvases enregistrés dans le store')

      } catch (error) {
        console.error('❌ [CardCanvas] Erreur init Fabric recto/verso :', error)
      }
    }

    void init()

    return () => {
      isCancelled = true

      if (frontCanvas) {
        frontCanvas.dispose()
        frontCanvas = null
      }
      if (backCanvas) {
        backCanvas.dispose()
        backCanvas = null
      }

      registerCanvas('front', null)
      registerCanvas('back', null)
      setCanvasReady(false)
    }
  }, [registerCanvas, setCanvasReady])

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Canvas recto */}
      <canvas
        ref={frontCanvasRef}
        style={{
          display: cardFace === 'front' ? 'block' : 'none',
          width: CARD_CONSTANTS.CANVAS.WIDTH,
          height: CARD_CONSTANTS.CANVAS.HEIGHT
        }}
      />

      {/* Canvas verso */}
      <canvas
        ref={backCanvasRef}
        style={{
          display: cardFace === 'back' ? 'block' : 'none',
          width: CARD_CONSTANTS.CANVAS.WIDTH,
          height: CARD_CONSTANTS.CANVAS.HEIGHT
        }}
      />
    </div>
  )
}
