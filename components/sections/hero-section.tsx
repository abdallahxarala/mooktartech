'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowRight, CreditCard, Smartphone, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useScroll, useTransform } from 'framer-motion'

/**
 * Hero Section moderne pour Xarala Solutions
 * Section d'accueil avec animations et design responsive
 */

export default function HeroSection() {
  const t = useTranslations('hero')
  
  // Animation parallax au scroll
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -50])

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden animate-fade-in-up">
      {/* Fond avec dégradé et motif géométrique */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 animate-fade-in-up">
        {/* Motif géométrique subtil */}
        <div className="absolute inset-0 opacity-10 animate-fade-in-up">
          <svg
            className="w-full h-full animate-fade-in-up"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Formes géométriques flottantes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/15 rounded-full blur-lg animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10 animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in-up">
          
          {/* Contenu texte */}
          <div className="text-white space-y-8 animate-fade-in-up">
            {/* Titre principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up">
              {t('title')}
            </h1>

            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed animate-fade-in-up">
              {t('subtitle')}
            </p>

            {/* Boutons CTA */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary-600 hover:bg-white/90 text-lg px-8 py-4 h-auto group animate-fade-in-up"
              >
                <Link href="/products">
                  {t('ctaPrimary')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform animate-fade-in-up" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4 h-auto animate-fade-in-up"
              >
                <Link href="/card-editor">
                  {t('ctaSecondary')}
                </Link>
              </Button>
            </div>

            {/* Statistiques ou badges */}
            <div className="flex flex-wrap gap-6 pt-4 animate-fade-in-up">
              <div className="flex items-center gap-2 text-white/80 animate-fade-in-up">
                <div className="w-2 h-2 bg-secondary-400 rounded-full animate-fade-in-up" />
                <span className="text-sm font-medium animate-fade-in-up">+500 entreprises</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 animate-fade-in-up">
                <div className="w-2 h-2 bg-secondary-400 rounded-full animate-fade-in-up" />
                <span className="text-sm font-medium animate-fade-in-up">Livraison rapide</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 animate-fade-in-up">
                <div className="w-2 h-2 bg-secondary-400 rounded-full animate-fade-in-up" />
                <span className="text-sm font-medium animate-fade-in-up">Support 24/7</span>
              </div>
            </div>
          </div>

          {/* Visuel - Mockup des cartes */}
          <div
            style={{ y }}
            className="relative lg:ml-8 animate-fade-in-up"
          >
            <div className="relative animate-fade-in-up">
              {/* Carte principale */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 mx-auto max-w-sm animate-fade-in-up">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white animate-fade-in-up">
                  <div className="flex items-center justify-between mb-4 animate-fade-in-up">
                    <h3 className="font-bold text-lg animate-fade-in-up">Xarala Solutions</h3>
                    <CreditCard className="h-6 w-6 animate-fade-in-up" />
                  </div>
                  <div className="space-y-2 animate-fade-in-up">
                    <div className="h-4 bg-white/20 rounded w-3/4 animate-fade-in-up" />
                    <div className="h-4 bg-white/20 rounded w-1/2 animate-fade-in-up" />
                    <div className="h-4 bg-white/20 rounded w-2/3 animate-fade-in-up" />
                  </div>
                  <div className="mt-4 flex justify-between items-center animate-fade-in-up">
                    <div className="text-sm opacity-80 animate-fade-in-up">PVC Premium</div>
                    <div className="text-sm font-mono animate-fade-in-up">•••• 1234</div>
                  </div>
                </div>
              </div>

              {/* Carte NFC */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 max-w-xs z-20 animate-fade-in-up">
                <div className="flex items-center gap-3 animate-fade-in-up">
                  <div className="w-12 h-8 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded flex items-center justify-center animate-fade-in-up">
                    <Smartphone className="h-5 w-5 text-white animate-fade-in-up" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 animate-fade-in-up">NFC</div>
                    <div className="text-xs text-gray-500 animate-fade-in-up">Tap to connect</div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 z-20 animate-fade-in-up">
                <div className="flex items-center gap-3 animate-fade-in-up">
                  <div className="w-12 h-12 bg-gray-900 rounded flex items-center justify-center animate-fade-in-up">
                    <QrCode className="h-6 w-6 text-white animate-fade-in-up" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 animate-fade-in-up">QR Code</div>
                    <div className="text-xs text-gray-500 animate-fade-in-up">Scan me</div>
                  </div>
                </div>
              </div>

              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in-up">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center animate-fade-in-up">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-fade-in-up" />
        </div>
      </div>
    </section>
  )
}
