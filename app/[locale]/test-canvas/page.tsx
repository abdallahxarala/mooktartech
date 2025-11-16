'use client'

import React, { useRef, useEffect } from 'react'
import { CardDesignerCanvasFabric, CardDesignerCanvasFabricRef } from '@/components/card-designer/card-designer-canvas-fabric'

export default function TestCanvasPage() {
  const canvasRef = useRef<CardDesignerCanvasFabricRef>(null)

  useEffect(() => {
    console.log("🧪 TEST CANVAS PAGE LOADED")
  }, [])

  const testProject = {
    id: "test-canvas-project",
    name: "Test Canvas",
    description: "",
    template: "blank",
    dimensions: {
      width: 85.6,
      height: 53.98,
      dpi: 300
    },
    recto: {
      elements: [],
      background: { type: 'color' as const, color: '#ffffff' },
      bleed: 0,
      safeArea: 0
    },
    verso: {
      elements: [],
      background: { type: 'color' as const, color: '#ffffff' },
      bleed: 0,
      safeArea: 0
    },
    security: {
      hologram: false,
      watermark: false,
      microtext: false,
      qrSecure: false,
      uvInk: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🧪 Test Canvas Isolé</h1>
        <p className="text-gray-600 mb-8">
          Page de test pour vérifier que le canvas Fabric.js fonctionne correctement.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Instructions :</h2>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Ouvrez la console (F12)</li>
              <li>Cherchez les logs : 🎨 CardDesignerCanvasFabric RENDERING</li>
              <li>Vérifiez que le canvas est visible ci-dessous</li>
              <li>Testez les boutons ➕ pour ajouter des éléments</li>
            </ol>
          </div>

          <div className="border-2 border-gray-300 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <CardDesignerCanvasFabric
              ref={canvasRef}
              project={testProject}
              mode="recto"
              zoom={100}
              activeTool="pointer"
              selectedElements={[]}
              showGrid={false}
              showGuides={false}
              showRulers={false}
            />
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Actions de test :</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  console.log("🧪 Clicking Add Text button via ref")
                  canvasRef.current?.addText()
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ➕ Add Text (via ref)
              </button>
              <button
                onClick={() => {
                  console.log("🧪 Clicking Add Rectangle button via ref")
                  canvasRef.current?.addRectangle()
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                ➕ Add Rectangle (via ref)
              </button>
              <button
                onClick={() => {
                  console.log("🧪 Clicking Add Circle button via ref")
                  canvasRef.current?.addCircle()
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                ➕ Add Circle (via ref)
              </button>
              <button
                onClick={() => {
                  const canvas = canvasRef.current?.getCanvas()
                  console.log("🧪 Canvas object:", canvas)
                  console.log("🧪 Canvas objects count:", canvas?.getObjects().length || 0)
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                🔍 Debug Canvas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

