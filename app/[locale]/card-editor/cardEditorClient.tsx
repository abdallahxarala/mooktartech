'use client'

import React, { useState } from 'react'
import { useCardEditorStore } from '@/lib/store/card-editor-store'
import { PreviewPane } from '@/components/card-editor/preview-pane'
import { Smartphone, Tablet, Monitor, Save, Eye, Share2 } from 'lucide-react'

interface CardEditorClientProps {
  locale: string
  translations: any
}

export function CardEditorClient({ locale, translations }: CardEditorClientProps) {
  const { 
    card, 
    activeTab, 
    previewDevice, 
    isSaving,
    setActiveTab, 
    setPreviewDevice,
    updateCard,
    setProfilePhoto,
    setCoverPhoto,
    setLogo,
    setTheme,
    save,
    publish
  } = useCardEditorStore()

  const [showPreview, setShowPreview] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const handleSave = async () => {
    try {
      await save()
      alert('Page sauvegardée avec succès !')
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handlePublish = async () => {
    try {
      await publish()
      alert('Page publiée avec succès !')
    } catch (error) {
      alert('Erreur lors de la publication')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec sélecteur */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-semibold text-gray-900">
              Éditeur de Landing Page Personnelle
            </h1>
            
            {/* Sélecteur d'éditeur */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <a
                href="/fr/card-editor"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-white text-orange-600 shadow-sm"
              >
                <span>📱</span>
                <span>Landing Page</span>
              </a>
              
              <a
                href="/fr/card-designer"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <span>💳</span>
                <span>Carte PVC</span>
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Sélecteur de device */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded-md transition-colors ${
                  previewDevice === 'mobile' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-2 rounded-md transition-colors ${
                  previewDevice === 'tablet' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded-md transition-colors ${
                  previewDevice === 'desktop' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* Boutons d'action */}
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Aperçu</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
            </button>
            
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Publier</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Onglets */}
            <div className="flex space-x-2">
              {[
                { id: 'profile', label: 'Profil', icon: '👤' },
                { id: 'design', label: 'Design', icon: '🎨' },
                { id: 'links', label: 'Liens', icon: '🔗' },
                { id: 'social', label: 'Réseaux', icon: '📱' },
                { id: 'settings', label: 'Paramètres', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profil</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de profil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const url = URL.createObjectURL(file)
                        setProfilePhoto(url)
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de couverture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const url = URL.createObjectURL(file)
                        setCoverPhoto(url)
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo entreprise
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const url = URL.createObjectURL(file)
                        setLogo(url)
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={card.firstName}
                    onChange={(e) => updateCard({ firstName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Jean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={card.lastName}
                    onChange={(e) => updateCard({ lastName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre/Fonction
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateCard({ title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Développeur Web"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    value={card.company}
                    onChange={(e) => updateCard({ company: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Xarala Solutions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={card.location}
                    onChange={(e) => updateCard({ location: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Dakar, Sénégal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biographie
                  </label>
                  <textarea
                    value={card.bio}
                    onChange={(e) => updateCard({ bio: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Parlez de vous..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={card.email}
                    onChange={(e) => updateCard({ email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="contact@exemple.sn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={card.phone}
                    onChange={(e) => updateCard({ phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="+221 33 XXX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={card.website}
                    onChange={(e) => updateCard({ website: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://www.exemple.sn"
                  />
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Design</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thème
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'minimal', name: 'Minimal', preview: 'bg-white border-2 border-gray-200' },
                      { id: 'gradient', name: 'Gradient', preview: 'bg-gradient-to-br from-orange-500 to-pink-500' },
                      { id: 'glassmorphism', name: 'Glass', preview: 'bg-gradient-to-br from-blue-400/20 to-purple-400/20' },
                      { id: 'bento', name: 'Bento', preview: 'bg-gray-100 border-2 border-gray-300' }
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setTheme(theme.id as any)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm ${
                          card.theme === theme.id
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className={`h-8 rounded mb-2 ${theme.preview}`} />
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur d'accent
                  </label>
                  <input
                    type="color"
                    value={card.accentColor}
                    onChange={(e) => updateCard({ accentColor: e.target.value })}
                    className="w-full h-12 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur de fond
                  </label>
                  <input
                    type="color"
                    value={card.backgroundColor}
                    onChange={(e) => updateCard({ backgroundColor: e.target.value })}
                    className="w-full h-12 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur du texte
                  </label>
                  <input
                    type="color"
                    value={card.textColor}
                    onChange={(e) => updateCard({ textColor: e.target.value })}
                    className="w-full h-12 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            {activeTab === 'links' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Boutons d'action</h3>
                <p className="text-gray-500 text-sm">
                  Fonctionnalité en cours de développement...
                </p>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
                <p className="text-gray-500 text-sm">
                  Fonctionnalité en cours de développement...
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Paramètres</h3>
                <p className="text-gray-500 text-sm">
                  Fonctionnalité en cours de développement...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Canvas avec preview temps réel */}
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <PreviewPane />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Aperçu de la page</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="h-[600px] overflow-auto">
              <PreviewPane />
            </div>
          </div>
        </div>
      )}

      {showShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Partager la page</h3>
            <p className="text-gray-600 mb-4">
              Fonctionnalité de partage en cours de développement...
            </p>
            <button
              onClick={() => setShowShare(false)}
              className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
