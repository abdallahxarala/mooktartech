'use client'

import React from 'react'
import Image from 'next/image'
import { CardData } from '@/lib/store/card-editor-store'
import { Mail, Phone, MapPin, Globe, BarChart2 } from 'lucide-react'

interface BentoThemeProps {
  card: CardData
}

export function BentoTheme({ card }: BentoThemeProps) {
  const fullName = [card.firstName, card.lastName].filter(Boolean).join(' ') || 'Votre nom'

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Grid Bento Layout */}
      <div className="max-w-2xl mx-auto">
        {/* Row 1 : Profil + Logo */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Photo profil - Large */}
          <div className="col-span-2 bg-white rounded-3xl shadow-lg overflow-hidden relative h-48">
            {card.profilePhoto ? (
              <Image src={card.profilePhoto} alt="Profil" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                <span className="text-6xl">👤</span>
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-2xl font-bold drop-shadow-lg">{fullName}</h2>
            </div>
          </div>

          {/* Logo - Small */}
          {card.logo ? (
            <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image src={card.logo} alt="Logo" fill className="object-contain" />
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-lg flex items-center justify-center">
              <span className="text-4xl text-white">🏢</span>
            </div>
          )}
        </div>

        {/* Row 2 : Infos principales */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
          {card.title && (
            <p className="text-xl font-semibold text-gray-900 mb-1">
              {card.title}
            </p>
          )}
          {card.company && (
            <p className="text-gray-600 mb-3">
              {card.company}
            </p>
          )}
          {card.location && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <MapPin className="w-4 h-4" />
              <span>{card.location}</span>
            </div>
          )}
          {card.bio && (
            <p className="text-gray-700 leading-relaxed">
              {card.bio}
            </p>
          )}
        </div>

        {/* Row 3 : Contact Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {card.email}
              </p>
            </a>
          )}

          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Téléphone</p>
              <p className="text-sm font-medium text-gray-900">
                {card.phone}
              </p>
            </a>
          )}

          {card.website && (
            <a
              href={card.website}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Site web</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {card.website}
              </p>
            </a>
          )}
        </div>

        {/* Row 4 : Réseaux sociaux en grid */}
        {card.socialLinks && card.socialLinks.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Suivez-moi
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {card.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  title={link.label}
                >
                  <span className="text-3xl">{link.icon}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Row 5 : Boutons d'action */}
        {card.actionButtons && card.actionButtons.length > 0 && (
          <div className="grid gap-3 mb-4">
            {card.actionButtons.map((button, index) => (
              <a
                key={button.id}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all text-white font-semibold ${
                  index % 3 === 0 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                  index % 3 === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  'bg-gradient-to-r from-purple-500 to-purple-600'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">{button.icon}</span>
                  <span className="text-lg">{button.label}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Row 6 : Stats */}
        {card.showStats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.views || 0}
                  </p>
                  <p className="text-xs text-gray-500">Vues</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.clicks || 0}
                  </p>
                  <p className="text-xs text-gray-500">Clics</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}