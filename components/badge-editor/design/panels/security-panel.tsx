'use client'

import React from 'react'
import { CardProject } from '@/lib/store/card-designer-store'
import { Shield, Eye, Lock, Zap, QrCode, CheckCircle } from 'lucide-react'

interface SecurityPanelProps {
  project: CardProject
}

export function SecurityPanel({ project }: SecurityPanelProps) {
  const securityFeatures = [
    {
      id: 'hologram',
      name: 'Hologramme',
      description: 'Effet holographique anti-contrefaçon',
      icon: Eye,
      enabled: project.security.hologram,
      cost: 'Premium'
    },
    {
      id: 'watermark',
      name: 'Filigrane',
      description: 'Filigrane invisible intégré',
      icon: Shield,
      enabled: project.security.watermark,
      cost: 'Standard'
    },
    {
      id: 'microtext',
      name: 'Microtexte',
      description: 'Texte microscopique de sécurité',
      icon: Lock,
      enabled: project.security.microtext,
      cost: 'Standard'
    },
    {
      id: 'qrSecure',
      name: 'QR Sécurisé',
      description: 'QR Code avec chiffrement',
      icon: QrCode,
      enabled: project.security.qrSecure,
      cost: 'Premium'
    },
    {
      id: 'uvInk',
      name: 'Encre UV',
      description: 'Éléments visibles aux UV',
      icon: Zap,
      enabled: project.security.uvInk,
      cost: 'Premium'
    }
  ]

  const handleToggleFeature = (featureId: string) => {
    // TODO: Implémenter toggle des fonctionnalités de sécurité
    console.log('Toggle security feature:', featureId)
  }

  const enabledCount = securityFeatures.filter(f => f.enabled).length
  const premiumCount = securityFeatures.filter(f => f.enabled && f.cost === 'Premium').length

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Sécurité</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600">{enabledCount} activées</span>
        </div>
      </div>

      {/* Résumé */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Niveau de sécurité</span>
        </div>
        <div className="text-xs text-blue-700 space-y-1">
          <div>Fonctionnalités actives: {enabledCount}/5</div>
          <div>Fonctionnalités Premium: {premiumCount}</div>
          <div>Coût estimé: {premiumCount > 0 ? '+15%' : 'Standard'}</div>
        </div>
      </div>

      {/* Fonctionnalités de sécurité */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Fonctionnalités disponibles</h4>
        
        <div className="space-y-2">
          {securityFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.id}
                className={`p-3 border rounded-lg transition-colors ${
                  feature.enabled
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    feature.enabled ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      feature.enabled ? 'text-orange-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h5 className={`text-sm font-medium ${
                        feature.enabled ? 'text-orange-900' : 'text-gray-900'
                      }`}>
                        {feature.name}
                      </h5>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        feature.cost === 'Premium'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {feature.cost}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${
                      feature.enabled ? 'text-orange-700' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleToggleFeature(feature.id)}
                    className={`p-1 rounded transition-colors ${
                      feature.enabled
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {feature.enabled ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-current rounded"></div>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommandations */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Recommandations</h4>
        
        <div className="space-y-2">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm font-medium text-yellow-800 mb-1">
              Cartes d'accès
            </div>
            <div className="text-xs text-yellow-700">
              Recommandé: Filigrane + QR Sécurisé + Microtexte
            </div>
          </div>
          
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm font-medium text-red-800 mb-1">
              Cartes VIP/Premium
            </div>
            <div className="text-xs text-red-700">
              Recommandé: Toutes les fonctionnalités Premium
            </div>
          </div>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm font-medium text-green-800 mb-1">
              Cartes standard
            </div>
            <div className="text-xs text-green-700">
              Recommandé: Filigrane + Microtexte
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button className="w-full px-3 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
          Appliquer les recommandations
        </button>
        <button className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
          Réinitialiser
        </button>
      </div>
    </div>
  )
}
