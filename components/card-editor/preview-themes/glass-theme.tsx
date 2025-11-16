'use client'

import React from 'react'
import Image from 'next/image'
import { CardData } from '@/lib/store/card-editor-store'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'

interface GlassThemeProps {
  card: CardData
}

export function GlassTheme({ card }: GlassThemeProps) {
  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ') || 'Votre nom'

  return (
    <div 
      className="min-h-screen relative"
      style={{
        background: `radial-gradient(circle at top right, ${card.accentColor || '#F97316'}40 0%, transparent 50%), 
                     radial-gradient(circle at bottom left, #8B5CF640 0%, transparent 50%),
                     linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
      }}
    >
      {/* Couverture avec glassmorphism */}
      <div className="relative h-56 overflow-hidden">
        {card.coverPhoto ? (
          <div className="relative w-full h-full">
            <Image
              src={card.coverPhoto}
              alt="Couverture"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl" />
        )}
      </div>

      {/* Contenu avec cards glassmorphism */}
      <div className="px-6 -mt-24 pb-8">
        {/* Photo profil + Logo */}
        <div className="flex items-end justify-between mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 rounded-3xl blur-2xl transform scale-110" />
            <div className="relative w-32 h-32 rounded-3xl border-2 border-white/30 overflow-hidden bg-white/20 backdrop-blur-2xl">
              {card.profilePhoto ? (
                <Image src={card.profilePhoto} alt="Profil" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">👤</div>
              )}
            </div>
          </div>

          {card.logo && (
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 p-2">
              <div className="relative w-full h-full">
                <Image src={card.logo} alt="Logo" fill className="object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Card principale avec infos */}
        <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 mb-4 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {fullName}
          </h1>
          
          {card.title && (
            <p className="text-lg text-white/90 mb-1">
              {card.title}
            </p>
          )}
          
          {card.company && (
            <p className="text-white/80 mb-3">
              {card.company}
            </p>
          )}
          
          {card.location && (
            <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{card.location}</span>
            </div>
          )}
          
          {card.bio && (
            <p className="text-white/90 leading-relaxed">
              {card.bio}
            </p>
          )}
        </div>

        {/* Contact rapide glassmorphism */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-4 hover:bg-white/25 transition-all"
            >
              <Mail className="w-5 h-5 text-white mb-2" />
              <p className="text-xs text-white/70">Email</p>
            </a>
          )}
          
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-4 hover:bg-white/25 transition-all"
            >
              <Phone className="w-5 h-5 text-white mb-2" />
              <p className="text-xs text-white/70">Appeler</p>
            </a>
          )}
          
          {card.website && (
            <a
              href={card.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-4 hover:bg-white/25 transition-all col-span-2"
            >
              <Globe className="w-5 h-5 text-white mb-2" />
              <p className="text-xs text-white/70">Site web</p>
            </a>
          )}
        </div>

        {/* Réseaux sociaux glassmorphism */}
        {card.socialLinks && card.socialLinks.length > 0 && (
          <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-6 mb-4">
            <h3 className="text-sm font-semibold text-white mb-4">
              Réseaux sociaux
            </h3>
            <div className="flex flex-wrap gap-3">
              {card.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
                >
                  <span className="text-2xl">{link.icon}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Boutons d'action glassmorphism */}
        {card.actionButtons && card.actionButtons.length > 0 && (
          <div className="space-y-3 mb-4">
            {card.actionButtons.map((button) => (
              <a
                key={button.id}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-center font-semibold rounded-2xl hover:bg-white/30 transition-all hover:scale-105 shadow-lg"
              >
                <span className="mr-2">{button.icon}</span>
                {button.label}
              </a>
            ))}
          </div>
        )}

        {/* Stats glassmorphism */}
        {card.showStats && (
          <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-6">
            <div className="flex justify-around text-center">
              <div>
                <div className="text-3xl font-bold text-white">
                  {card.views || 0}
                </div>
                <div className="text-xs text-white/70 mt-1">Vues</div>
              </div>
              <div className="w-px bg-white/30" />
              <div>
                <div className="text-3xl font-bold text-white">
                  {card.clicks || 0}
                </div>
                <div className="text-xs text-white/70 mt-1">Clics</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
