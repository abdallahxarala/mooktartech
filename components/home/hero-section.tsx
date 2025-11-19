'use client'

import React from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'

export function HeroSection() {
  const params = useParams()
  const pathname = usePathname()
  
  // Détecter le contexte multitenant
  const locale = (params?.locale as string) || 'fr'
  const slug = params?.slug as string | undefined
  const isMultitenant = pathname?.includes('/org/') && slug
  const basePath = isMultitenant ? `/${locale}/org/${slug}` : `/${locale}`
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background ultra-subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-white to-amber-50/20" />
      
      {/* Grille subtile */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Blob animé très subtil */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left content - 7 colonnes */}
          <div className="lg:col-span-7 space-y-10">
            {/* Badge discret */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-orange-900">
                Solutions professionnelles
              </span>
            </div>

            {/* Titre géant avec espacement généreux */}
            <h1 className="text-6xl lg:text-8xl font-black leading-[0.95] tracking-tight">
              <span className="block text-gray-900 mb-3">
                Cartes
              </span>
              <span className="block text-gray-900 mb-3">
                professionnelles
              </span>
              <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent">
                nouvelle ère
              </span>
            </h1>

            {/* Description épurée */}
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-xl font-light">
              Solutions d'identification modernes pour entreprises sénégalaises. 
              <span className="text-gray-900 font-medium"> Cartes PVC, NFC et impression professionnelle.</span>
            </p>

            {/* CTA simple et impactant */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href={`${basePath}/shop`}
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-orange-500 text-white font-semibold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02]"
              >
                <span className="text-lg">Explorer nos produits</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>

              <Link
                href={`${basePath}/nfc-editor`}
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-gray-900 font-semibold rounded-2xl border-2 border-gray-200 hover:border-orange-500 transition-all hover:scale-[1.02]"
              >
                <span className="text-lg">Créer une carte</span>
                <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:animate-ping" />
              </Link>
            </div>

            {/* Stats minimalistes */}
            <div className="flex gap-12 pt-8 border-t border-gray-100">
              <div className="space-y-1">
                <div className="text-5xl font-black text-orange-500">500+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Clients</div>
              </div>
              <div className="space-y-1">
                <div className="text-5xl font-black text-orange-500">24h</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Livraison</div>
              </div>
              <div className="space-y-1">
                <div className="text-5xl font-black text-orange-500">24/7</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Support</div>
              </div>
            </div>
          </div>

          {/* Right visual - 5 colonnes */}
          <div className="lg:col-span-5 relative">
            {/* Stack de cartes avec effet parallaxe */}
            <div className="relative h-[600px]">
              
              {/* Carte 1 - NFC Orange (arrière) */}
              <div className="absolute top-12 right-12 w-80 transform rotate-6 hover:rotate-12 transition-transform duration-500">
                <div className="relative aspect-[1.586/1] bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-black/5" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative h-full p-8 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl" />
                      <div className="text-xs font-bold">NFC</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">Amadou Diop</div>
                      <div className="text-sm opacity-90">CEO • Tech Startup</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte 2 - Badge Noir (centre) */}
              <div className="absolute top-32 left-8 w-80 transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
                <div className="relative aspect-[1.586/1] bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl" />
                  <div className="relative h-full p-8 flex flex-col justify-between text-white">
                    <div>
                      <div className="text-xs text-gray-400 mb-2">BADGE EMPLOYÉ</div>
                      <div className="text-sm font-bold">ID #00789</div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl" />
                      <div className="text-right">
                        <div className="text-xs text-gray-400">ACCÈS</div>
                        <div className="text-lg font-bold">NIVEAU 4</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte 3 - Badge Bleu (avant) */}
              <div className="absolute top-52 right-4 w-72 transform rotate-3 hover:-rotate-3 transition-transform duration-500 z-20">
                <div className="relative aspect-[1.586/1] bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -skew-x-12" />
                  <div className="relative h-full p-6 flex flex-col justify-between text-white">
                    <div>
                      <div className="text-xs opacity-75">ACCESS CARD</div>
                      <div className="text-3xl font-black mt-1">VIP</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl">
                        🔑
                      </div>
                      <div className="text-xs">
                        <div className="font-bold">Full Access</div>
                        <div className="opacity-75">Valid until 12/2025</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge discret "Made in Senegal" */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
                <span className="text-xl">🇸🇳</span>
                <span className="text-xs font-bold text-gray-700">Fabriqué au Sénégal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
