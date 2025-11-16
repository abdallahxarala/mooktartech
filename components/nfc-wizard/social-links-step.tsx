'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Github,
  Globe,
  Mail,
  MessageCircle,
  Music
} from 'lucide-react'
import { useNFCEditorStore } from '@/lib/store/nfc-editor-store'

const SOCIAL_PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'blue', placeholder: 'https://linkedin.com/in/username' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'sky', placeholder: 'https://twitter.com/username' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'pink', placeholder: 'https://instagram.com/username' },
  { id: 'tiktok', name: 'TikTok', icon: Music, color: 'pink', placeholder: 'https://tiktok.com/@username' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'blue', placeholder: 'https://facebook.com/username' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'red', placeholder: 'https://youtube.com/@username' },
  { id: 'github', name: 'GitHub', icon: Github, color: 'gray', placeholder: 'https://github.com/username' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'green', placeholder: '+221771234567' },
  { id: 'website', name: 'Site Web', icon: Globe, color: 'purple', placeholder: 'https://votresite.com' },
  { id: 'email', name: 'Email', icon: Mail, color: 'orange', placeholder: 'contact@exemple.com' }
]

export function SocialLinksStep({ profile, update }: any) {
  const { addSocialLink, updateSocialLink, deleteSocialLink } = useNFCEditorStore()
  const [showAddMenu, setShowAddMenu] = useState(false)

  if (!profile) return null

  const socialLinks = profile.socialLinks

  const handleAddLink = (platformId: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId)
    if (!platform) return

    addSocialLink({
      platform: platform.id,
      url: '',
      icon: platform.id
    })
    setShowAddMenu(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {socialLinks.map((link: any) => {
            const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform)
            if (!platform) return null

            const IconComponent = platform.icon

            return (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group bg-white rounded-2xl p-4 border-2 border-gray-200 hover:border-orange-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${platform.color}-100 flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`w-6 h-6 text-${platform.color}-600`} />
                  </div>

                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-500 mb-1">
                      {platform.name}
                    </div>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                      placeholder={platform.placeholder}
                      className="w-full px-0 py-1 border-0 border-b-2 border-transparent focus:border-orange-500 focus:ring-0 text-sm font-medium transition-colors"
                    />
                  </div>

                  <button
                    onClick={() => deleteSocialLink(link.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {socialLinks.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-gray-600 font-semibold mb-2">
              Aucun lien ajouté
            </div>
            <div className="text-sm text-gray-500">
              Cliquez sur "Ajouter" pour commencer
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center justify-center gap-2 w-full px-6 py-4 border-2 border-dashed border-gray-300 hover:border-orange-500 text-gray-600 hover:text-orange-600 font-bold rounded-2xl transition-all hover:bg-orange-50"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un lien</span>
        </button>

        <AnimatePresence>
          {showAddMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddMenu(false)}
                className="fixed inset-0 z-40"
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-4 z-50 max-h-96 overflow-y-auto"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const IconComponent = platform.icon
                    const alreadyAdded = socialLinks.some((l: any) => l.platform === platform.id)

                    return (
                      <button
                        key={platform.id}
                        onClick={() => !alreadyAdded && handleAddLink(platform.id)}
                        disabled={alreadyAdded}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          alreadyAdded
                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-orange-500 hover:bg-orange-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg bg-${platform.color}-100 flex items-center justify-center mb-2`}>
                          <IconComponent className={`w-5 h-5 text-${platform.color}-600`} />
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {platform.name}
                        </div>
                        {alreadyAdded && (
                          <div className="text-xs text-gray-500 mt-1">
                            Déjà ajouté
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

