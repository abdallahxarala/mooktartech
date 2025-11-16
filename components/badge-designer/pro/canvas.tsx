'use client'

import { useEffect, useRef } from 'react'
import { Canvas, Rect, Textbox, Circle, Image as FabricImage } from 'fabric'
import { useBadgeDesignerStore } from '@/lib/store/badge-designer-store'

export function BadgeDesignerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<Canvas | null>(null)
  const {
    currentDesign,
    selectedElementId,
    zoom,
    showGrid,
    addElement,
    updateElement,
    removeElement,
    setSelectedElement,
  } = useBadgeDesignerStore()

  useEffect(() => {
    if (!canvasRef.current || !currentDesign) return

    // Calculer dimensions en pixels selon DPI
    const mmToPx = (mm: number, dpi: number) => (mm / 25.4) * dpi
    const widthPx = mmToPx(currentDesign.dimensions.width, currentDesign.dimensions.dpi)
    const heightPx = mmToPx(currentDesign.dimensions.height, currentDesign.dimensions.dpi)

    // Initialiser canvas Fabric.js
    const canvas = new Canvas(canvasRef.current, {
      width: widthPx,
      height: heightPx,
      backgroundColor: getBackgroundColor(currentDesign.background),
    })

    fabricRef.current = canvas

    // Appliquer zoom
    canvas.setZoom(zoom / 100)

    // Charger éléments depuis le store
    currentDesign.elements.forEach((element) => {
      const fabricObject = createFabricObject(element, widthPx, heightPx)
      if (fabricObject) {
        fabricObject.set('id', element.id)
        canvas.add(fabricObject)
      }
    })

    canvas.renderAll()

    // Écouter sélection d'objets
    canvas.on('selection:created', (e) => {
      const obj = e.selected?.[0]
      if (obj && obj.id) {
        setSelectedElement(obj.id as string)
      }
    })

    canvas.on('selection:updated', (e) => {
      const obj = e.selected?.[0]
      if (obj && obj.id) {
        setSelectedElement(obj.id as string)
      }
    })

    canvas.on('selection:cleared', () => {
      setSelectedElement(null)
    })

    // Écouter modifications d'objets
    canvas.on('object:modified', (e) => {
      const obj = e.target
      if (!obj || !obj.id) return

      updateElement(obj.id as string, {
        position: { x: obj.left || 0, y: obj.top || 0 },
        size: {
          width: (obj.width || 0) * (obj.scaleX || 1),
          height: (obj.height || 0) * (obj.scaleY || 1),
        },
        rotation: obj.angle || 0,
        opacity: obj.opacity || 1,
      })
    })

    // Écouter suppression d'objets
    canvas.on('object:removed', (e) => {
      const obj = e.target
      if (obj && obj.id) {
        removeElement(obj.id as string)
      }
    })

    // Cleanup
    return () => {
      canvas.dispose()
    }
  }, [currentDesign, setSelectedElement, updateElement, removeElement])

  // Mettre à jour le zoom quand il change
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setZoom(zoom / 100)
      fabricRef.current.renderAll()
    }
  }, [zoom])

  // Mettre à jour la sélection quand elle change dans le store
  useEffect(() => {
    if (!fabricRef.current) return

    const canvas = fabricRef.current
    const objects = canvas.getObjects()

    objects.forEach((obj) => {
      if (obj.id === selectedElementId) {
        canvas.setActiveObject(obj)
      } else if (canvas.getActiveObject() === obj && obj.id !== selectedElementId) {
        canvas.discardActiveObject()
      }
    })

    canvas.renderAll()
  }, [selectedElementId])

  // Écouter les nouveaux éléments ajoutés
  useEffect(() => {
    if (!fabricRef.current || !currentDesign) return

    const canvas = fabricRef.current
    const existingIds = canvas.getObjects().map((obj) => obj.id).filter(Boolean)
    const newElements = currentDesign.elements.filter(
      (el) => !existingIds.includes(el.id)
    )

    if (newElements.length > 0) {
      const mmToPx = (mm: number, dpi: number) => (mm / 25.4) * dpi
      const widthPx = mmToPx(currentDesign.dimensions.width, currentDesign.dimensions.dpi)
      const heightPx = mmToPx(currentDesign.dimensions.height, currentDesign.dimensions.dpi)

      newElements.forEach((element) => {
        const fabricObject = createFabricObject(element, widthPx, heightPx)
        if (fabricObject) {
          fabricObject.set('id', element.id)
          canvas.add(fabricObject)
          canvas.setActiveObject(fabricObject)
        }
      })

      canvas.renderAll()
    }
  }, [currentDesign?.elements.length])

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Grid overlay */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      )}

      {/* Canvas container */}
      <div className="relative shadow-2xl border-2 border-slate-700 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

// Helper: Créer un objet Fabric depuis un BadgeElement
function createFabricObject(
  element: any,
  widthPx: number,
  heightPx: number
): any {
  const mmToPx = (mm: number, dpi: number) => (mm / 25.4) * dpi
  const dpi = 300 // TODO: récupérer depuis currentDesign

  if (element.type === 'text') {
    return new Textbox(element.properties.text || 'Text', {
      left: mmToPx(element.position.x, dpi),
      top: mmToPx(element.position.y, dpi),
      width: mmToPx(element.size.width, dpi),
      fontSize: element.properties.fontSize || 20,
      fill: element.properties.color || '#000000',
      fontFamily: element.properties.fontFamily || 'Arial',
      fontWeight: element.properties.fontWeight || 'normal',
      textAlign: element.properties.alignment || 'left',
      opacity: element.opacity,
      angle: element.rotation,
    })
  } else if (element.type === 'shape') {
    if (element.properties.shape === 'rectangle') {
      return new Rect({
        left: mmToPx(element.position.x, dpi),
        top: mmToPx(element.position.y, dpi),
        width: mmToPx(element.size.width, dpi),
        height: mmToPx(element.size.height, dpi),
        fill: element.properties.fillColor || '#f3f4f6',
        stroke: element.properties.strokeColor || 'transparent',
        strokeWidth: element.properties.strokeWidth || 0,
        rx: element.properties.borderRadius || 0,
        ry: element.properties.borderRadius || 0,
        opacity: element.opacity,
        angle: element.rotation,
      })
    } else if (element.properties.shape === 'circle') {
      return new Circle({
        left: mmToPx(element.position.x, dpi),
        top: mmToPx(element.position.y, dpi),
        radius: mmToPx(element.size.width / 2, dpi),
        fill: element.properties.fillColor || '#f3f4f6',
        stroke: element.properties.strokeColor || 'transparent',
        strokeWidth: element.properties.strokeWidth || 0,
        opacity: element.opacity,
        angle: element.rotation,
      })
    }
  } else if (element.type === 'image' && element.properties.src) {
    // Pour les images, on créerait un FabricImage
    // Pour l'instant, on retourne null (à implémenter avec chargement async)
    return null
  } else if (element.type === 'qr') {
    // Pour les QR codes, on créerait un objet personnalisé
    // Pour l'instant, on retourne un rectangle placeholder
    return new Rect({
      left: mmToPx(element.position.x, dpi),
      top: mmToPx(element.position.y, dpi),
      width: mmToPx(element.size.width, dpi),
      height: mmToPx(element.size.height, dpi),
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      opacity: element.opacity,
    })
  }

  return null
}

// Helper: Obtenir la couleur de fond depuis BackgroundSettings
function getBackgroundColor(background: any): string {
  if (background.type === 'color') {
    return background.color || '#FFFFFF'
  } else if (background.type === 'gradient') {
    // Pour l'instant, on retourne la première couleur du gradient
    return background.gradient?.from || '#FFFFFF'
  } else if (background.type === 'image') {
    return '#FFFFFF' // Fond blanc par défaut si image
  }
  return '#FFFFFF'
}

