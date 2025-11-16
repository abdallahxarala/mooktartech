'use client'

import { useEffect } from 'react'
import { BadgeDesignerCanvas } from './canvas'
import { ToolsPanel } from './tools-panel'
import { PropertiesPanel } from './properties-panel'
import { BadgeDesignerTopbar } from './topbar'
import { useBadgeDesignerStore } from '@/lib/store/badge-designer-store'

interface BadgeDesignerShellProps {
  locale: string
  translations?: any
  initialTemplate?: 'classic' | 'minimal' | 'corporate' | 'event'
}

export function BadgeDesignerShell({ 
  locale, 
  translations,
  initialTemplate = 'classic' 
}: BadgeDesignerShellProps) {
  const { currentDesign, initializeDesign } = useBadgeDesignerStore()

  // Initialiser le design si nécessaire
  useEffect(() => {
    if (!currentDesign) {
      initializeDesign(initialTemplate)
    }
  }, [currentDesign, initializeDesign, initialTemplate])

  if (!currentDesign) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement du designer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-950 text-slate-50">
      {/* Topbar */}
      <BadgeDesignerTopbar locale={locale} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar gauche - Tools */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur overflow-y-auto">
          <ToolsPanel />
        </aside>

        {/* Zone centrale - Canvas */}
        <main className="flex-1 flex items-center justify-center bg-slate-950 relative overflow-hidden">
          <BadgeDesignerCanvas />
        </main>

        {/* Panneau droit - Properties */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900/60 backdrop-blur overflow-y-auto">
          <PropertiesPanel />
        </aside>
      </div>
    </div>
  )
}

