'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/header'
import Footer from './footer'

/**
 * Layout principal de l'application Xarala Solutions
 * Combine le header et le footer avec le contenu principal
 * Extrait automatiquement locale et slug depuis le pathname
 */

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  const pathname = usePathname()

  // Extraire locale et slug depuis le pathname
  // Format attendu : /fr/org/mooktartech-com/...
  const pathSegments = pathname.split('/').filter(Boolean)

  const locale = pathSegments[0] || 'fr' // Premier segment = locale (fr, en, etc.)
  const slug = pathSegments[2] || 'xarala-solutions' // Troisième segment = slug (après /org/)

  // Si pas de slug dans l'URL, utiliser un défaut
  const organizationSlug = pathname.includes('/org/') ? slug : 'xarala-solutions'

  // Debug logs temporaires
  console.log('🔍 MainLayout Debug:', {
    pathname,
    pathSegments,
    locale,
    slug: organizationSlug
  })

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fixe avec locale et slug extraits automatiquement */}
      <Header locale={locale} slug={organizationSlug} />
      
      {/* Contenu principal avec padding pour le header fixe */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
