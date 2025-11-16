'use client'

import React, { useState, useEffect } from 'react'

/**
 * Curseur personnalisé ultra-moderne
 * Design avec halo et effets de hover
 */
export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.matches('button, a, [role="button"], input, textarea, select')) {
        setIsHovering(true)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.matches('button, a, [role="button"], input, textarea, select')) {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return (
    <>
      {/* Curseur principal */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 8}px, ${mousePosition.y - 8}px) scale(${isClicking ? 0.8 : isHovering ? 1.5 : 1})`,
        }}
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg" />
      </div>

      {/* Halo effect */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-40 transition-all duration-150 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 20}px, ${mousePosition.y - 20}px) scale(${isHovering ? 2 : 1})`,
          opacity: isHovering ? 0.3 : 0.1,
        }}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 blur-sm" />
      </div>

      {/* Trailing effect */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-30 transition-all duration-100 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 4}px, ${mousePosition.y - 4}px) scale(${isHovering ? 0.5 : 0.8})`,
          opacity: isHovering ? 0.6 : 0.3,
        }}
      >
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-400 to-orange-400" />
      </div>
    </>
  )
}
