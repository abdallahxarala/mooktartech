'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CreditCard, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EditorSelector() {
  const pathname = usePathname()
  const isNFCEditor = pathname.includes('/card-editor')
  const isPVCEditor = pathname.includes('/card-designer')

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <Link
        href="/fr/card-editor"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
          isNFCEditor
            ? "bg-white text-orange-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        <Smartphone className="w-4 h-4" />
        <span>Carte NFC</span>
      </Link>
      
      <Link
        href="/fr/card-designer"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
          isPVCEditor
            ? "bg-white text-orange-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        <CreditCard className="w-4 h-4" />
        <span>Carte PVC</span>
      </Link>
    </div>
  )
}
