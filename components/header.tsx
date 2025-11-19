'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { getNavigationConfig } from '@/lib/config/navigation'
import { getTopBarConfig } from '@/lib/config/topbar'
import { Menu, X, ChevronDown, ShoppingCart } from 'lucide-react'

interface HeaderProps {
  locale: string
  slug: string
}

export default function Header({ locale, slug }: HeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const getItemCount = useCartStore((state) => state.getItemCount)
  const itemCount = mounted ? getItemCount() : 0
  
  const navConfig = getNavigationConfig(slug)
  const topBarConfig = getTopBarConfig(slug)

  // Hydration check
  useEffect(() => {
    setMounted(true)
  }, [])

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const headerClasses = `fixed ${topBarConfig?.show ? 'top-8' : 'top-0'} left-0 right-0 z-50 transition-all duration-300 ${
    scrolled ? 'bg-white shadow-md py-3' : 'bg-white py-4'
  }`

  return (
    <>
      {/* TOP BAR */}
      {topBarConfig?.show && (
        <div className={`fixed top-0 left-0 right-0 z-[60] ${topBarConfig.backgroundColor} ${topBarConfig.textColor} py-2 text-sm`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8">
              {topBarConfig.items.map((item, idx) => (
                item.href ? (
                  <a
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-2 hover:opacity-80 transition"
                  >
                    <span>{item.icon}</span>
                    <span className="hidden sm:inline">{item.text}</span>
                  </a>
                ) : (
                  <div key={idx} className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="hidden sm:inline">{item.text}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className={headerClasses}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <Link href={`/${locale}/org/${slug}`} className="flex items-center gap-3">
              {navConfig.logo.image ? (
                <img 
                  src={navConfig.logo.image} 
                  alt={navConfig.logo.text} 
                  className="h-10 w-auto"
                />
              ) : navConfig.logo.icon ? (
                <span className="text-4xl">{navConfig.logo.icon}</span>
              ) : null}
              <div>
                <div className="text-xl font-bold text-gray-900">{navConfig.logo.text}</div>
                {navConfig.logo.subtitle && (
                  <div className="text-xs text-gray-600">{navConfig.logo.subtitle}</div>
                )}
              </div>
            </Link>

            {/* DESKTOP MENU */}
            <nav className="hidden lg:flex items-center gap-8">
              {navConfig.mainMenu.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.submenu && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 font-medium transition-colors ${
                      pathname === item.href
                        ? 'text-orange-500'
                        : 'text-gray-700 hover:text-orange-500'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.submenu && <ChevronDown className="h-4 w-4" />}
                  </Link>

                  {/* DROPDOWN */}
                  {item.submenu && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">
              {/* CART */}
              <Link
                href={`/${locale}/org/${slug}/cart`}
                className="relative p-2 hover:text-orange-500 transition"
              >
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* CTA BUTTON */}
              {navConfig.ctaButton && (
                <Link
                  href={navConfig.ctaButton.href}
                  className={`hidden lg:inline-block px-6 py-2 rounded-lg font-semibold transition ${
                    navConfig.ctaButton.variant === 'primary'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-900 text-white'
                  }`}
                >
                  {navConfig.ctaButton.label}
                </Link>
              )}

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <>
          {/* BACKDROP */}
          <div
            className="fixed inset-0 bg-black/50 z-[70] lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* SIDEBAR */}
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[80] shadow-2xl lg:hidden overflow-y-auto">
            <div className="p-4">
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2"
              >
                <X className="h-6 w-6" />
              </button>

              {/* LOGO */}
              <Link
                href={`/${locale}/org/${slug}`}
                className="flex items-center gap-3 mb-8"
                onClick={() => setMobileMenuOpen(false)}
              >
                {navConfig.logo.image ? (
                  <img 
                    src={navConfig.logo.image} 
                    alt={navConfig.logo.text} 
                    className="h-10 w-auto"
                  />
                ) : navConfig.logo.icon ? (
                  <span className="text-4xl">{navConfig.logo.icon}</span>
                ) : null}
                <div>
                  <div className="text-xl font-bold">{navConfig.logo.text}</div>
                  {navConfig.logo.subtitle && (
                    <div className="text-xs text-gray-600">{navConfig.logo.subtitle}</div>
                  )}
                </div>
              </Link>

              {/* MENU ITEMS */}
              <nav className="space-y-2">
                {navConfig.mainMenu.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                    {item.submenu && (
                      <div className="ml-8 mt-2 space-y-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-orange-500 transition"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* CTA BUTTON */}
              {navConfig.ctaButton && (
                <Link
                  href={navConfig.ctaButton.href}
                  className={`block w-full text-center mt-6 px-6 py-3 rounded-lg font-semibold transition ${
                    navConfig.ctaButton.variant === 'primary'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-900 text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {navConfig.ctaButton.label}
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      {/* SPACER */}
      <div className={topBarConfig?.show ? 'h-24 lg:h-28' : 'h-16 lg:h-20'} />
    </>
  )
}

