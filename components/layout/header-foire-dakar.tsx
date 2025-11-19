'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { 
  Menu, 
  X, 
  Calendar,
  Ticket,
  Users,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Header événementiel pour Foire Dakar 2025
 * Design festif avec accent sur l'événement
 */
export function HeaderFoireDakar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const params = useParams()
  
  const locale = (params?.locale as string) || 'fr'
  const slug = params?.slug as string | undefined
  const isMultitenant = pathname?.includes('/org/') && slug
  const basePath = isMultitenant ? `/${locale}/org/${slug}` : `/${locale}`

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Accueil', href: basePath, icon: <Calendar className="w-4 h-4" /> },
    { label: 'Événements', href: `${basePath}/foires`, icon: <Ticket className="w-4 h-4" /> },
    { label: 'Exposants', href: `${basePath}/foires/foire-dakar-2025/catalogue`, icon: <Users className="w-4 h-4" /> },
    { label: 'Billetterie', href: `${basePath}/foires/foire-dakar-2025/tickets`, icon: <Ticket className="w-4 h-4" /> },
    { label: 'Contact', href: `${basePath}/contact`, icon: <Phone className="w-4 h-4" /> },
  ]

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-2">
        <div className="container mx-auto px-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <MapPin className="w-4 h-4" />
            <span>Dakar, Sénégal • 15-20 Mars 2025</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+221338232326" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="w-4 h-4" />
              <span>33 823 23 26</span>
            </a>
            <span className="text-white/50">|</span>
            <a href="mailto:contact@foiredakar.sn" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail className="w-4 h-4" />
              <span>contact@foiredakar.sn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-lg shadow-lg" 
          : "bg-white"
      )}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={basePath} className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-black text-gray-900 group-hover:text-purple-600 transition-colors">
                  Foire Dakar 2025
                </div>
                <div className="text-xs text-gray-500">Événement professionnel</div>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                    pathname === item.href || pathname?.includes(item.href)
                      ? "text-purple-600 bg-purple-50" 
                      : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href={`${basePath}/foires/foire-dakar-2025/inscription`}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/20 hover:shadow-xl"
              >
                S'inscrire
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
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t bg-white"
          >
            <div className="container mx-auto px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                    pathname === item.href || pathname?.includes(item.href)
                      ? "text-purple-600 bg-purple-50" 
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t">
                <Link
                  href={`${basePath}/foires/foire-dakar-2025/inscription`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-center transition-all"
                >
                  S'inscrire comme exposant
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>
    </>
  )
}

