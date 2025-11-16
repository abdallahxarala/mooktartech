'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useAppStore } from '@/lib/store/app-store'

export function SyncIndicator() {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced')
  const [lastSync, setLastSync] = useState<string | null>(null)
  const productsCount = useAppStore(state => state.products.length)
  const lastUpdate = useAppStore(state => state.lastUpdate)

  useEffect(() => {
    const handleUpdate = (event: any) => {
      setSyncStatus('syncing')
      setTimeout(() => {
        setSyncStatus('synced')
        setLastSync(new Date().toLocaleTimeString('fr-FR'))
      }, 500)
    }

    window.addEventListener('xarala-products-updated', handleUpdate)
    return () => window.removeEventListener('xarala-products-updated', handleUpdate)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`
        px-4 py-3 rounded-xl shadow-lg border-2 transition-all
        ${syncStatus === 'synced' ? 'bg-green-50 border-green-200' :
          syncStatus === 'syncing' ? 'bg-blue-50 border-blue-200' :
          'bg-red-50 border-red-200'}
      `}>
        <div className="flex items-center gap-3">
          {syncStatus === 'synced' && <CheckCircle className="w-5 h-5 text-green-600" />}
          {syncStatus === 'syncing' && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
          {syncStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
          
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {syncStatus === 'synced' && '✅ Synchronisé'}
              {syncStatus === 'syncing' && '⏳ Synchronisation...'}
              {syncStatus === 'error' && '❌ Erreur'}
            </div>
            <div className="text-xs text-gray-600">
              {productsCount} produits
              {lastSync && ` • ${lastSync}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
