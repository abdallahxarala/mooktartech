'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useCardDesignerStore } from '@/lib/store/card-designer-store'
import { CardDesignerHeader } from '@/components/card-designer/card-designer-header'
import { CardDesignerToolbar } from '@/components/card-designer/card-designer-toolbar'
import { CardDesignerCanvasFabric, CardDesignerCanvasFabricRef } from '@/components/card-designer/card-designer-canvas-fabric'
import { CardDesignerPanels } from '@/components/card-designer/card-designer-panels'
import { CardDesignerFooter } from '@/components/card-designer/card-designer-footer'

interface CardDesignerClientProps {
  locale: string
  translations: any
}

export function CardDesignerClient({ locale, translations }: CardDesignerClientProps) {
  const {
    currentProject,
    canvasMode,
    activeTool,
    activePanel,
    showGrid,
    showGuides,
    showRulers,
    zoom,
    selectedElements,
    createProject,
    setCanvasMode,
    setZoom,
    setActiveTool,
    setActivePanel,
    toggleGrid,
    toggleGuides,
    toggleRulers,
    undo,
    redo,
    canUndo,
    canRedo,
    saveProject
  } = useCardDesignerStore()

  const canvasRef = useRef<CardDesignerCanvasFabricRef>(null)

  // Initialiser un projet par défaut si aucun n'existe
  useEffect(() => {
    if (!currentProject) {
      console.log("⚠️ No project, creating blank project...")
      createProject('blank')
      console.log("✅ Blank project created")
    }
  }, [currentProject, createProject])

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            saveProject()
            break
          case 'z':
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case 'y':
            e.preventDefault()
            redo()
            break
          case 'g':
            e.preventDefault()
            toggleGrid()
            break
          case '1':
            e.preventDefault()
            setCanvasMode('recto')
            break
          case '2':
            e.preventDefault()
            setCanvasMode('verso')
            break
        }
      }
      
      // Outils
      switch (e.key) {
        case 'v':
          setActiveTool('pointer')
          break
        case 't':
          setActiveTool('text')
          break
        case 'r':
          setActiveTool('rectangle')
          break
        case 'i':
          setActiveTool('image')
          break
        case 'q':
          setActiveTool('qr')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveProject, undo, redo, toggleGrid, setCanvasMode, setActiveTool])

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du designer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <CardDesignerHeader 
        project={currentProject}
        canvasMode={canvasMode}
        onCanvasModeChange={setCanvasMode}
        onZoomChange={setZoom}
        zoom={zoom}
        canUndo={canUndo()}
        canRedo={canRedo()}
        onUndo={undo}
        onRedo={redo}
        onSave={saveProject}
        onToggleGrid={toggleGrid}
        onToggleGuides={toggleGuides}
        onToggleRulers={toggleRulers}
        showGrid={showGrid}
        showGuides={showGuides}
        showRulers={showRulers}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col">
          <CardDesignerToolbar 
            activeTool={activeTool}
            onToolChange={setActiveTool}
          />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            {/* Canvas */}
            <div className="flex-1 bg-gray-100 relative overflow-hidden">
              {/* Canvas - rendu même sans projet pour test */}
              <CardDesignerCanvasFabric ref={canvasRef} />
            </div>

            {/* Panels */}
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
              {/* Panels temporairement sans canvasRef */}
              <CardDesignerPanels 
                activePanel={activePanel}
                onPanelChange={setActivePanel}
                project={currentProject}
                selectedElements={selectedElements}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <CardDesignerFooter 
        project={currentProject}
        canvasMode={canvasMode}
        zoom={zoom}
        selectedCount={selectedElements.length}
      />
    </div>
  )
}
