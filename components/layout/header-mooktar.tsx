'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Search,
  User,
  LogIn,
  Package
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'
import { cn } from '@/lib/utils'

/**
 * Header e-commerce simple pour Mooktar Tech
 * Design épuré axé sur la vente de produits
 */
export function HeaderMooktar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const params = useParams()
  const items = useCartStore((state) => state.items)
  
  const locale = (params?.locale as string) || 'fr'
  const slug = params?.slug as string | undefined
  const isMultitenant = pathname?.includes('/org/') && slug
  const basePath = isMultitenant ? `/${locale}/org/${slug}` : `/${locale}`

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0

  const navItems = [
    { label: 'Accueil', href: basePath },
    { label: 'Produits', href: `${basePath}/shop` },
    { label: 'Catégories', href: `${basePath}/shop?view=categories` },
    { label: 'Contact', href: `${basePath}/contact` },
  ]

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300 bg-white border-b",
      isScrolled && "shadow-md"
    )}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={basePath} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-xl font-black text-white">M</span>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:inline group-hover:text-blue-600 transition-colors">
              Mooktar Tech
            </span>
          </Link>

          {/* Search Bar Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === item.href 
                    ? "text-blue-600" 
                    : "text-gray-700 hover:text-blue-600"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search Mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {/* Panier */}
            <Link 
              href={`${basePath}/cart`}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center justify-center group"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
              {mounted && itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </Link>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href={`${basePath}/login`}
                className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm"
              >
                Connexion
              </Link>
              <Link
                href={`${basePath}/register`}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Inscription
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </motion.div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pb-4 border-t pt-4"
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-2 rounded-lg font-medium transition-colors",
                    pathname === item.href 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t space-y-2">
                <Link
                  href={`${basePath}/login`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Connexion
                </Link>
                <Link
                  href={`${basePath}/register`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-center"
                >
                  Inscription
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}

