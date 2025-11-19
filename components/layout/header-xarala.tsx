'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { 
  ShoppingCart, 
  Phone, 
  Menu, 
  X, 
  ChevronDown,
  Shield,
  User,
  LogIn,
  Package,
  Building2,
  Sparkles,
  HelpCircle,
  BadgeCheck,
  Printer,
  CreditCard,
  Scan,
  GraduationCap,
  PartyPopper,
  Landmark,
  ArrowRight,
  Sparkles as SparklesIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'
import { cn } from '@/lib/utils'

interface MenuItem {
  label: string
  href: string
  icon: React.ReactNode
  description?: string
  badge?: string
  children?: MenuItem[]
}

/**
 * Header moderne pour Xarala Solutions
 * Avec Mega Menu et navigation complète
 */
export function HeaderXarala() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
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

  // Menu items avec 4 sections principales
  const menuItems: MenuItem[] = [
    {
      label: 'Produits',
      href: `${basePath}/shop`,
      icon: <Package className="w-5 h-5" />,
      children: [
        {
          label: 'Imprimantes PVC',
          href: `${basePath}/shop?category=imprimantes`,
          icon: <Printer className="w-5 h-5" />,
          description: 'Imprimantes professionnelles',
          badge: 'Populaire'
        },
        {
          label: 'Cartes PVC',
          href: `${basePath}/shop?category=cartes-pvc`,
          icon: <CreditCard className="w-5 h-5" />,
          description: 'Cartes de qualité supérieure'
        },
        {
          label: 'Cartes NFC',
          href: `${basePath}/shop?category=cartes-nfc`,
          icon: <CreditCard className="w-5 h-5" />,
          description: 'Solutions NFC innovantes'
        },
        {
          label: 'Lecteurs & Scanners',
          href: `${basePath}/shop?category=lecteurs`,
          icon: <Scan className="w-5 h-5" />,
          description: 'Équipements de lecture'
        }
      ]
    },
    {
      label: 'Solutions',
      href: `${basePath}/solutions`,
      icon: <Building2 className="w-5 h-5" />,
      children: [
        {
          label: 'Entreprises',
          href: `${basePath}/solutions/business`,
          icon: <Building2 className="w-5 h-5" />,
          description: 'Solutions professionnelles sur mesure',
          badge: 'Recommandé'
        },
        {
          label: 'Éducation',
          href: `${basePath}/solutions/education`,
          icon: <GraduationCap className="w-5 h-5" />,
          description: 'Pour établissements scolaires'
        },
        {
          label: 'Événementiel',
          href: `${basePath}/solutions/events`,
          icon: <PartyPopper className="w-5 h-5" />,
          description: 'Gestion d\'accès et identification'
        },
        {
          label: 'Gouvernement',
          href: `${basePath}/solutions/government`,
          icon: <Landmark className="w-5 h-5" />,
          description: 'Solutions sécurisées pour institutions'
        }
      ]
    },
    {
      label: 'Services',
      href: `${basePath}/services`,
      icon: <Sparkles className="w-5 h-5" />,
      children: [
        {
          label: 'Créer ma carte NFC',
          href: `${basePath}/nfc-editor`,
          icon: <SparklesIcon className="w-5 h-5" />,
          description: 'Carte de visite digitale instantanée',
          badge: 'Gratuit'
        },
        {
          label: 'Éditeur de Badges',
          href: `${basePath}/badge-editor/pro`,
          icon: <BadgeCheck className="w-5 h-5" />,
          description: 'Design et impression professionnels',
          badge: 'Pro'
        }
      ]
    },
    {
      label: 'Support',
      href: `${basePath}/support`,
      icon: <HelpCircle className="w-5 h-5" />
    }
  ]

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
          ? "bg-white/95 backdrop-blur-lg shadow-md" 
          : "bg-white"
      )}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href={basePath} 
              className="flex items-center gap-3 group"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
              >
                <span className="text-2xl font-black text-white">X</span>
              </motion.div>
              <span className="text-xl font-black text-gray-900 hidden sm:inline group-hover:text-orange-500 transition-colors">
                Xarala Solutions
              </span>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {item.children ? (
                    <>
                      <button
                        className={cn(
                          "flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all",
                          pathname?.includes(item.href) 
                            ? "text-orange-500 bg-orange-50" 
                            : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        <ChevronDown className={cn(
                          "w-4 h-4 transition-transform",
                          activeMenu === item.label && "rotate-180"
                        )} />
                      </button>

                      {/* Mega Menu Dropdown */}
                      <AnimatePresence>
                        {activeMenu === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                          >
                            <div className="p-6">
                              <div className="grid grid-cols-2 gap-4">
                                {item.children.map((child, idx) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => setActiveMenu(null)}
                                  >
                                    <motion.div
                                      whileHover={{ scale: 1.02, x: 4 }}
                                      className="group p-4 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all cursor-pointer"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className={cn(
                                          "w-10 h-10 rounded-lg flex items-center justify-center text-white",
                                          idx === 0 ? "bg-gradient-to-br from-orange-500 to-pink-500" :
                                          idx === 1 ? "bg-gradient-to-br from-blue-500 to-purple-500" :
                                          idx === 2 ? "bg-gradient-to-br from-green-500 to-teal-500" :
                                          "bg-gradient-to-br from-purple-500 to-pink-500"
                                        )}>
                                          {child.icon}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                                              {child.label}
                                            </h4>
                                            {child.badge && (
                                              <span className={cn(
                                                "text-xs px-2 py-0.5 rounded-full font-semibold",
                                                child.badge === 'Gratuit' ? "bg-green-100 text-green-700" :
                                                child.badge === 'Pro' ? "bg-purple-100 text-purple-700" :
                                                "bg-orange-100 text-orange-700"
                                              )}>
                                                {child.badge}
                                              </span>
                                            )}
                                          </div>
                                          {child.description && (
                                            <p className="text-sm text-gray-600">
                                              {child.description}
                                            </p>
                                          )}
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                                      </div>
                                    </motion.div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                        pathname === item.href 
                          ? "text-orange-500 bg-orange-50" 
                          : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Panier */}
              <Link 
                href={`${basePath}/cart`}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center justify-center group"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-orange-500 transition-colors" />
                {mounted && itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </Link>

              {/* Admin Button */}
              {isMultitenant && slug === 'xarala-solutions' && (
                <Link
                  href={`${basePath}/admin`}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group"
                >
                  <Shield className="w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors">
                    Admin
                  </span>
                </Link>
              )}

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

              {/* Desktop Auth Buttons */}
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href={`${basePath}/login`}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:text-orange-500 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </Link>
                
                <Link
                  href={`${basePath}/register`}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30"
                >
                  <User className="w-4 h-4" />
                  <span>Inscription</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t bg-white"
            >
              <div className="container mx-auto px-6 py-4 space-y-2">
                {menuItems.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-4 py-3 font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                        </div>
                        <div className="pl-6 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors"
                            >
                              {child.icon}
                              <div className="flex-1">
                                <div className="font-medium">{child.label}</div>
                                {child.description && (
                                  <div className="text-xs text-gray-500">{child.description}</div>
                                )}
                              </div>
                              {child.badge && (
                                <span className={cn(
                                  "text-xs px-2 py-0.5 rounded-full font-semibold",
                                  child.badge === 'Gratuit' ? "bg-green-100 text-green-700" :
                                  child.badge === 'Pro' ? "bg-purple-100 text-purple-700" :
                                  "bg-orange-100 text-orange-700"
                                )}>
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors font-medium"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t space-y-2">
                  <Link
                    href={`${basePath}/login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Connexion</span>
                  </Link>
                  <Link
                    href={`${basePath}/register`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span>Inscription</span>
                  </Link>
                  {isMultitenant && slug === 'xarala-solutions' && (
                    <Link
                      href={`${basePath}/admin`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                    >
                      <Shield className="w-5 h-5" />
                      <span>Admin</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

