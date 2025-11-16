'use client'

import React from 'react'
import { useCardEditorStore } from '@/lib/store/card-editor-store'
import { CardCanvasContent } from '@/components/card-editor/card-canvas-content'

export function CardEditorTest() {
  const { card, resetCard, setTheme } = useCardEditorStore()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test de l'éditeur de cartes NFC
        </h1>
        
        {/* Test des thèmes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test des thèmes</h2>
          <div className="grid grid-cols-4 gap-4">
            {['minimal', 'corporate', 'creative', 'elegant', 'modern', 'luxury', 'tech', 'natural'].map((themeId) => (
              <button
                key={themeId}
                onClick={() => setTheme(themeId)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  card.theme === themeId 
                    ? 'border-orange-500 ring-2 ring-orange-200' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="text-sm font-medium capitalize">{themeId}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Test de la carte */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Aperçu de la carte</h2>
          <div className="flex justify-center">
            <div className="w-[400px] h-[250px] bg-white rounded-2xl shadow-2xl overflow-hidden">
              <CardCanvasContent card={card} />
            </div>
          </div>
        </div>

        {/* Données de test */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Données actuelles</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(card, null, 2)}
          </pre>
        </div>

        {/* Boutons de test */}
        <div className="flex space-x-4">
          <button
            onClick={resetCard}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Reset Card
          </button>
          <button
            onClick={() => {
              // Test avec des données
              useCardEditorStore.getState().updateField('firstName', 'Jean')
              useCardEditorStore.getState().updateField('lastName', 'Dupont')
              useCardEditorStore.getState().updateField('title', 'Directeur Commercial')
              useCardEditorStore.getState().updateField('company', 'Xarala Solutions')
              useCardEditorStore.getState().updateField('email', 'contact@xarala.sn')
              useCardEditorStore.getState().updateField('phone', '+221 33 XXX XX XX')
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Charger données test
          </button>
        </div>
      </div>
    </div>
  )
}
