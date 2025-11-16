'use client'

import React from 'react'
import { Slider } from '@/components/ui/slider'

interface PropertiesPanelProps {
  selectedElements: string[]
}

export function PropertiesPanel({ selectedElements }: PropertiesPanelProps) {
  const hasSelection = selectedElements.length > 0
  const isMultipleSelection = selectedElements.length > 1

  if (!hasSelection) {
    return (
      <div className="p-4">
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">⚙️</div>
          <p className="text-sm">Aucun élément sélectionné</p>
          <p className="text-xs">Sélectionnez un élément pour voir ses propriétés</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Propriétés
        </h3>
        <span className="text-xs text-gray-500">
          {isMultipleSelection ? `${selectedElements.length} éléments` : '1 élément'}
        </span>
      </div>

      {/* Position et Taille */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Position & Taille</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">X (mm)</label>
            <input
              type="number"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Y (mm)</label>
            <input
              type="number"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Largeur (mm)</label>
            <input
              type="number"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Hauteur (mm)</label>
            <input
              type="number"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-xs text-gray-600 mb-2">Rotation</label>
          <div className="flex items-center space-x-3">
            <Slider
              defaultValue={[0]}
              max={360}
              step={1}
              className="flex-1"
            />
            <input
              type="number"
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="0°"
            />
          </div>
        </div>

        {/* Opacité */}
        <div>
          <label className="block text-xs text-gray-600 mb-2">Opacité</label>
          <div className="flex items-center space-x-3">
            <Slider
              defaultValue={[100]}
              max={100}
              step={1}
              className="flex-1"
            />
            <input
              type="number"
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="100%"
            />
          </div>
        </div>
      </div>

      {/* Propriétés spécifiques au type */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Propriétés</h4>
        
        {/* Texte */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Texte</label>
            <textarea
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows={3}
              placeholder="Saisissez votre texte..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Police</label>
              <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <option>Arial</option>
                <option>Helvetica</option>
                <option>Times New Roman</option>
                <option>Georgia</option>
                <option>Inter</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Taille</label>
              <input
                type="number"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="16"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Couleur</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                className="w-8 h-8 border border-gray-300 rounded"
                defaultValue="#000000"
              />
              <input
                type="text"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        {/* Formes */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Couleur de remplissage</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                className="w-8 h-8 border border-gray-300 rounded"
                defaultValue="#ffffff"
              />
              <input
                type="text"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Couleur de contour</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                className="w-8 h-8 border border-gray-300 rounded"
                defaultValue="#000000"
              />
              <input
                type="text"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Épaisseur du contour</label>
            <input
              type="number"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="1"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
            Dupliquer
          </button>
          <button className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}
