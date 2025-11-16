'use client'

import React, { useState, useEffect } from 'react'
import { Facebook, Instagram, Twitter, Linkedin, MessageCircle, Copy, Download } from 'lucide-react'
import toast from 'react-hot-toast'

interface SocialContent {
  facebook: {
    post: string
    imageSpecs: string
    hashtags: string
  }
  instagram: {
    caption: string
    imageSpecs: string
    hashtags: string
    story: any
  }
  twitter: {
    tweet: string
    imageSpecs: string
    hashtags: string
  }
  linkedin: {
    post: string
    imageSpecs: string
    hashtags: string
  }
  whatsapp: {
    message: string
    catalogEntry: any
  }
}

interface SocialMediaPreviewProps {
  productId: string
  productName: string
}

export function SocialMediaPreview({ productId, productName }: SocialMediaPreviewProps) {
  const [socialContent, setSocialContent] = useState<SocialContent | null>(null)
  const [activePlatform, setActivePlatform] = useState<'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'whatsapp'>('facebook')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSocialContent()
  }, [productId])

  const loadSocialContent = async () => {
    try {
      const response = await fetch('/data/social-media-content.json')
      const data = await response.json()
      setSocialContent(data[productId] || null)
    } catch (error) {
      console.error('Erreur chargement contenu social:', error)
      toast.error('Erreur chargement contenu social')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`Contenu ${platform} copié !`)
  }

  const downloadContent = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Contenu téléchargé !')
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Chargement du contenu social...</p>
      </div>
    )
  }

  if (!socialContent) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Aucun contenu social trouvé pour ce produit</p>
      </div>
    )
  }

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'bg-black' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-600' }
  ] as const

  const getCurrentContent = () => {
    switch (activePlatform) {
      case 'facebook':
        return socialContent.facebook
      case 'instagram':
        return socialContent.instagram
      case 'twitter':
        return socialContent.twitter
      case 'linkedin':
        return socialContent.linkedin
      case 'whatsapp':
        return socialContent.whatsapp
      default:
        return socialContent.facebook
    }
  }

  const currentContent = getCurrentContent()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Contenu Réseaux Sociaux - {productName}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const content = activePlatform === 'whatsapp' 
                ? currentContent.message 
                : activePlatform === 'instagram' 
                  ? currentContent.caption 
                  : activePlatform === 'twitter'
                    ? currentContent.tweet
                    : currentContent.post
              copyToClipboard(content, platforms.find(p => p.id === activePlatform)?.name || '')
            }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copier
          </button>
          <button
            onClick={() => {
              const content = activePlatform === 'whatsapp' 
                ? currentContent.message 
                : activePlatform === 'instagram' 
                  ? currentContent.caption 
                  : activePlatform === 'twitter'
                    ? currentContent.tweet
                    : currentContent.post
              downloadContent(content, `${productId}-${activePlatform}.txt`)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Télécharger
          </button>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {platforms.map((platform) => {
          const Icon = platform.icon
          return (
            <button
              key={platform.id}
              onClick={() => setActivePlatform(platform.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activePlatform === platform.id
                  ? `${platform.color} text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {platform.name}
            </button>
          )
        })}
      </div>

      {/* Content Display */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="space-y-4">
          {/* Image Specs */}
          {currentContent.imageSpecs && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Format image:</span>
              <span className="px-2 py-1 bg-gray-100 rounded">{currentContent.imageSpecs}</span>
            </div>
          )}

          {/* Hashtags */}
          {currentContent.hashtags && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Hashtags:</span>
              <div className="text-sm text-blue-600 break-words">
                {currentContent.hashtags}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Contenu:</span>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">
                {activePlatform === 'whatsapp' 
                  ? currentContent.message 
                  : activePlatform === 'instagram' 
                    ? currentContent.caption 
                    : activePlatform === 'twitter'
                      ? currentContent.tweet
                      : currentContent.post}
              </pre>
            </div>
          </div>

          {/* Instagram Story (if applicable) */}
          {activePlatform === 'instagram' && currentContent.story && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Story Slides:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(currentContent.story).map(([slide, content]: [string, any]) => (
                  <div key={slide} className="bg-pink-50 p-3 rounded-lg">
                    <div className="text-xs font-medium text-pink-700 mb-2">{slide}</div>
                    <div className="text-sm text-gray-700">
                      <div><strong>Type:</strong> {content.type}</div>
                      {content.text && <div><strong>Texte:</strong> {content.text}</div>}
                      {content.title && <div><strong>Titre:</strong> {content.title}</div>}
                      {content.features && (
                        <div>
                          <strong>Features:</strong>
                          <ul className="list-disc list-inside ml-2">
                            {content.features.map((f: string, i: number) => (
                              <li key={i} className="text-xs">{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {content.cta && <div><strong>CTA:</strong> {content.cta}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp Catalog (if applicable) */}
          {activePlatform === 'whatsapp' && currentContent.catalogEntry && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Entrée Catalogue:</span>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-gray-700 space-y-1">
                  <div><strong>Titre:</strong> {currentContent.catalogEntry.title}</div>
                  <div><strong>Description:</strong> {currentContent.catalogEntry.description}</div>
                  <div><strong>Prix:</strong> {currentContent.catalogEntry.price} {currentContent.catalogEntry.currency}</div>
                  <div><strong>URL:</strong> {currentContent.catalogEntry.url}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
