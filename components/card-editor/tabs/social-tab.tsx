'use client'

import React, { useState } from 'react'
import { useCardEditorStore } from '@/lib/store/card-editor-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Link, Globe } from 'lucide-react'

const socialPlatforms = [
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/...' },
  { id: 'twitter', name: 'Twitter', icon: '🐦', placeholder: 'https://twitter.com/...' },
  { id: 'facebook', name: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/...' },
  { id: 'instagram', name: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/...' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', placeholder: '+221 33 XXX XX XX' },
  { id: 'youtube', name: 'YouTube', icon: '📺', placeholder: 'https://youtube.com/...' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', placeholder: 'https://tiktok.com/@...' },
  { id: 'github', name: 'GitHub', icon: '💻', placeholder: 'https://github.com/...' }
]

export function SocialTab() {
  const { card, addSocialLink, removeSocialLink, updateSocialLink } = useCardEditorStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPlatform, setNewPlatform] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLabel, setNewLabel] = useState('')

  const handleAddLink = () => {
    if (newPlatform && newUrl) {
      addSocialLink(newPlatform, newUrl, newLabel || newPlatform)
      setNewPlatform('')
      setNewUrl('')
      setNewLabel('')
      setShowAddForm(false)
    }
  }

  const handleRemoveLink = (id: string) => {
    removeSocialLink(id)
  }

  const handleUpdateLink = (id: string, field: string, value: string) => {
    updateSocialLink(id, { [field]: value })
  }

  return (
    <div className="p-4 space-y-6">
      {/* Ajouter un lien */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Réseaux sociaux</span>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </Button>
          </CardTitle>
        </CardHeader>
        
        {showAddForm && (
          <CardContent className="space-y-4">
            <div>
              <Label>Plateforme</Label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Sélectionner une plateforme</option>
                {socialPlatforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.icon} {platform.name}
                  </option>
                ))}
                <option value="custom">🔗 Lien personnalisé</option>
              </select>
            </div>

            {newPlatform === 'custom' && (
              <div>
                <Label>Label personnalisé</Label>
                <Input
                  placeholder="Mon site web"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label>URL</Label>
              <Input
                placeholder={
                  newPlatform === 'custom' 
                    ? 'https://monsite.com' 
                    : socialPlatforms.find(p => p.id === newPlatform)?.placeholder || 'URL'
                }
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleAddLink} size="sm">
                Ajouter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Liens existants */}
      <Card>
        <CardHeader>
          <CardTitle>Liens ajoutés ({card.socialLinks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {card.socialLinks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Link className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun lien ajouté</p>
              <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {card.socialLinks.map((link) => {
                const platform = socialPlatforms.find(p => p.id === link.platform)
                return (
                  <div key={link.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="text-2xl">
                      {platform?.icon || '🔗'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {link.label || platform?.name || link.platform}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-600"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{link.url}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveLink(link.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conseils */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Conseils</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>• Ajoutez vos réseaux sociaux les plus actifs</p>
          <p>• Maximum 6 liens pour une carte lisible</p>
          <p>• Utilisez des liens courts quand possible</p>
          <p>• Testez vos liens avant de publier</p>
        </CardContent>
      </Card>
    </div>
  )
}
