'use client'

import { motion } from 'framer-motion'
import { useCardStore } from '../store/useCardStore'

interface CardPreviewTiltProps {
  children: React.ReactNode
}

export function CardPreviewTilt({ children }: CardPreviewTiltProps) {
  const cardFace = useCardStore((state) => state.cardFace)

  return (
    <motion.div
      className="relative"
      animate={{
        rotateY: cardFace === 'back' ? 180 : 0,
      }}
      transition={{
        duration: 0.6,
        ease: 'easeInOut',
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  )
}

