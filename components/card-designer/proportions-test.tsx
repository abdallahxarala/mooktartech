'use client'

import React from 'react'

export function ProportionsTest() {
  // Test des proportions CR80
  const CARD_WIDTH = 856
  const CARD_HEIGHT = 540
  const ratio = CARD_WIDTH / CARD_HEIGHT
  const expectedRatio = 85.6 / 53.98

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-sm font-bold text-blue-800 mb-2">Test des Proportions CR80</h3>
      <div className="text-xs text-blue-700 space-y-1">
        <div>Dimensions: {CARD_WIDTH} × {CARD_HEIGHT} px</div>
        <div>Ratio calculé: {ratio.toFixed(3)}</div>
        <div>Ratio attendu: {expectedRatio.toFixed(3)}</div>
        <div className={`font-bold ${Math.abs(ratio - expectedRatio) < 0.001 ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(ratio - expectedRatio) < 0.001 ? '✅ Proportions correctes' : '❌ Proportions incorrectes'}
        </div>
      </div>
    </div>
  )
}
