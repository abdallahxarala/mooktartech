'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { ShoppingCart, Phone } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { cn } from '@/lib/utils'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const params = useParams()
  const items = useCartStore((state) => state.items)
  
  // Détecter le contexte multitenant
  const locale = (params?.locale as string) || 'fr'
  const slug = params?.slug as string | undefined
  const isMultitenant = pathname?.includes('/org/') && slug
  
  // Construire les routes de base
  const basePath = isMultitenant ? `/${locale}/org/${slug}` : `/${locale}`

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculer itemCount seulement après montage pour éviter l'hydration mismatch
  const itemCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0

  return (
    <>
      {/* Top bar */}
      <div className="bg-gray-900 text-white py-2 border-b border-gray-800">
        <div className="container mx-auto px-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <span className="text-gray-400">🇸🇳 Dakar, Sénégal</span>
            <span className="hidden md:block text-gray-400">•</span>
            <span className="hidden md:block text-gray-400">Livraison 24-48h</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="tel:+221338232326" 
              className="flex items-center gap-2 hover:text-orange-400 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">33 823 23 26</span>
            </a>
            <span className="text-gray-700">|</span>
            <a 
              href="https://wa.me/221775398139" 
              className="flex items-center gap-2 hover:text-orange-400 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">77 539 81 39</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-lg shadow-sm" 
          : "bg-white"
      )}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={basePath} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-white">X</span>
              </div>
              <span className="text-xl font-black text-gray-900 hidden sm:inline">
                Xarala Solutions
              </span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href={basePath} 
                className={cn(
                  "font-medium transition-colors",
                  pathname === basePath || pathname === `/${locale}` ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
                )}
              >
                Accueil
              </Link>
              <Link 
                href={`${basePath}/shop`}
                className={cn(
                  "font-medium transition-colors",
                  pathname?.includes('/shop') || pathname?.includes('/products') ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
                )}
              >
                Produits
              </Link>
              <Link 
                href={`${basePath}/nfc-editor`}
                className={cn(
                  "font-medium transition-colors",
                  pathname?.includes('/nfc-editor') ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
                )}
              >
                Créer ma carte
              </Link>
              <Link 
                href={`${basePath}/about`}
                className={cn(
                  "font-medium transition-colors",
                  pathname?.includes('/about') ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
                )}
              >
                À propos
              </Link>
            </div>

            {/* Actions - CORRIGÉ: Plus de bouton imbriqué */}
            <div className="flex items-center gap-3">
              {/* Panier - Link simple sans button */}
              <Link 
                href={`${basePath}/cart`}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              <div className="hidden md:flex items-center gap-2">
                {/* Connexion */}
                <Link
                  href={`${basePath}/login`}
                  className="px-4 py-2 text-gray-700 font-medium hover:text-orange-500 transition-colors"
                >
                  Connexion
                </Link>
                
                {/* Inscription */}
                <Link
                  href={`${basePath}/register`}
                  className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                >
                  Inscription
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header