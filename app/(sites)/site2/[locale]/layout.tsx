import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n.config'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/ui/toast-provider'
import { Toaster } from 'react-hot-toast'
import MainLayout from '@/components/layout/main-layout'
import ScrollProgress from '@/components/ui/scroll-progress'
import CustomCursor from '@/components/ui/custom-cursor'

/**
 * Configuration de la police Inter
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

/**
 * Métadonnées SEO
 */
export const metadata: Metadata = {
  title: {
    default: 'E-commerce Platform',
    template: '%s'
  },
  description: 'Multi-tenant e-commerce platform',
}

/**
 * Génération des paramètres statiques pour les locales
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/**
 * Layout avec internationalisation et TenantContext
 * NOTE: TenantProvider est dans app/(sites)/layout.tsx (parent)
 */
export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Vérifier que la locale est supportée
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Charger les messages pour la locale
  const messages = await getMessages()

  return (
    <div className={inter.variable}>
      {/* Interactions globales modernes */}
      <ScrollProgress />
      <CustomCursor />
      
      {/* Provider pour next-intl */}
      <NextIntlClientProvider messages={messages}>
        {/* Provider pour le thème */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Layout principal avec header et footer */}
          <MainLayout>
            {children}
          </MainLayout>
          
          {/* Toast notifications */}
          <ToastProvider />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#374151',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid #f3f4f6',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                maxWidth: '500px'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff'
                },
                style: {
                  border: '2px solid #10b981'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff'
                },
                style: {
                  border: '2px solid #ef4444'
                }
              }
            }}
          />
        </ThemeProvider>
      </NextIntlClientProvider>
    </div>
  )
}
