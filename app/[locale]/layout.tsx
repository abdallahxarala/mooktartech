import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/ui/toast-provider'
import { Toaster } from 'react-hot-toast'
import MainLayout from '@/components/layout/main-layout'
import ScrollProgress from '@/components/ui/scroll-progress'
import CustomCursor from '@/components/ui/custom-cursor'
import '../globals.css'

// Force dynamic
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Configuration de la police Inter
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

/**
 * Métadonnées SEO pour Xarala Solutions
 */
export const metadata: Metadata = {
  title: {
    default: 'Xarala Solutions - Solutions d\'identification professionnelles',
    template: '%s | Xarala Solutions'
  },
  description: 'Plateforme e-commerce B2B sénégalaise spécialisée dans les cartes PVC, NFC et QR codes. Solutions d\'identification professionnelles sur mesure.',
  keywords: [
    'cartes PVC',
    'cartes NFC',
    'QR codes',
    'identification professionnelle',
    'Sénégal',
    'Dakar',
    'e-commerce B2B',
    'cartes de visite',
    'badges',
    'étiquettes'
  ],
  authors: [{ name: 'Xarala Solutions' }],
  creator: 'Xarala Solutions',
  publisher: 'Xarala Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://xarala.sn'),
  alternates: {
    canonical: '/',
    languages: {
      'fr': '/fr',
      'en': '/en',
      'wo': '/wo',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    url: 'https://xarala.sn',
    siteName: 'Xarala Solutions',
    title: 'Xarala Solutions - Solutions d\'identification professionnelles',
    description: 'Plateforme e-commerce B2B sénégalaise spécialisée dans les cartes PVC, NFC et QR codes.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Xarala Solutions - Solutions d\'identification professionnelles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xarala Solutions - Solutions d\'identification professionnelles',
    description: 'Plateforme e-commerce B2B sénégalaise spécialisée dans les cartes PVC, NFC et QR codes.',
    images: ['/og-image.jpg'],
    creator: '@xarala_solutions',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

/**
 * Génération des paramètres statiques pour les locales
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Layout principal avec internationalisation
 */
export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Vérifier que la locale est supportée
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Get messages
  const messages = await getMessages()

  return (
    <>
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
      
      {/* Scripts d'analytics (optionnel) */}
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `,
            }}
          />
        </>
      )}
    </>
  )
}