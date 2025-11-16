'use client'

import React from 'react'
import { CardProject } from '@/lib/store/card-designer-store'
import { Upload, Download, FileSpreadsheet, Database, RefreshCw } from 'lucide-react'

interface DataPanelProps {
  project: CardProject
}

export function DataPanel({ project }: DataPanelProps) {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Données</h3>
        <button className="p-1 hover:bg-gray-100 rounded">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Import de données */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Importer des données</h4>
        
        <div className="space-y-2">
          <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2">
            <Upload className="w-4 h-4" />
            <span className="text-sm">Fichier Excel (.xlsx)</span>
          </button>
          
          <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2">
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-sm">Fichier CSV (.csv)</span>
          </button>
          
          <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2">
            <Database className="w-4 h-4" />
            <span className="text-sm">Base de données</span>
          </button>
        </div>
      </div>

      {/* Source de données actuelle */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Source actuelle</h4>
        
        {project.dataSource ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Données connectées</span>
            </div>
            <div className="text-xs text-green-700">
              <div>Type: {project.dataSource.type.toUpperCase()}</div>
              <div>Champs: {project.dataSource.fields.length}</div>
              <div>URL: {project.dataSource.url}</div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <div className="text-gray-500 text-sm">Aucune source de données</div>
            <div className="text-xs text-gray-400 mt-1">Importez un fichier pour commencer</div>
          </div>
        )}
      </div>

      {/* Mapping des champs */}
      {project.dataSource && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Mapping des champs</h4>
          
          <div className="space-y-2">
            {Object.entries(project.dataSource.mapping).map(([field, mapping]) => (
              <div key={field} className="flex items-center space-x-2 p-2 bg-white border border-gray-200 rounded">
                <div className="flex-1 text-sm text-gray-600">{field}</div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-sm font-medium text-gray-900">{mapping}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prévisualisation des données */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Aperçu des données</h4>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
            <div className="text-xs text-gray-600">Premières lignes</div>
          </div>
          <div className="p-3">
            <div className="text-sm text-gray-500 text-center">
              {project.dataSource ? 'Chargement des données...' : 'Aucune donnée à afficher'}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button className="w-full px-3 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
          Générer en série
        </button>
        <button className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Exporter les données</span>
        </button>
      </div>
    </div>
  )
}
