'use client'

import React from 'react'

interface PageTransitionsProps {
  children: React.ReactNode
  className?: string
}

/**
 * Transitions de page ultra-modernes
 * Design avec effets de morphing et blur
 */
export default function PageTransitions({ children, className = '' }: PageTransitionsProps) {
  return (
    <div className={`animate-fade-in-up ${className}`}>
      {children}
    </div>
  )
}

/**
 * Transition pour les sections
 */
export function SectionTransition({ children, className = '' }: PageTransitionsProps) {
  return (
    <div className={`animate-fade-in-up ${className}`}>
      {children}
    </div>
  )
}

/**
 * Transition pour les cartes
 */
export function CardTransition({ children, className = '', delay = 0 }: PageTransitionsProps & { delay?: number }) {
  return (
    <div 
      className={`animate-scale-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
