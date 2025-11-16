'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store/app-store'

export function useProductsSync() {
  const products = useAppStore(state => state.products)
  const [isHydrated, setIsHydrated] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const [forceRenderKey, setForceRenderKey] = useState(0)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const handleChange = () => {
      setLastUpdate(Date.now())
      setForceRenderKey(Date.now())
    }

    window.addEventListener('products-changed', handleChange)
    return () => window.removeEventListener('products-changed', handleChange)
  }, [])

  return {
    products,
    isHydrated,
    lastUpdate,
    forceRenderKey
  }
}