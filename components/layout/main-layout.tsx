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

  // Détecter si on est sur une route org (qui a son propre layout)
  const isOrgRoute = pathname?.includes('/org/')

  // Si c'est une route org, ne pas afficher Header/Footer ici
  // Le layout org/[slug]/layout.tsx s'en chargera
  if (isOrgRoute) {
    return <>{children}</>
  }

  // Extraire locale et slug depuis le pathname pour les routes non-org
  const pathSegments = pathname.split('/').filter(Boolean)
  const locale = pathSegments[0] || 'fr'
  const slug = pathSegments[2] || 'xarala-solutions'
  const organizationSlug = pathname.includes('/org/') ? slug : 'xarala-solutions'

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
