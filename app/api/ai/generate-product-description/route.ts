/**
 * API Route pour générer des descriptions de produits avec OpenAI GPT-4 Vision
 */

import { NextResponse } from 'next/server'
import { generateProductDescription } from '@/lib/integrations/openai'

export async function POST(request: Request) {
  try {
    const { productName, images, category } = await request.json()

    if (!productName) {
      return NextResponse.json({ error: 'productName est requis' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY non configurée' },
        { status: 500 }
      )
    }

    // Utiliser le service OpenAI
    const firstImage = images && images.length > 0 ? images[0] : null

    if (!firstImage) {
      return NextResponse.json(
        { error: 'Au moins une image est requise pour la génération' },
        { status: 400 }
      )
    }

    const description = await generateProductDescription({
      imageUrl: firstImage,
      productName,
      category,
      language: 'fr',
    })

    if (!description) {
      return NextResponse.json(
        { error: 'Aucune description générée' },
        { status: 500 }
      )
    }

    return NextResponse.json({ description })
  } catch (error) {
    console.error('Error generating product description:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Erreur lors de la génération',
      },
      { status: 500 }
    )
  }
}

