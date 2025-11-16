'use client'

import { useState } from 'react'
import { useCardDesignerStore, DEFAULT_VARIABLES } from '@/lib/store/card-designer-store'
import { Plus, X, Eye, EyeOff } from 'lucide-react'

interface VariablesPanelProps {
  canvasRef?: React.RefObject<{
    setPreviewMode: (enabled: boolean) => void
    setPreviewData: (data: Record<string, string>) => void
    getPreviewMode: () => boolean
  }>
}

export function VariablesPanel({ canvasRef }: VariablesPanelProps) {
  const { 
    currentProject,
    addVariable,
    removeVariable,
    updateVariable,
    initializeProjectVariables,
  } = useCardDesignerStore()

  const [localPreviewMode, setLocalPreviewMode] = useState(false)
  const [previewData, setPreviewData] = useState<Record<string, string>>({})

  const variables = currentProject?.variables || []

  const togglePreviewMode = () => {
    const newMode = !localPreviewMode
    setLocalPreviewMode(newMode)

    // Update canvas
    if (canvasRef?.current) {
      canvasRef.current.setPreviewMode(newMode)
    }
  }

  // Initialize if empty
  if (variables.length === 0) {
    return (
      <div className="p-4">
        <button
          onClick={initializeProjectVariables}
          className="w-full px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Initialize Default Variables
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Variables</h3>
        <button
          onClick={togglePreviewMode}
          className={`p-2 rounded transition-colors ${
            localPreviewMode
              ? "bg-primary-orange text-white"
              : "hover:bg-gray-100"
          }`}
          title={localPreviewMode ? "Disable Preview" : "Enable Preview"}
        >
          {localPreviewMode ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Variables List */}
      <div className="space-y-2">
        {variables.map((variable) => (
          <div
            key={variable.id}
            className="p-3 bg-gray-50 rounded-lg border space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-blue-600">
                {`{${variable.name}}`}
              </span>
              <button
                onClick={() => removeVariable(variable.id)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={previewData[variable.name] || variable.defaultValue || ""}
              onChange={(e) => {
                const newData = {
                  ...previewData,
                  [variable.name]: e.target.value,
                }
                setPreviewData(newData)

                // Update canvas
                if (canvasRef?.current && localPreviewMode) {
                  canvasRef.current.setPreviewData(newData)
                }
              }}
              placeholder={`Default: ${variable.defaultValue}`}
              className="w-full px-2 py-1 text-sm border rounded"
            />

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-0.5 bg-gray-200 rounded">
                {variable.type}
              </span>
              {variable.required && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded">
                  Required
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insert */}
      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-2">
          Use variables in text elements:
        </p>
        <div className="flex flex-wrap gap-2">
          {variables.map((variable) => (
            <button
              key={variable.id}
              onClick={() => {
                navigator.clipboard.writeText(`{${variable.name}}`)
                alert(`Copied {${variable.name}} to clipboard!`)
              }}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            >
              {`{${variable.name}}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

