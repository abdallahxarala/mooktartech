'use client'

import React from 'react'
import Image from 'next/image'
import { CardData } from '@/lib/store/card-editor-store'
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react'

interface GlassmorphismThemeProps {
  card: CardData
}

export function GlassmorphismTheme({ card }: GlassmorphismThemeProps) {
  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ') || 'Votre nom'

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${card.accentColor}20 0%, #EC489920 50%, #8B5CF620 100%)`,
      }}
    >
      {/* Formes géométriques flottantes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-3xl rotate-45 blur-sm animate-float" />
      <div className="absolute top-32 right-20 w-24 h-24 bg-white/10 rounded-full blur-sm animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/10 rounded-2xl rotate-12 blur-sm animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-32 right-10 w-28 h-28 bg-white/10 rounded-full blur-sm animate-float" style={{ animationDelay: '3s' }} />

      {/* Contenu principal */}
      <div className="relative z-10 px-6 py-8">
        {/* Header avec couverture */}
        <div className="relative mb-8">
          <div className="h-32 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
            {card.coverPhoto && (
              <Image
                src={card.coverPhoto}
                alt="Couverture"
                fill
                className="object-cover"
              />
            )}
          </div>
          
          {/* Logo flottant */}
          {card.logo && (
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-2">
              <Image src={card.logo} alt="Logo" fill className="object-contain p-1" />
            </div>
          )}
        </div>

        {/* Photo profil avec effet glassmorphism */}
        <div className="flex justify-center mb-6">
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-full border border-white/30" />
            <div className="relative w-full h-full rounded-full overflow-hidden">
              {card.profilePhoto ? (
                <Image src={card.profilePhoto} alt="Profil" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-white/10 backdrop-blur-xl">👤</div>
              )}
            </div>
          </div>
        </div>

        {/* Card principale avec glassmorphism */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-6">
          <div className="text-center text-white mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {fullName}
            </h1>
            {card.title && (
              <p className="text-lg mb-1 text-white/90">
                {card.title}
              </p>
            )}
            {card.company && (
              <p className="text-white/80 mb-3">
                {card.company}
              </p>
            )}
            {card.location && (
              <div className="flex items-center justify-center gap-2 text-sm text-white/70 mb-4">
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

          {/* Contact avec glassmorphism */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {card.email && (
              <a
                href={`mailto:${card.email}`}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 text-center hover:bg-white/20 transition-all"
              >
                <Mail className="w-5 h-5 text-white mx-auto mb-1" />
                <span className="text-xs text-white/80">Email</span>
              </a>
            )}
            {card.phone && (
              <a
                href={`tel:${card.phone}`}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 text-center hover:bg-white/20 transition-all"
              >
                <Phone className="w-5 h-5 text-white mx-auto mb-1" />
                <span className="text-xs text-white/80">Appeler</span>
              </a>
            )}
            {card.website && (
              <a
                href={card.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 text-center hover:bg-white/20 transition-all"
              >
                <Globe className="w-5 h-5 text-white mx-auto mb-1" />
                <span className="text-xs text-white/80">Site</span>
              </a>
            )}
          </div>

        {/* Liens sociaux - AVEC VÉRIFICATION */}
        {card.socialLinks && card.socialLinks.length > 0 && (
          <div className="flex justify-center gap-3 mb-6">
            {card.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
              >
                <span className="text-xl">{link.icon}</span>
              </a>
            ))}
          </div>
        )}
        </div>

        {/* Boutons d'action - AVEC VÉRIFICATION */}
        {card.actionButtons && card.actionButtons.length > 0 && (
          <div className="space-y-3 mb-6">
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
                <ExternalLink className="w-4 h-4 inline ml-2" />
              </a>
            ))}
          </div>
        )}

        {/* Stats avec glassmorphism */}
        {card.showStats && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{card.views}</div>
                <div className="text-xs text-white/70">Vues</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{card.clicks}</div>
                <div className="text-xs text-white/70">Clics</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
