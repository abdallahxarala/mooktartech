'use client'

import { useEffect, useState } from 'react'

/**
 * Hook simple pour attendre l'hydration du store
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Attendre que le client soit prêt
    setIsHydrated(true)
  }, [])

  return isHydrated
}