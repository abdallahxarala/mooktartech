'use client'

import React from 'react'
import Image from 'next/image'
import { CardData } from '@/lib/store/card-editor-store'

interface GradientThemeProps {
  card: CardData
}

export function GradientTheme({ card }: GradientThemeProps) {
  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ') || 'Votre nom'

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${card.accentColor || '#F97316'} 0%, #EC4899 50%, #8B5CF6 100%)`,
      }}
    >
      {/* Formes décoratives animées */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Contenu */}
      <div className="relative z-10 px-6 py-12">
        {/* Logo */}
        {card.logo && (
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl p-3 relative">
              <Image src={card.logo} alt="Logo" fill className="object-contain p-1" />
            </div>
          </div>
        )}

        {/* Photo profil */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-full blur-xl" />
            <div className="relative w-full h-full rounded-full border-4 border-white/30 overflow-hidden bg-white/20 backdrop-blur-xl">
              {card.profilePhoto ? (
                <Image src={card.profilePhoto} alt="Profil" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">👤</div>
              )}
            </div>
          </div>
        </div>

        {/* Infos */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
            {fullName}
          </h1>
          {card.title && (
            <p className="text-xl mb-1 text-white/90">
              {card.title}
            </p>
          )}
          {card.company && (
            <p className="text-white/80">
              {card.company}
            </p>
          )}
          {card.bio && (
            <p className="mt-4 text-white/90 max-w-md mx-auto">
              {card.bio}
            </p>
          )}
        </div>

        {/* Liens sociaux - AVEC VÉRIFICATION */}
        {card.socialLinks && card.socialLinks.length > 0 && (
          <div className="flex justify-center gap-4 mb-8">
            {card.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
              >
                <span className="text-2xl">{link.icon}</span>
              </a>
            ))}
          </div>
        )}

        {/* Boutons d'action - AVEC VÉRIFICATION */}
        {card.actionButtons && card.actionButtons.length > 0 && (
          <div className="max-w-md mx-auto space-y-3">
            {card.actionButtons.map((button) => (
              <a
                key={button.id}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-center font-semibold rounded-2xl hover:bg-white/30 transition-all hover:scale-105"
              >
                <span className="mr-2">{button.icon}</span>
                {button.label}
              </a>
            ))}
          </div>
        )}

        {/* Stats avec glassmorphism */}
        {card.showStats && (
          <div className="mt-12 flex justify-center gap-8">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-6 py-4 text-center">
              <div className="text-2xl font-bold text-white">{card.views}</div>
              <div className="text-sm text-white/80">Vues</div>
            </div>
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-6 py-4 text-center">
              <div className="text-2xl font-bold text-white">{card.clicks}</div>
              <div className="text-sm text-white/80">Clics</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
