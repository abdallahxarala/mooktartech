/**
 * Hook pour générer des descriptions de produits avec OpenAI GPT-4 Vision
 */

'use client'

import { useState, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import type { GenerateDescriptionParams } from '@/lib/types/exhibitor-product'

export interface UseProductAIReturn {
  generateDescription: (params: GenerateDescriptionParams) => Promise<string | null>
  isGenerating: boolean
  error: string | null
}

export function useProductAI(): UseProductAIReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const generateDescription = useCallback(
    async (params: GenerateDescriptionParams): Promise<string | null> => {
      setIsGenerating(true)
      setError(null)

      try {
        const response = await fetch('/api/ai/generate-product-description', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productName: params.productName,
            images: params.images,
            category: params.category,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
          throw new Error(errorData.error || 'Erreur lors de la génération')
        }

        const data = await response.json()
        setIsGenerating(false)
        return data.description || null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
        setError(errorMessage)
        setIsGenerating(false)
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: `Impossible de générer la description: ${errorMessage}`,
        })
        return null
      }
    },
    [toast]
  )

  return {
    generateDescription,
    isGenerating,
    error,
  }
}

