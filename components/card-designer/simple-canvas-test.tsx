'use client'

import React from 'react'
import { useCardDesignerStore } from '@/lib/store/card-designer-store'
import { ProportionsTest } from './proportions-test'

export function SimpleCanvasTest() {
  const { zoom } = useCardDesignerStore()

  // Dimensions correctes pour carte CR80
  // Ratio : 85.6 / 53.98 = 1.586
  const CARD_WIDTH = 856  // px (85.6mm)
  const CARD_HEIGHT = 540 // px (53.98mm)
  
  // OU pour plus de précision :
  // const CARD_WIDTH = 1011  // px à 300 DPI
  // const CARD_HEIGHT = 638  // px à 300 DPI

  return (
    <div className="flex-1 bg-gray-100 overflow-auto">
      <div className="p-8">
        {/* Test des proportions */}
        <div className="mb-6">
          <ProportionsTest />
        </div>
        {/* RECTO */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              📄 RECTO (Front)
            </h3>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>85.6 × 53.98 mm</span>
              <span>•</span>
              <span>Ratio 1.586:1</span>
              <span>•</span>
              <span>Format CR80</span>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-xl shadow-2xl mx-auto border border-gray-300"
            style={{
              width: `${CARD_WIDTH}px`,
              height: `${CARD_HEIGHT}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
            }}
          >
            {/* Grille de fond */}
            <div 
              className="w-full h-full relative"
              style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, .05) 25%, rgba(0, 0, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, .05) 75%, rgba(0, 0, 0, .05) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(0, 0, 0, .05) 25%, rgba(0, 0, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, .05) 75%, rgba(0, 0, 0, .05) 76%, transparent 77%, transparent)
                `,
                backgroundSize: '40px 40px',
              }}
            >
              {/* Zone de contenu */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-1">
                    Nom Prénom
                  </h4>
                  <p className="text-gray-600 mb-2">Fonction</p>
                  <p className="text-sm text-gray-500">Entreprise</p>
                </div>
              </div>
              
              {/* Marqueurs de coins pour visualiser les bords */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-orange-400 opacity-50" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-orange-400 opacity-50" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-orange-400 opacity-50" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-orange-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* VERSO */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              📄 VERSO (Back)
            </h3>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>85.6 × 53.98 mm</span>
              <span>•</span>
              <span>Ratio 1.586:1</span>
              <span>•</span>
              <span>Format CR80</span>
            </div>
          </div>
          
          <div 
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl mx-auto border border-gray-300"
            style={{
              width: `${CARD_WIDTH}px`,
              height: `${CARD_HEIGHT}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
            }}
          >
            <div 
              className="w-full h-full relative"
              style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, .03) 25%, rgba(0, 0, 0, .03) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, .03) 75%, rgba(0, 0, 0, .03) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(0, 0, 0, .03) 25%, rgba(0, 0, 0, .03) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, .03) 75%, rgba(0, 0, 0, .03) 76%, transparent 77%, transparent)
                `,
                backgroundSize: '40px 40px',
              }}
            >
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-700 mb-2">
                    Informations de contact
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📧 email@exemple.com</p>
                    <p>📞 +221 33 XXX XX XX</p>
                    <p>🌐 www.exemple.sn</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center shadow">
                    <span className="text-xs text-gray-400">QR Code</span>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>Carte N° 001234</p>
                    <p>Valable jusqu'au 12/2025</p>
                  </div>
                </div>
              </div>
              
              {/* Marqueurs de coins */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-orange-400 opacity-30" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-orange-400 opacity-30" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-orange-400 opacity-30" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-orange-400 opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
