'use client'

import React from 'react'
import { User, Mail, Phone, MapPin, Briefcase, Globe } from 'lucide-react'

interface TemplateProps {
  data: {
    firstName: string
    lastName: string
    title: string
    company: string
    email: string
    phone: string
    website: string
    location: string
    avatar?: string
    logo?: string
    backgroundImage?: string
  }
}

// TEMPLATE 1: Classic Modern (Layout centré, avatar rond)
export function ClassicTemplate({ data }: TemplateProps) {
  return (
    <div className="relative w-full h-full bg-white">
      {/* Header avec gradient */}
      <div className="relative h-48 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
        {data.backgroundImage && (
          <img src={data.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
        )}
        
        {/* Avatar centré en bas */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="w-28 h-28 rounded-full bg-white shadow-2xl border-4 border-white overflow-hidden">
            {data.avatar ? (
              <img src={data.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-3xl font-black">
                {data.firstName?.[0]}{data.lastName?.[0]}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 px-6 pb-8">
        {/* Name */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-black text-gray-900">
            {data.firstName} {data.lastName}
          </h1>
        </div>

        {/* Title */}
        {data.title && (
          <div className="text-center mb-6">
            <p className="text-gray-600 font-semibold">{data.title}</p>
            {data.company && <p className="text-gray-500 text-sm">{data.company}</p>}
          </div>
        )}

        {/* Contact Cards */}
        <div className="space-y-3">
          {data.email && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700 font-medium">{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <Phone className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700 font-medium">{data.phone}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <Globe className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-700 font-medium truncate">{data.website}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <MapPin className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-700 font-medium">{data.location}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <button className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-black rounded-2xl">
          Enregistrer le contact
        </button>
      </div>
    </div>
  )
}

// TEMPLATE 2: Minimalist (Layout asymétrique, avatar carré à gauche)
export function MinimalistTemplate({ data }: TemplateProps) {
  return (
    <div className="relative w-full h-full bg-gray-50">
      {/* Sidebar gauche */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 to-cyan-500" />

      <div className="p-8">
        {/* Header horizontal */}
        <div className="flex items-start gap-6 mb-8">
          {/* Avatar carré */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 overflow-hidden flex-shrink-0 shadow-xl">
            {data.avatar ? (
              <img src={data.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-black">
                {data.firstName?.[0]}{data.lastName?.[0]}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-2">
            <h1 className="text-2xl font-black text-gray-900 mb-1">
              {data.firstName} {data.lastName}
            </h1>
            {data.title && (
              <p className="text-gray-600 font-semibold text-sm mb-1">{data.title}</p>
            )}
            {data.company && (
              <p className="text-gray-500 text-sm">{data.company}</p>
            )}
          </div>

          {/* Logo en haut à droite */}
          {data.logo && (
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg p-2">
              <img src={data.logo} alt="" className="w-full h-full object-contain" />
            </div>
          )}
        </div>

        {/* Contact List - Style minimaliste */}
        <div className="space-y-4">
          {data.email && (
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <Mail className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Email</div>
                <div className="text-sm text-gray-900 font-medium">{data.email}</div>
              </div>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <Phone className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Téléphone</div>
                <div className="text-sm text-gray-900 font-medium">{data.phone}</div>
              </div>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <Globe className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Site web</div>
                <div className="text-sm text-gray-900 font-medium truncate">{data.website}</div>
              </div>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-4 pb-4">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Localisation</div>
                <div className="text-sm text-gray-900 font-medium">{data.location}</div>
              </div>
            </div>
          )}
        </div>

        {/* CTA simple */}
        <button className="w-full mt-8 py-3 border-2 border-blue-500 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
          Ajouter aux contacts
        </button>
      </div>
    </div>
  )
}

// TEMPLATE 3: Corporate (Layout avec sidebar, très professionnel)
export function CorporateTemplate({ data }: TemplateProps) {
  return (
    <div className="relative w-full h-full bg-white flex">
      {/* Sidebar gauche colorée */}
      <div className="w-1/3 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex flex-col items-center justify-between">
        {/* Logo en haut */}
        {data.logo && (
          <div className="w-20 h-20 bg-white rounded-2xl p-3 shadow-xl">
            <img src={data.logo} alt="" className="w-full h-full object-contain" />
          </div>
        )}

        {/* Avatar centré */}
        <div className="flex-1 flex items-center">
          <div className="w-28 h-28 rounded-2xl bg-white shadow-2xl overflow-hidden">
            {data.avatar ? (
              <img src={data.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-2xl font-black">
                {data.firstName?.[0]}{data.lastName?.[0]}
              </div>
            )}
          </div>
        </div>

        {/* Pattern décoratif */}
        <div className="text-white/10 text-center">
          <div className="text-6xl font-black">★</div>
        </div>
      </div>

      {/* Contenu droit */}
      <div className="flex-1 p-8 flex flex-col justify-center">
        {/* Name & Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {data.firstName}<br />{data.lastName}
          </h1>
          {data.title && (
            <p className="text-gray-600 font-bold text-sm uppercase tracking-wide mb-1">{data.title}</p>
          )}
          {data.company && (
            <p className="text-gray-500 text-sm font-semibold">{data.company}</p>
          )}
        </div>

        {/* Contact - Style corporate */}
        <div className="space-y-3">
          {data.email && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700 font-medium">{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-700 font-medium">{data.phone}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-700 font-medium truncate">{data.website}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-gray-700 font-medium">{data.location}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <button className="w-full mt-8 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-gray-800 transition-colors">
          SAUVEGARDER
        </button>
      </div>
    </div>
  )
}

// TEMPLATE 4: Creative (Layout carte, très moderne et coloré)
export function CreativeTemplate({ data }: TemplateProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-1">
      <div className="w-full h-full bg-white rounded-3xl overflow-hidden">
        {/* Header avec pattern */}
        <div className="relative h-32 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
          {/* Circles décoratifs */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-300 rounded-full opacity-50" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-300 rounded-full opacity-50" />
          
          {/* Logo floating */}
          {data.logo && (
            <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl shadow-xl p-2">
              <img src={data.logo} alt="" className="w-full h-full object-contain" />
            </div>
          )}
        </div>

        {/* Avatar overlap */}
        <div className="relative -mt-16 px-6">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 shadow-2xl overflow-hidden border-4 border-white">
            {data.avatar ? (
              <img src={data.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-black">
                {data.firstName?.[0]}{data.lastName?.[0]}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 mt-4">
          {/* Name */}
          <h1 className="text-2xl font-black text-gray-900 mb-1">
            {data.firstName} {data.lastName}
          </h1>
          
          {/* Title with gradient */}
          {data.title && (
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold mb-1">
              {data.title}
            </p>
          )}
          {data.company && (
            <p className="text-gray-500 text-sm font-semibold mb-6">{data.company}</p>
          )}

          {/* Contact - Grid style */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {data.email && (
              <div className="col-span-2 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-900 font-bold">EMAIL</span>
                </div>
                <div className="text-xs text-gray-700 font-medium mt-1 truncate">{data.email}</div>
              </div>
            )}
            {data.phone && (
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-900 font-bold">TEL</span>
                </div>
                <div className="text-xs text-gray-700 font-medium mt-1">{data.phone}</div>
              </div>
            )}
            {data.website && (
              <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-purple-900 font-bold">WEB</span>
                </div>
                <div className="text-xs text-gray-700 font-medium mt-1 truncate">{data.website}</div>
              </div>
            )}
            {data.location && (
              <div className="col-span-2 p-3 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl border-2 border-orange-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-orange-900 font-bold">LIEU</span>
                </div>
                <div className="text-xs text-gray-700 font-medium mt-1">{data.location}</div>
              </div>
            )}
          </div>

          {/* CTA gradient */}
          <button className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white font-black rounded-2xl shadow-lg">
            ✨ Sauvegarder
          </button>
        </div>
      </div>
    </div>
  )
}

