'use client'

import React from 'react'
import { DesignElement } from '@/lib/store/card-designer-store'
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Copy, 
  Move,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

interface LayersPanelProps {
  elements: DesignElement[]
}

export function LayersPanel({ elements }: LayersPanelProps) {
  const handleToggleVisibility = (elementId: string) => {
    // TODO: Implémenter toggle visibility
    console.log('Toggle visibility:', elementId)
  }

  const handleToggleLock = (elementId: string) => {
    // TODO: Implémenter toggle lock
    console.log('Toggle lock:', elementId)
  }

  const handleDelete = (elementId: string) => {
    // TODO: Implémenter suppression
    console.log('Delete:', elementId)
  }

  const handleDuplicate = (elementId: string) => {
    // TODO: Implémenter duplication
    console.log('Duplicate:', elementId)
  }

  const handleMoveUp = (elementId: string) => {
    // TODO: Implémenter déplacement vers le haut
    console.log('Move up:', elementId)
  }

  const handleMoveDown = (elementId: string) => {
    // TODO: Implémenter déplacement vers le bas
    console.log('Move down:', elementId)
  }

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return '📝'
      case 'image':
        return '🖼️'
      case 'rectangle':
        return '⬜'
      case 'circle':
        return '⭕'
      case 'qr':
        return '📱'
      case 'barcode':
        return '📊'
      case 'line':
        return '➖'
      case 'security':
        return '🔒'
      default:
        return '📦'
    }
  }

  const getElementColor = (type: string) => {
    switch (type) {
      case 'text':
        return 'text-blue-600'
      case 'image':
        return 'text-green-600'
      case 'rectangle':
      case 'circle':
        return 'text-purple-600'
      case 'qr':
      case 'barcode':
        return 'text-orange-600'
      case 'line':
        return 'text-gray-600'
      case 'security':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Calques ({elements.length})
        </h3>
        <div className="flex space-x-1">
          <button className="p-1 hover:bg-gray-100 rounded" title="Nouveau calque">
            <Move className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layers List */}
      <div className="space-y-1">
        {elements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-sm">Aucun élément</p>
            <p className="text-xs">Glissez des éléments depuis le panneau de gauche</p>
          </div>
        ) : (
          elements
            .sort((a, b) => b.layer - a.layer) // Tri par ordre de calque (plus haut en premier)
            .map((element) => (
              <div
                key={element.id}
                className="group flex items-center p-2 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                {/* Icon et nom */}
                <div className="flex items-center flex-1 min-w-0">
                  <span className="text-lg mr-2">
                    {getElementIcon(element.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${getElementColor(element.type)}`}>
                      {element.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {element.type} • {Math.round(element.position.x)}, {Math.round(element.position.y)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Visibility */}
                  <button
                    onClick={() => handleToggleVisibility(element.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title={element.visible ? 'Masquer' : 'Afficher'}
                  >
                    {element.visible ? (
                      <Eye className="w-4 h-4 text-gray-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {/* Lock */}
                  <button
                    onClick={() => handleToggleLock(element.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title={element.locked ? 'Déverrouiller' : 'Verrouiller'}
                  >
                    {element.locked ? (
                      <Lock className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Unlock className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {/* Move Up */}
                  <button
                    onClick={() => handleMoveUp(element.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Monter"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMoveDown(element.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Descendre"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicate(element.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Dupliquer"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(element.id)}
                    className="p-1 hover:bg-red-100 rounded"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Calques visibles:</span>
            <span>{elements.filter(e => e.visible).length}</span>
          </div>
          <div className="flex justify-between">
            <span>Calques verrouillés:</span>
            <span>{elements.filter(e => e.locked).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
