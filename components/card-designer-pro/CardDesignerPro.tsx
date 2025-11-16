'use client'

import { motion } from 'framer-motion'

import { Save } from 'lucide-react'

import { CardFrame } from './core/CardFrame'

import { CardCanvas } from './core/CardCanvas'

import { CardControls } from './core/CardControls'

import { useCardStore } from './store/useCardStore'

import { Button } from '@/components/ui/button'

export function CardDesignerPro() {
  const layers = useCardStore((state) => state.layers)
  const cardFace = useCardStore((state) => state.cardFace)
  
  const faceLabel = cardFace === 'front' ? 'Recto' : 'Verso'

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-100 text-gray-900 pt-4">
      {/* Zone tampon pour le header global */}
      <div className="w-full h-4" />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="h-14 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600">
                Studio
              </span>
              <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-600">
                Beta
              </span>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-gray-900">
                Card Designer PRO
              </span>
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <span>{layers.length} {layers.length <= 1 ? 'calque' : 'calques'}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 uppercase tracking-[0.16em] text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  {faceLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Brouillon
            </Button>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </div>
      </header>

      {/* Zone principale */}
      <div className="flex-1 grid grid-cols-[260px,minmax(0,1fr),280px] gap-4 px-4 py-4">
        {/* Colonne gauche : Tools */}
        <aside className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Outils
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
              Bientôt
            </span>
          </div>
          <div className="space-y-2 text-xs text-gray-600">
            <p>Texte, Images, Formes, QR Code, Variables de données…</p>
            <p className="text-[11px] text-gray-400">
              Ici viendront les outils drag & drop. Pour l'instant, cette colonne est un placeholder design.
            </p>
          </div>
        </aside>

        {/* Colonne centrale : Canvas */}
        <main className="flex items-center justify-center">
          <div className="relative w-full max-w-5xl flex flex-col items-center gap-4">
            {/* Container 3D avec animation flip */}
            <motion.div
              key={cardFace}
              className="w-full flex items-center justify-center"
              initial={{ rotateY: cardFace === 'front' ? -180 : 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: cardFace === 'front' ? 180 : -180, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              style={{
                transformStyle: 'preserve-3d',
                perspective: 1600,
              }}
            >
              <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
                <CardFrame>
                  <CardCanvas />
                </CardFrame>
              </div>
            </motion.div>

            {/* Controls sous la carte */}
            <CardControls />
          </div>
        </main>

        {/* Colonne droite : Propriétés & Calques */}
        <aside className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Propriétés
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
              À venir
            </span>
          </div>
          <div className="space-y-2 text-xs text-gray-600">
            <p>
              Ici tu ajusteras : couleurs, typographie, alignement, rayons, ombres…
            </p>
            <p className="text-[11px] text-gray-400">
              Pour l'instant, c'est une zone statique pour donner une vraie impression de studio.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
