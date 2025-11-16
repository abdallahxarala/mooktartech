'use client'

import React from 'react'
import { Printer } from 'lucide-react'

interface ProductPlaceholderProps {
  productName: string
  productId: string
  brand?: string
  className?: string
}

export function ProductPlaceholder({ 
  productName, 
  productId, 
  brand = '',
  className = '' 
}: ProductPlaceholderProps) {
  
  // Couleurs par marque - version pastel élégante
  const getBrandColor = () => {
    const brandLower = brand.toLowerCase()
    
    if (brandLower.includes('entrust')) {
      if (productId.includes('dse')) return { bg: 'from-blue-50 to-indigo-50', icon: 'text-blue-500', border: 'border-blue-200' }
      if (productId.includes('ds1')) return { bg: 'from-orange-50 to-amber-50', icon: 'text-orange-500', border: 'border-orange-200' }
      if (productId.includes('ds2')) return { bg: 'from-purple-50 to-pink-50', icon: 'text-purple-500', border: 'border-purple-200' }
      if (productId.includes('ds3')) return { bg: 'from-red-50 to-rose-50', icon: 'text-red-500', border: 'border-red-200' }
      return { bg: 'from-blue-50 to-indigo-50', icon: 'text-blue-500', border: 'border-blue-200' }
    }
    
    if (brandLower.includes('datacard')) {
      return { bg: 'from-indigo-50 to-blue-50', icon: 'text-indigo-600', border: 'border-indigo-200' }
    }
    
    if (brandLower.includes('hiti')) {
      return { bg: 'from-green-50 to-emerald-50', icon: 'text-green-600', border: 'border-green-200' }
    }
    
    return { bg: 'from-gray-50 to-slate-50', icon: 'text-gray-600', border: 'border-gray-200' }
  }

  const getInitials = () => {
    const modelMatch = productName.match(/DS[E123]|CD\d+|CS-?\d+/i)
    if (modelMatch) {
      return modelMatch[0].toUpperCase()
    }
    
    const words = productName.split(' ').filter(w => w.length > 2)
    if (words.length >= 2) {
      return words[0][0] + words[1][0]
    }
    
    return productName.substring(0, 2).toUpperCase()
  }

  const colors = getBrandColor()

  return (
    <div className={`relative ${className}`}>
      <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex flex-col items-center justify-center p-8 border-2 ${colors.border} rounded-2xl`}>
        {/* Icône imprimante élégante */}
        <div className="relative mb-6">
          <div className={`absolute inset-0 ${colors.icon} opacity-10 blur-3xl rounded-full scale-150`} />
          <div className={`relative w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center ${colors.border} border-2`}>
            <Printer className={`w-12 h-12 ${colors.icon}`} />
          </div>
        </div>
        
        {/* Modèle */}
        <div className={`text-4xl md:text-5xl font-black ${colors.icon} mb-3 tracking-tight`}>
          {getInitials()}
        </div>
        
        {/* Marque */}
        {brand && (
          <div className={`text-sm font-bold ${colors.icon} opacity-70 mb-2`}>
            {brand}
          </div>
        )}
        
        {/* Nom produit */}
        <div className="text-xs text-gray-600 text-center line-clamp-2 px-4">
          {productName}
        </div>
        
        {/* Badge discret */}
        <div className="absolute bottom-3 right-3 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-600 border border-gray-200">
          📷 Photo à venir
        </div>
      </div>
    </div>
  )
}
