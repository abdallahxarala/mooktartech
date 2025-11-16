'use client'

import React, { useState, useEffect } from 'react'
import { HardDrive } from 'lucide-react'

export function StorageUsage() {
  const [usage, setUsage] = useState(0)
  const [total] = useState(5000) // 5MB max

  useEffect(() => {
    const updateUsage = () => {
      try {
        const data = localStorage.getItem('xarala-products') || '{}'
        const sizeKB = data.length / 1024
        setUsage(sizeKB)
      } catch (error) {
        console.error('Erreur calcul storage:', error)
      }
    }

    updateUsage()
    window.addEventListener('xarala-products-updated', updateUsage)
    
    return () => window.removeEventListener('xarala-products-updated', updateUsage)
  }, [])

  const percentage = (usage / total) * 100
  const isWarning = percentage > 70
  const isDanger = percentage > 90

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <div className={`px-4 py-3 rounded-xl shadow-lg bg-white ${
        isDanger ? 'border-2 border-red-500' : isWarning ? 'border-2 border-orange-500' : 'border border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <HardDrive className={`w-5 h-5 ${
            isDanger ? 'text-red-500' : isWarning ? 'text-orange-500' : 'text-gray-400'
          }`} />
          <div>
            <div className="text-sm font-semibold text-gray-900">
              Stockage
            </div>
            <div className="text-xs text-gray-600">
              {usage.toFixed(2)} / {total} KB
            </div>
            <div className="w-32 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  isDanger ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}