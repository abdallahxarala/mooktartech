'use client'

import React from 'react'
import Image from 'next/image'
import { CardData } from '@/lib/store/card-editor-store'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'

interface MinimalThemeProps {
  card: CardData
}

export function MinimalTheme({ card }: MinimalThemeProps) {
  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ') || 'Votre nom'

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec couverture */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {card.coverPhoto && (
          <Image
            src={card.coverPhoto}
            alt="Couverture"
            fill
            className="object-cover"
          />
        )}
        
        {/* Logo entreprise */}
        {card.logo && (
          <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-xl shadow-lg p-2">
            <div className="relative w-full h-full">
              <Image
                src={card.logo}
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>

      {/* Photo de profil */}
      <div className="relative px-6 -mt-20 mb-4">
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gray-100 overflow-hidden">
          {card.profilePhoto ? (
            <div className="relative w-full h-full">
              <Image
                src={card.profilePhoto}
                alt="Profil"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
              👤
            </div>
          )}
        </div>
      </div>

      {/* Informations */}
      <div className="px-6 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {fullName}
        </h1>
        
        {card.title && (
          <p className="text-lg text-gray-600 mb-1">
            {card.title}
          </p>
        )}
        
        {card.company && (
          <p className="text-gray-500 mb-3">
            {card.company}
          </p>
        )}
        
        {card.location && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{card.location}</span>
          </div>
        )}
        
        {card.bio && (
          <p className="text-gray-700 leading-relaxed mb-6">
            {card.bio}
          </p>
        )}

        {/* Contact rapide */}
        <div className="flex flex-wrap gap-3 mb-8">
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          )}
          
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Appeler</span>
            </a>
          )}
          
          {card.website && (
            <a
              href={card.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Site web</span>
            </a>
          )}
        </div>

        {/* Liens sociaux - AVEC VÉRIFICATION */}
        {card.socialLinks && card.socialLinks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Réseaux sociaux
            </h3>
            <div className="flex flex-wrap gap-3">
              {card.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  title={link.label}
                >
                  <span className="text-xl">{link.icon}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Boutons d'action - AVEC VÉRIFICATION */}
        {card.actionButtons && card.actionButtons.length > 0 && (
          <div className="space-y-3">
            {card.actionButtons.map((button) => (
              <a
                key={button.id}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 bg-black text-white text-center font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                <span className="mr-2">{button.icon}</span>
                {button.label}
              </a>
            ))}
          </div>
        )}

        {/* Stats - AVEC VÉRIFICATION */}
        {card.showStats && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {card.views || 0}
                </div>
                <div className="text-xs text-gray-500">Vues</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {card.clicks || 0}
                </div>
                <div className="text-xs text-gray-500">Clics</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
