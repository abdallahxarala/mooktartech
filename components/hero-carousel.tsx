'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Phone, ArrowRight, Sparkles, Zap, Award, Package } from 'lucide-react'

interface Slide {
  id: number
  title: string
  subtitle: string
  description: string
  cta: {
    text: string
    href: string
    icon: React.ReactNode
  }
  secondaryCta?: {
    text: string
    href: string
  }
  background: string
  gradient: string
  image?: string
  features?: string[]
}

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const slides: Slide[] = [
    {
      id: 1,
      title: "Créez vos badges professionnels",
      subtitle: "en 24 heures",
      description: "Imprimantes de cartes professionnelles avec formation et support technique inclus. Livraison express à Dakar.",
      cta: {
        text: "+221 77 539 81 39",
        href: "tel:+221775398139",
        icon: <Phone className="w-5 h-5" />
      },
      secondaryCta: {
        text: "Voir le catalogue",
        href: "/fr/products"
      },
      background: "from-orange-600 via-orange-500 to-amber-500",
      gradient: "from-orange-500/20 to-transparent",
      features: ["Livraison 24-48h", "Formation gratuite", "Support local"]
    },
    {
      id: 2,
      title: "Carte NFC virtuelle",
      subtitle: "100% gratuite",
      description: "Créez votre carte de visite digitale NFC en 2 minutes. Partagez vos contacts d'un simple tap ou scan QR code.",
      cta: {
        text: "Créer ma carte gratuite",
        href: "/fr/nfc-editor",
        icon: <Sparkles className="w-5 h-5" />
      },
      secondaryCta: {
        text: "En savoir plus",
        href: "/fr/nfc-editor"
      },
      background: "from-blue-600 via-indigo-600 to-purple-600",
      gradient: "from-blue-500/20 to-transparent",
      features: ["Création gratuite", "Sans application", "Partage illimité"]
    },
    {
      id: 3,
      title: "Éditeur de badges",
      subtitle: "en série gratuit",
      description: "Outil professionnel pour concevoir et imprimer vos badges en série. Import Excel/CSV, templates inclus.",
      cta: {
        text: "Accéder à l'éditeur",
        href: "/fr/badge-editor/pro",
        icon: <Zap className="w-5 h-5" />
      },
      secondaryCta: {
        text: "Voir la démo",
        href: "/fr/badge-editor/pro#demo"
      },
      background: "from-purple-600 via-pink-600 to-rose-600",
      gradient: "from-purple-500/20 to-transparent",
      features: ["Interface intuitive", "Import Excel/CSV", "100% gratuit"]
    },
    {
      id: 4,
      title: "Imprimantes professionnelles",
      subtitle: "dès 1.650.000 FCFA",
      description: "Entrust, Datacard, HiTi : les meilleures marques au meilleur prix. Garantie jusqu'à 36 mois.",
      cta: {
        text: "Voir les imprimantes",
        href: "/fr/products",
        icon: <Package className="w-5 h-5" />
      },
      secondaryCta: {
        text: "Demander un devis",
        href: "/fr/contact"
      },
      background: "from-emerald-600 via-teal-600 to-cyan-600",
      gradient: "from-emerald-500/20 to-transparent",
      features: ["+500 clients", "Garantie 36 mois", "Formation incluse"]
    }
  ]

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative w-full overflow-hidden pt-[60px]">
      {/* pt-[60px] = topbar (40px) + header (80px) - 60px overlap */}
      {/* Carousel Container */}
      <div className="relative h-[600px] md:h-[700px] lg:h-[800px]">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.background}`}>
              {/* Overlay Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '50px 50px'
                }} />
              </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />

              {/* Decorative Shapes */}
              <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
              <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />
            </div>

            {/* Content */}
            <div className="relative h-full">
              <div className="container mx-auto px-6 h-full">
                <div className="flex items-center h-full">
                  <div className="max-w-3xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold mb-8 border border-white/30">
                      <Sparkles className="w-4 h-4" />
                      <span>{slide.features?.[0] || "Nouveauté"}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
                      {slide.title}
                      <br />
                      <span className="text-white/90 inline-block mt-2">
                        {slide.subtitle}
                      </span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl">
                      {slide.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-4 mb-10">
                      {slide.features?.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                        >
                          <div className="w-2 h-2 rounded-full bg-white" />
                          <span className="text-white font-semibold text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={slide.cta.href}
                        className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-white text-gray-900 text-lg font-black rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
                      >
                        {slide.cta.icon}
                        <span>{slide.cta.text}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>

                      {slide.secondaryCta && (
                        <Link
                          href={slide.secondaryCta.href}
                          className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white text-lg font-bold rounded-2xl hover:bg-white/20 transition-all"
                        >
                          <span>{slide.secondaryCta.text}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all group"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all group"
          aria-label="Slide suivant"
        >
          <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-12 h-3 bg-white'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              } rounded-full`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-[6000ms] ease-linear"
            style={{
              width: isAutoPlaying ? '100%' : '0%',
              transition: isAutoPlaying ? 'width 6s linear' : 'none'
            }}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 hidden md:block">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-sm font-medium">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/60 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}

