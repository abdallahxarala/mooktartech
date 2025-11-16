'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  ShoppingCart,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { MegaDropdown, menuConfig } from '@/components/mega-menu/mega-dropdown'

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<"nfc" | "badges" | "produits" | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      // Header toujours visible, change juste l'apparence après 10px
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
    }
    if (activeMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeMenu])

  const isActive = (path: string) => pathname === path || pathname.startsWith(path)

  const navigation = [
    { name: 'Cartes NFC', href: '/fr/nfc-editor', hasDropdown: true, type: 'nfc' as const },
    { name: 'Badges', href: '/fr/badge-editor', hasDropdown: true, type: 'badges' as const },
    { name: 'Produits', href: '/fr/products', hasDropdown: true, type: 'produits' as const },
    { name: 'Contact', href: '/fr/contact', hasDropdown: false },
  ]

  return (
    <>
      {/* Topbar - Ultra slim - TOUJOURS VISIBLE */}
      <div className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        isScrolled 
          ? 'border-gray-200/80 bg-white/95 backdrop-blur-2xl shadow-sm' 
          : 'border-white/20 bg-gradient-to-r from-orange-500/95 via-pink-500/95 to-purple-500/95 backdrop-blur-md'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-10 text-xs">
            {/* Left - Contact rapide */}
            <div className="hidden lg:flex items-center gap-4">
              <a 
                href="tel:+221775398139"
                className={`flex items-center gap-2 font-medium transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-orange-500' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>+221 77 539 81 39</span>
              </a>

              <a 
                href="mailto:contact@xarala-solutions.com"
                className={`flex items-center gap-2 font-medium transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-orange-500' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>contact@xarala-solutions.com</span>
              </a>

              <div className={`flex items-center gap-2 ${
                isScrolled ? 'text-gray-600' : 'text-white/80'
              }`}>
                <MapPin className="w-4 h-4" />
                <span>Dakar, Sénégal</span>
              </div>
            </div>

            {/* Right - Promo/Hours */}
            <div className="flex items-center gap-4">
              <div className={`hidden md:flex items-center gap-2 ${
                isScrolled ? 'text-gray-600' : 'text-white/80'
              }`}>
                <Clock className="w-4 h-4" />
                <span>Lun-Sam: 8h-18h</span>
              </div>

              <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-xs ${
                isScrolled 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-white/20 text-white backdrop-blur-sm'
              }`}>
                <Sparkles className="w-3 h-3" />
                <span>Livraison 24h Dakar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - TOUJOURS VISIBLE avec fond */}
      <header className={`fixed top-10 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg' 
          : 'bg-white/98 backdrop-blur-xl shadow-md'
      }`}>
        <nav className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/fr" 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-orange-500/20 blur-xl" />
              
              {/* Logo badge - TOUJOURS ORANGE */}
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-orange-500/30 transition-transform group-hover:scale-110">
                X
              </div>
            </div>
            
            <div>
              {/* Texte logo - TOUJOURS FONCÉ */}
              <div className="font-black text-xl tracking-tight text-gray-900">
                Xarala Solutions
              </div>
              <div className="text-xs font-semibold text-gray-600">
                Identification Pro
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav ref={menuRef} className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveMenu(item.type || null)}
                onMouseLeave={() => item.hasDropdown && setActiveMenu(null)}
              >
                {item.hasDropdown ? (
                  <button
                    className={`flex items-center gap-1 text-gray-700 hover:text-orange-500 transition-colors font-medium ${
                      isActive(item.href) ? 'text-orange-500' : ''
                    }`}
                  >
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      activeMenu === item.type ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-gray-700 hover:text-orange-500 transition-colors font-medium ${
                      isActive(item.href) ? 'text-orange-500' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
                
                {/* Mega Menu Dropdown */}
                {item.hasDropdown && item.type && activeMenu === item.type && (
                  <MegaDropdown
                    section={item.type}
                    items={menuConfig[item.type] || []}
                    onClose={() => setActiveMenu(null)}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/fr/cart"
              className={`relative p-3 rounded-xl transition-all ${
                isScrolled
                  ? 'hover:bg-gray-100 text-gray-700'
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-pink-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* CTA Button */}
            <Link
              href="/fr/contact"
              className={`hidden md:flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all shadow-lg ${
                isScrolled
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/30'
                  : 'bg-white text-orange-500 hover:bg-gray-50 shadow-white/30'
              }`}
            >
              <span>Devis gratuit</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-3 rounded-xl transition-all ${
                isScrolled
                  ? 'hover:bg-gray-100 text-gray-700'
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-2xl animate-fade-in">
          <div className="container mx-auto px-6 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${
                  isActive(item.href)
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Contact */}
            <div className="pt-6 mt-6 border-t border-gray-200 space-y-3">
              <a
                href="tel:+221775398139"
                className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-semibold"
              >
                <Phone className="w-5 h-5" />
                <span>+221 77 539 81 39</span>
              </a>

              <Link
                href="/fr/contact"
                className="block text-center px-4 py-3 bg-orange-500 text-white font-bold rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      )}
      </header>
    </>
  )
}

