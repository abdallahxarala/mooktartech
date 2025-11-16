'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'

import { CARD_CONSTANTS } from '../constants'

import { useCardStore } from '../store/useCardStore'

export function CardFrame({ children }: { children: React.ReactNode }) {
  const zoom = useCardStore((state) => state.zoom)
  const rotation = useCardStore((state) => state.rotation)
  const showGrid = useCardStore((state) => state.showGrid)
  const showSafeZones = useCardStore((state) => state.showSafeZones)

  // Motion values pour effet 3D au survol (subtil, limité à ±2°)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-300, 300], [2, -2])
  const rotateY = useTransform(mouseX, [-300, 300], [-2, 2])

  const WIDTH = CARD_CONSTANTS.CANVAS.WIDTH
  const HEIGHT = CARD_CONSTANTS.CANVAS.HEIGHT
  const RATIO = CARD_CONSTANTS.CANVAS.ASPECT_RATIO

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Background clair */}
      <div className="absolute inset-0 bg-gray-50" />

      {/* Container avec perspective pour effet 3D subtil */}
      <div
        className="relative"
        style={{
          perspective: 2000,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          mouseX.set(e.clientX - rect.left - rect.width / 2)
          mouseY.set(e.clientY - rect.top - rect.height / 2)
        }}
        onMouseLeave={() => {
          mouseX.set(0)
          mouseY.set(0)
        }}
      >
        {/* Cadre carte avec effet 3D subtil */}
        <motion.div
          className="relative"
          style={{
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
            maxWidth: '720px',
            maxHeight: `${720 / RATIO}px`,
            aspectRatio: RATIO,
            transformStyle: 'preserve-3d',
            rotateX,
            rotateY,
          }}
          animate={{
            scale: zoom,
            rotate: rotation,
          }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
        >
          {/* Carte principale */}
          <div
            className="relative bg-white overflow-hidden"
            style={{
              width: `${WIDTH}px`,
              height: `${HEIGHT}px`,
              borderRadius: 20,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)',
            }}
          >
            {/* Zone de débord (bleed) - en rouge transparent */}
            {showSafeZones && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  border: `${CARD_CONSTANTS.SAFE_ZONES.BLEED}px solid rgba(239, 68, 68, 0.15)`,
                }}
              >
                {/* Labels des zones */}
                <div className="absolute top-1 left-1 text-[10px] font-mono text-red-500 bg-red-50 px-1 rounded">
                  BLEED {CARD_CONSTANTS.SAFE_ZONES.BLEED}px
                </div>
              </div>
            )}

            {/* Zone de sécurité (safe zone) - en vert transparent */}
            {showSafeZones && (
              <div
                className="absolute pointer-events-none"
                style={{
                  top: CARD_CONSTANTS.SAFE_ZONES.MARGIN,
                  left: CARD_CONSTANTS.SAFE_ZONES.MARGIN,
                  right: CARD_CONSTANTS.SAFE_ZONES.MARGIN,
                  bottom: CARD_CONSTANTS.SAFE_ZONES.MARGIN,
                  border: '1px dashed rgba(34, 197, 94, 0.5)',
                }}
              >
                <div className="absolute top-1 left-1 text-[10px] font-mono text-green-600 bg-green-50 px-1 rounded">
                  SAFE ZONE
                </div>
              </div>
            )}

            {/* Grille (optionnelle) */}
            {showGrid && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(148, 163, 184, 0.2) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px)
                  `,
                  backgroundSize: `${CARD_CONSTANTS.GRID.SIZE}px ${CARD_CONSTANTS.GRID.SIZE}px`,
                }}
              />
            )}

            {/* Canvas Fabric.js */}
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
