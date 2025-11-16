'use client'

import { ReactNode } from 'react'
import { Header } from '@/components/header'
import Footer from './footer'

/**
 * Layout principal de l'application Xarala Solutions
 * Combine le header et le footer avec le contenu principal
 */

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fixe */}
      <Header />
      
      {/* Contenu principal avec padding pour le header fixe */}
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
