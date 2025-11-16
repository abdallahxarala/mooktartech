'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Trophy, Zap } from 'lucide-react'

interface GamifiedProgressProps {
  progress: number
  currentStep: number
  totalSteps: number
}

export function GamifiedProgress({ progress, currentStep, totalSteps }: GamifiedProgressProps) {
  const milestones = [
    { at: 25, label: '🚀 Bon départ!', color: 'blue' },
    { at: 50, label: '💪 Continue!', color: 'purple' },
    { at: 75, label: '🔥 Presque là!', color: 'orange' },
    { at: 100, label: '✨ Parfait!', color: 'green' }
  ]
  
  const currentMilestone = milestones.find(m => progress >= m.at && progress < (m.at + 25))

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        
        {/* Sparkle effect at progress end */}
        {progress > 0 && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${progress}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400 -ml-2" />
          </motion.div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-gray-900">
            Étape {currentStep}/{totalSteps}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">
            {Math.round(progress)}%
          </span>
          <Trophy className="w-4 h-4 text-yellow-500" />
        </div>
      </div>

      {/* Milestone celebration */}
      {currentMilestone && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-2 px-4 bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl border-2 border-orange-300"
        >
          <div className="text-sm font-bold text-orange-700">
            {currentMilestone.label}
          </div>
        </motion.div>
      )}

      {/* Completion celebration */}
      {progress >= 100 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-xl"
        >
          <div className="flex items-center justify-center gap-2 font-black">
            <Trophy className="w-5 h-5" />
            <span>Profil complété! 🎉</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

