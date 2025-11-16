'use client'

import React, { useState } from 'react'
import { CardData } from '@/lib/store/card-editor-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditorSelector } from '@/components/editor-selector'
import { 
  Undo2, 
  Redo2, 
  Save, 
  Eye, 
  Share2, 
  CheckCircle, 
  Loader2,
  Clock
} from 'lucide-react'

interface CardEditorHeaderProps {
  card: CardData
  isAutoSaving: boolean
  lastSaved: Date | null
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onPreview: () => void
  onShare: () => void
}

export function CardEditorHeader({
  card,
  isAutoSaving,
  lastSaved,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onPreview,
  onShare
}: CardEditorHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(`${card.firstName} ${card.lastName}`.trim() || 'Ma carte virtuelle')

  const handleTitleSave = () => {
    setIsEditingTitle(false)
    // Here you could update the card title if needed
  }

  const formatLastSaved = (date: Date | null) => {
    if (!date) return 'Jamais sauvegardé'
    
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    
    if (seconds < 60) return `Sauvegardé il y a ${seconds}s`
    if (seconds < 3600) return `Sauvegardé il y a ${Math.floor(seconds / 60)}min`
    return `Sauvegardé il y a ${Math.floor(seconds / 3600)}h`
  }

  return (
    <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Left side - Title, Selector and Auto-save status */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          {isEditingTitle ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave()
                if (e.key === 'Escape') setIsEditingTitle(false)
              }}
              className="text-xl font-semibold border-none shadow-none p-0 h-auto"
              autoFocus
            />
          ) : (
            <h1 
              className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-orange-500 transition-colors"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}
            </h1>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {isAutoSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sauvegarde...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{formatLastSaved(lastSaved)}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Sélecteur d'éditeur */}
        <EditorSelector />
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center space-x-3">
        {/* Undo/Redo */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-8 w-8 p-0"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-8 w-8 p-0"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Preview */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          className="flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Aperçu</span>
        </Button>

        {/* Save */}
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Sauvegarder</span>
        </Button>

        {/* Share */}
        <Button
          size="sm"
          onClick={onShare}
          className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Partager</span>
        </Button>
      </div>
    </header>
  )
}
