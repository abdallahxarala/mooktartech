'use client'

import React from 'react'
import { CardProject, DesignElement } from '@/lib/store/card-designer-store'
import { ElementsPanel } from './panels/elements-panel'
import { LayersPanel } from './panels/layers-panel'
import { PropertiesPanel } from './panels/properties-panel'
import { DataPanel } from './panels/data-panel'
import { SecurityPanel } from './panels/security-panel'

interface CardDesignerPanelsProps {
  activePanel: string
  onPanelChange: (panel: string) => void
  project: CardProject
  selectedElements: string[]
}

const panels = [
  { id: 'elements', label: 'Éléments', icon: '📦' },
  { id: 'layers', label: 'Calques', icon: '📚' },
  { id: 'properties', label: 'Propriétés', icon: '⚙️' },
  { id: 'data', label: 'Données', icon: '📊' },
  { id: 'security', label: 'Sécurité', icon: '🔒' }
]

export function CardDesignerPanels({ 
  activePanel, 
  onPanelChange, 
  project, 
  selectedElements 
}: CardDesignerPanelsProps) {
  const currentDesign = project.recto // Pour l'instant, on utilise recto
  
  const renderPanelContent = () => {
    switch (activePanel) {
      case 'elements':
        return <ElementsPanel />
      case 'layers':
        return <LayersPanel elements={currentDesign.elements} />
      case 'properties':
        return <PropertiesPanel selectedElements={selectedElements} />
      case 'data':
        return <DataPanel project={project} />
      case 'security':
        return <SecurityPanel project={project} />
      default:
        return <ElementsPanel />
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Panel Tabs */}
      <div className="flex border-b border-gray-200">
        {panels.map((panel) => (
          <button
            key={panel.id}
            onClick={() => onPanelChange(panel.id)}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
              activePanel === panel.id
                ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">{panel.icon}</span>
            {panel.label}
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        {renderPanelContent()}
      </div>
    </div>
  )
}
