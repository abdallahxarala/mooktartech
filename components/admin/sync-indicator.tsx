'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'

export function SyncIndicator() {
  const [lastSync, setLastSync] = useState<Date>(new Date())
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const handleSync = () => {
      setLastSync(new Date())
      setHasChanges(false)
      setTimeout(() => setHasChanges(false), 2000)
    }

    window.addEventListener('xarala-products-updated', handleSync)
    return () => window.removeEventListener('xarala-products-updated', handleSync)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
        hasChanges ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'
      }`}>
        {hasChanges ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
        <div className="text-sm">
          <div className="font-semibold">
            {hasChanges ? 'Synchronisation...' : 'Synchronisé'}
          </div>
          <div className="text-xs opacity-70">
            {lastSync.toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  )
}
