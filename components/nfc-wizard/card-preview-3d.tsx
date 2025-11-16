'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { NFCProfile } from '@/lib/store/nfc-editor-store'
import { 
  Mail, Phone, Globe, MapPin, 
  Linkedin, Twitter, Instagram, Facebook,
  QrCode, Share2, Eye, Heart
} from 'lucide-react'

interface CardPreview3DProps {
  profile: NFCProfile
  isAnimating?: boolean
}

export function CardPreview3D({ profile, isAnimating = false }: CardPreview3DProps) {
  // Get template-specific styles (layout, colors, gradients)
  const getTemplateStyles = (template: NFCProfile['template'] = 'classic') => {
    const templates = {
      classic: {
        gradient: 'from-orange-500 via-pink-500 to-purple-600',
        primary: '#f97316',
        secondary: '#ec4899',
        layout: 'centered' as const,
      },
      minimalist: {
        gradient: 'from-blue-500 via-cyan-500 to-teal-500',
        primary: '#0ea5e9',
        secondary: '#06b6d4',
        layout: 'centered' as const,
      },
      corporate: {
        gradient: 'from-gray-800 via-gray-900 to-black',
        primary: '#1f2937',
        secondary: '#374151',
        layout: 'sidebar' as const,
      },
      creative: {
        gradient: 'from-purple-600 via-pink-500 to-orange-500',
        primary: '#9333ea',
        secondary: '#ec4899',
        layout: 'creative' as const,
      },
    }
    return templates[template] || templates.classic
  }

  // Get theme colors (fallback for older profiles)
  const getThemeColors = (theme: NFCProfile['theme']) => {
    const themes = {
      sunset: { primary: '#f97316', secondary: '#ec4899', gradient: 'from-orange-500 to-pink-500' },
      ocean: { primary: '#0ea5e9', secondary: '#06b6d4', gradient: 'from-blue-500 to-cyan-500' },
      forest: { primary: '#10b981', secondary: '#14b8a6', gradient: 'from-green-500 to-teal-500' },
      midnight: { primary: '#6366f1', secondary: '#8b5cf6', gradient: 'from-indigo-500 to-purple-500' },
      royal: { primary: '#8b5cf6', secondary: '#ec4899', gradient: 'from-purple-500 to-pink-500' },
      dawn: { primary: '#f59e0b', secondary: '#ec4899', gradient: 'from-amber-500 to-pink-500' },
      custom: { primary: profile.primaryColor, secondary: profile.secondaryColor, gradient: 'from-orange-500 to-pink-500' },
    }
    return themes[theme] || themes.sunset
  }

  // Use template styles if available, otherwise fallback to theme
  // Memoize to prevent unnecessary recalculations, but react to template/theme changes
  const templateStyles = useMemo(() => getTemplateStyles(profile.template), [profile.template])
  const themeColors = useMemo(() => getThemeColors(profile.theme), [profile.theme, profile.primaryColor, profile.secondaryColor])
  const activeGradient = useMemo(() => 
    profile.template ? templateStyles.gradient : themeColors.gradient,
    [profile.template, templateStyles.gradient, themeColors.gradient]
  )
  const activePrimary = useMemo(() => 
    profile.template ? templateStyles.primary : themeColors.primary,
    [profile.template, templateStyles.primary, themeColors.primary]
  )
  const activeSecondary = useMemo(() => 
    profile.template ? templateStyles.secondary : themeColors.secondary,
    [profile.template, templateStyles.secondary, themeColors.secondary]
  )

  const socialIcons: Record<string, any> = {
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    facebook: Facebook,
  }

  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-full max-w-sm mx-auto"
        initial={{ rotateY: -15 }}
        animate={isAnimating ? {
          rotateY: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        } : {}}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Container */}
        <motion.div
          className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-100"
          whileHover={{ scale: 1.02, rotateY: 5 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with Gradient or Background Image */}
          <motion.div 
            key={profile.template || profile.theme} // Force re-render on template change
            className={`h-48 relative overflow-hidden ${!profile.backgroundImage && `bg-gradient-to-br ${activeGradient}`}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background image or gradient */}
            {profile.backgroundImage ? (
              <img src={profile.backgroundImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <>
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute w-64 h-64 -top-32 -right-32 bg-white rounded-full blur-3xl" />
                  <div className="absolute w-64 h-64 -bottom-32 -left-32 bg-white rounded-full blur-3xl" />
                </div>
              </>
            )}

            {/* Logo (top right, si mode business) */}
            {profile.logo && (
              <div className="absolute top-4 right-4">
                <div className="w-12 h-12 bg-white rounded-lg shadow-xl p-2 overflow-hidden">
                  <img src={profile.logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>
            )}

            {/* Avatar (bottom center) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <div className="w-28 h-28 bg-white rounded-full shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-3xl font-black bg-gradient-to-br from-orange-500 to-pink-500 bg-clip-text text-transparent">
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="pt-16 pb-8 px-6">
            {/* Name & Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-1">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="font-bold mb-2" style={{ color: activePrimary }}>{profile.title}</p>
              <p className="text-gray-600 text-sm">{profile.company}</p>
              {profile.tagline && (
                <p className="text-gray-500 text-xs italic mt-2">
                  "{profile.tagline}"
                </p>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {profile.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: activePrimary }} />
                  <span className="text-gray-700 truncate">{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: activePrimary }} />
                  <span className="text-gray-700">{profile.phone}</span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 flex-shrink-0" style={{ color: activePrimary }} />
                  <span className="text-blue-600 truncate">{profile.website}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: activePrimary }} />
                  <span className="text-gray-700">{profile.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {profile.socialLinks.length > 0 && (
              <div className="flex justify-center gap-3 mb-6">
                {profile.socialLinks.map((link) => {
                  const Icon = socialIcons[link.platform] || Share2
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      className="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                      style={{ 
                        background: `linear-gradient(135deg, ${activePrimary}20, ${activeSecondary}20)`,
                        color: activePrimary
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            )}

            {/* QR Code */}
            {profile.enableQRCode && (
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-200">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex justify-around pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center text-gray-600 mb-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-bold">{profile.views}</span>
                </div>
                <div className="text-xs text-gray-500">vues</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center text-gray-600 mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-bold">{profile.saves}</span>
                </div>
                <div className="text-xs text-gray-500">saves</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center text-gray-600 mb-1">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-bold">{profile.shares}</span>
                </div>
                <div className="text-xs text-gray-500">partages</div>
              </div>
            </div>
          </div>

          {/* NFC Badge */}
          {profile.enableNFC && (
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-white text-xs font-bold flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                NFC
              </div>
            </div>
          )}
        </motion.div>

        {/* Shadow */}
        <div className="absolute inset-0 -z-10 bg-gray-400 rounded-3xl blur-2xl opacity-20" />
      </motion.div>
    </div>
  )
}

