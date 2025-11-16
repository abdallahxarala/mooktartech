'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Save, Sparkles } from 'lucide-react'
import { NFCEditorClient } from '@/components/nfc-wizard/nfc-editor-client'
import { useNFCEditorStore } from '@/lib/store/nfc-editor-store'

export default function NFCEditorPage() {
  const { currentProfile } = useNFCEditorStore()
  const [isSaving, setIsSaving] = useState(false)

  // Auto-save indicator
  useEffect(() => {
    if (currentProfile) {
      setIsSaving(true)
      const timer = setTimeout(() => setIsSaving(false), 500)
      return () => clearTimeout(timer)
    }
  }, [currentProfile])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      
      {/* Sticky Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Left: Back */}
            <Link
              href="/fr"
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour à l'accueil</span>
              <span className="sm:hidden">Retour</span>
            </Link>

            {/* Center: Title */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <h1 className="text-xl font-black text-gray-900">
                <span className="hidden md:inline">Créateur de Carte NFC</span>
                <span className="md:hidden">NFC Editor</span>
              </h1>
            </div>

            {/* Right: Status */}
            <div className="flex items-center gap-3">
              
              {/* Auto-save indicator */}
              <AnimatePresence>
                {isSaving && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Enregistré</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Plan badge */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 font-bold rounded-xl text-sm border-2 border-orange-200">
                <Sparkles className="w-4 h-4" />
                <span>Gratuit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wizard Content */}
      <div className="container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile?.id || 'empty'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <NFCEditorClient />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
