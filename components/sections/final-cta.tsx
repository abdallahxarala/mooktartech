'use client'

import { useTranslations } from '@/lib/utils/next-intl-fallback'
import Link from 'next/link'
import { ArrowRight, Smartphone, CreditCard, QrCode, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Section Call-to-Action finale pour Xarala Solutions
 * Section d'appel à l'action avec mockup de téléphone et design moderne
 */

export default function FinalCTA() {
  const t = useTranslations('finalCta')

  return (
    <section className="relative py-20 overflow-hidden animate-fade-in-up">
      {/* Fond avec dégradé vibrant */}
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
                id="cta-grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#cta-grid)" />
          </svg>
        </div>
        
        {/* Formes géométriques flottantes */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/15 rounded-full blur-lg animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10 animate-fade-in-up">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in-up">
            
            {/* Contenu texte */}
            <div className="text-white text-center lg:text-left animate-fade-in-up">
              {/* Titre principal */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up">
                {t('title')}
              </h2>

              {/* Description */}
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 animate-fade-in-up">
                {t('description')}
              </p>

              {/* Boutons CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-white/90 text-lg px-8 py-4 h-auto group shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
                >
                  <Link href="/card-editor">
                    {t('primaryButton')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform animate-fade-in-up" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                >
                  <Link href="/products">
                    {t('secondaryButton')}
                  </Link>
                </Button>
              </div>

              {/* Badges de confiance */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8 animate-fade-in-up">
                <div className="flex items-center gap-2 text-white/80 animate-fade-in-up">
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-fade-in-up" />
                  <span className="text-sm font-medium animate-fade-in-up">Gratuit</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 animate-fade-in-up">
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-fade-in-up" />
                  <span className="text-sm font-medium animate-fade-in-up">Sans engagement</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 animate-fade-in-up">
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-fade-in-up" />
                  <span className="text-sm font-medium animate-fade-in-up">5 minutes</span>
                </div>
              </div>
            </div>

            {/* Mockup de téléphone */}
            <div className="relative flex justify-center lg:justify-end animate-fade-in-up">
              <div className="relative animate-fade-in-up">
                {/* Téléphone principal */}
                <div className="relative w-80 h-96 bg-gray-900 rounded-3xl shadow-2xl p-2 animate-fade-in-up">
                  {/* Écran du téléphone */}
                  <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative animate-fade-in-up">
                    {/* Barre de statut */}
                    <div className="h-8 bg-gray-100 flex items-center justify-between px-4 text-xs text-gray-600 animate-fade-in-up">
                      <span>9:41</span>
                      <div className="flex items-center gap-1 animate-fade-in-up">
                        <div className="w-4 h-2 bg-gray-400 rounded-sm animate-fade-in-up" />
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-fade-in-up" />
                      </div>
                    </div>

                    {/* Contenu de la carte virtuelle */}
                    <div className="p-6 h-full flex flex-col animate-fade-in-up">
                      {/* En-tête de la carte */}
                      <div className="text-center mb-6 animate-fade-in-up">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-fade-in-up">
                          <CreditCard className="w-8 h-8 text-white animate-fade-in-up" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 animate-fade-in-up">Xarala Solutions</h3>
                        <p className="text-sm text-gray-600 animate-fade-in-up">Carte virtuelle</p>
                      </div>

                      {/* Informations de contact */}
                      <div className="space-y-3 mb-6 animate-fade-in-up">
                        <div className="flex items-center gap-3 animate-fade-in-up">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center animate-fade-in-up">
                            <span className="text-xs font-semibold text-gray-600 animate-fade-in-up">👤</span>
                          </div>
                          <div>
                            <div className="h-3 bg-gray-200 rounded w-24 mb-1 animate-fade-in-up" />
                            <div className="h-2 bg-gray-100 rounded w-32 animate-fade-in-up" />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 animate-fade-in-up">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center animate-fade-in-up">
                            <span className="text-xs font-semibold text-gray-600 animate-fade-in-up">📧</span>
                          </div>
                          <div>
                            <div className="h-3 bg-gray-200 rounded w-32 mb-1 animate-fade-in-up" />
                            <div className="h-2 bg-gray-100 rounded w-28 animate-fade-in-up" />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 animate-fade-in-up">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center animate-fade-in-up">
                            <span className="text-xs font-semibold text-gray-600 animate-fade-in-up">📱</span>
                          </div>
                          <div>
                            <div className="h-3 bg-gray-200 rounded w-20 mb-1 animate-fade-in-up" />
                            <div className="h-2 bg-gray-100 rounded w-24 animate-fade-in-up" />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto space-y-2 animate-fade-in-up">
                        <div className="flex gap-2 animate-fade-in-up">
                          <div className="flex-1 h-8 bg-primary-500 rounded-lg flex items-center justify-center animate-fade-in-up">
                            <Share2 className="w-4 h-4 text-white animate-fade-in-up" />
                          </div>
                          <div className="flex-1 h-8 bg-gray-200 rounded-lg flex items-center justify-center animate-fade-in-up">
                            <QrCode className="w-4 h-4 text-gray-600 animate-fade-in-up" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Éléments flottants */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center animate-fade-in-up">
                  <Smartphone className="w-6 h-6 text-primary-600 animate-fade-in-up" />
                </div>

                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary-500 rounded-full shadow-lg flex items-center justify-center animate-fade-in-up">
                  <QrCode className="w-8 h-8 text-white animate-fade-in-up" />
                </div>

                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
