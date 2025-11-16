'use client'

import React from 'react'
import { 
  Type, 
  Square, 
  Circle, 
  Image, 
  QrCode, 
  BarChart3, 
  Minus,
  Upload,
  FolderOpen,
  Palette,
  Shapes
} from 'lucide-react'

export function ElementsPanel() {
  const elementCategories = [
    {
      title: 'Texte',
      icon: Type,
      elements: [
        { name: 'Titre', description: 'Titre principal' },
        { name: 'Sous-titre', description: 'Sous-titre' },
        { name: 'Texte', description: 'Texte normal' },
        { name: 'Texte petit', description: 'Texte de légende' }
      ]
    },
    {
      title: 'Formes',
      icon: Shapes,
      elements: [
        { name: 'Rectangle', description: 'Forme rectangulaire' },
        { name: 'Cercle', description: 'Forme circulaire' },
        { name: 'Triangle', description: 'Forme triangulaire' },
        { name: 'Polygone', description: 'Forme personnalisée' }
      ]
    },
    {
      title: 'Images',
      icon: Image,
      elements: [
        { name: 'Photo', description: 'Image de profil' },
        { name: 'Logo', description: 'Logo entreprise' },
        { name: 'Icône', description: 'Icône décorative' },
        { name: 'Pattern', description: 'Motif de fond' }
      ]
    },
    {
      title: 'Codes',
      icon: QrCode,
      elements: [
        { name: 'QR Code', description: 'Code QR standard' },
        { name: 'QR Sécurisé', description: 'QR avec sécurité' },
        { name: 'Code-barres', description: 'Code-barres EAN13' },
        { name: 'Code 128', description: 'Code-barres Code 128' }
      ]
    },
    {
      title: 'Lignes',
      icon: Minus,
      elements: [
        { name: 'Ligne droite', description: 'Ligne simple' },
        { name: 'Ligne pointillée', description: 'Ligne en pointillés' },
        { name: 'Flèche', description: 'Ligne avec flèche' },
        { name: 'Courbe', description: 'Ligne courbe' }
      ]
    }
  ]

  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: elementType,
      name: e.currentTarget.textContent
    }))
  }

  return (
    <div className="p-4 space-y-6">
      {/* Upload d'images */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
          <Upload className="w-4 h-4 mr-2" />
          Importer
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors">
            <Image className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <span className="text-xs text-gray-600">Image</span>
          </button>
          <button className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors">
            <FolderOpen className="w-6 h-6 mx-auto mb-1 text-gray-400" />
            <span className="text-xs text-gray-600">Dossier</span>
          </button>
        </div>
      </div>

      {/* Bibliothèque d'éléments */}
      <div className="space-y-4">
        {elementCategories.map((category) => {
          const Icon = category.icon
          return (
            <div key={category.title} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                <Icon className="w-4 h-4 mr-2" />
                {category.title}
              </h3>
              <div className="space-y-1">
                {category.elements.map((element, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element.name.toLowerCase())}
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 cursor-move transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {element.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {element.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Templates rapides */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
          <Palette className="w-4 h-4 mr-2" />
          Templates Rapides
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors">
            <div className="text-xs font-medium">Badge</div>
            <div className="text-xs opacity-80">Employé</div>
          </button>
          <button className="p-3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors">
            <div className="text-xs font-medium">Étudiant</div>
            <div className="text-xs opacity-80">Université</div>
          </button>
          <button className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors">
            <div className="text-xs font-medium">Accès</div>
            <div className="text-xs opacity-80">Sécurité</div>
          </button>
          <button className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors">
            <div className="text-xs font-medium">VIP</div>
            <div className="text-xs opacity-80">Premium</div>
          </button>
        </div>
      </div>
    </div>
  )
}
