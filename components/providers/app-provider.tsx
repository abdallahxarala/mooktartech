'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store/app-store'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAppStore(state => state.hydrate)
  const isHydrated = useAppStore(state => state.isHydrated)

  useEffect(() => {
    if (!isHydrated) {
      console.log('🌊 [PROVIDER] Hydratation du store...')
      hydrate()
    }
  }, [hydrate, isHydrated])

  return <>{children}</>
}
