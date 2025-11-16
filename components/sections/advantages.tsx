'use client'

import React, { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useInView } from 'framer-motion'
import { 
  Truck, 
  Shield, 
  MessageCircle, 
  Award, 
  Clock, 
  Users, 
  Zap, 
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react'

/**
 * Section des avantages ultra-moderne 2025
 * Design avec Bento Grid asymétrique et micro-animations
 */
export default function Advantages() {
  const t = useTranslations('advantages')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const advantages = [
    {
      id: 1,
      icon: Truck,
      title: 'Livraison rapide',
      description: 'Livraison à Dakar en 24-48h, partout au Sénégal en 3-5 jours',
      stats: '24-48h',
      gradient: 'from-blue-500 to-cyan-500',
      size: 'medium',
      position: 'top-left'
    },
    {
      id: 2,
      icon: Shield,
      title: 'Paiement sécurisé',
      description: 'Wave, Orange Money, Free Money et paiement à la livraison',
      stats: '100%',
      gradient: 'from-green-500 to-emerald-500',
      size: 'large',
      position: 'top-right'
    },
    {
      id: 3,
      icon: MessageCircle,
      title: 'Support réactif',
      description: 'Notre équipe vous accompagne du lundi au samedi',
      stats: '6j/7',
      gradient: 'from-purple-500 to-pink-500',
      size: 'medium',
      position: 'bottom-left'
    },
    {
      id: 4,
      icon: Award,
      title: 'Qualité certifiée',
      description: 'Produits authentiques avec garantie constructeur',
      stats: '5★',
      gradient: 'from-orange-500 to-red-500',
      size: 'large',
      position: 'bottom-right'
    }
  ]

  const stats = [
    { label: 'Clients satisfaits', value: '500+', icon: Users },
    { label: 'Livraisons/jour', value: '50+', icon: Truck },
    { label: 'Taux de satisfaction', value: '98%', icon: TrendingUp },
    { label: 'Temps de réponse', value: '<2h', icon: Clock }
  ]

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden animate-fade-in-up">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 animate-fade-in-up" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-float animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
      
      <div className="container mx-auto px-6 relative z-10 animate-fade-in-up">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 shadow-lg mb-6 animate-fade-in-up">
            <Star className="w-5 h-5 text-yellow-400 animate-fade-in-up" />
            <span className="text-sm font-semibold text-white animate-fade-in-up">Pourquoi nous choisir</span>
          </div>
          
          <h2 className="text-6xl font-black mb-6 text-white animate-fade-in-up">
            Nos avantages
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Des avantages concrets pour votre entreprise au Sénégal
          </p>
        </div>

        {/* Stats Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-fade-in-up">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/10 transition-all group animate-fade-in-up"
            >
              <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:text-blue-300 transition-colors animate-fade-in-up" />
              <div className="text-3xl font-black text-white mb-2 animate-fade-in-up">
                {stat.value}
              </div>
              <div className="text-blue-200 text-sm font-medium animate-fade-in-up">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bento Grid pour les avantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto animate-fade-in-up">
          {advantages.map((advantage, index) => (
            <div
              key={advantage.id}
              className={cn(
                "group relative p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500",
                advantage.size === 'large' ? 'md:col-span-1' : '',
                "transform-gpu"
              )}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Gradient Border Effect */}
              <div className={cn(
                "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10",
                `bg-gradient-to-r ${advantage.gradient}`
              )} />
              
              {/* Icon avec gradient et animation */}
              <div
                className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg",
                  `bg-gradient-to-br ${advantage.gradient}`
                )}
              >
                <advantage.icon className="w-10 h-10 text-white animate-fade-in-up" />
              </div>
              
              {/* Stats Badge */}
              <div
                className={cn(
                  "absolute top-6 right-6 px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg",
                  `bg-gradient-to-r ${advantage.gradient}`
                )}
              >
                {advantage.stats}
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-100 transition-colors animate-fade-in-up">
                {advantage.title}
              </h3>
              
              <p className="text-blue-100 leading-relaxed mb-6 animate-fade-in-up">
                {advantage.description}
              </p>
              
              {/* Check Icon */}
              <div className="flex items-center gap-2 text-green-400 animate-fade-in-up">
                <CheckCircle className="w-5 h-5 animate-fade-in-up" />
                <span className="text-sm font-medium animate-fade-in-up">Garantie qualité</span>
              </div>
              
              {/* Glow Effect */}
              <div className={cn(
                "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10",
                `bg-gradient-to-r ${advantage.gradient} blur-xl`
              )} />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all group animate-fade-in-up">
            <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform animate-fade-in-up" />
            <span>Découvrir nos services</span>
            <div>→</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper function pour les classes conditionnelles
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
