/**
 * Service d'intégration OpenAI pour génération de contenu avec GPT-4 Vision
 */

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GenerateDescriptionOptions {
  imageUrl: string
  productName?: string
  category?: string
  language?: 'fr' | 'en' | 'wo'
}

export interface SuggestCategoryOptions {
  imageUrl: string
  productName?: string
}

/**
 * Générer une description de produit à partir d'une image
 */
export async function generateProductDescription(
  options: GenerateDescriptionOptions
): Promise<string | null> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY non configurée')
    }

    const languagePrompt = {
      fr: 'Décris ce produit de manière attrayante pour un catalogue en français (3-4 phrases). Inclus les caractéristiques principales et les bénéfices pour le client.',
      en: 'Describe this product attractively for a catalog in English (3-4 sentences). Include main features and customer benefits.',
      wo: 'Waxal ci melokaan bi ci lu rafet ci français (3-4 jumtukaay). Yebal ay jëfandikoo ak ay jëfandikoo.',
    }

    const prompt = options.productName
      ? `${languagePrompt[options.language || 'fr']}\n\nNom du produit: ${options.productName}${
          options.category ? `\nCatégorie: ${options.category}` : ''
        }`
      : languagePrompt[options.language || 'fr']

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: { url: options.imageUrl },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || null
  } catch (error) {
    console.error('Error generating product description:', error)
    throw error
  }
}

/**
 * Suggérer une catégorie pour un produit à partir d'une image
 */
export async function suggestCategory(
  options: SuggestCategoryOptions
): Promise<string | null> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY non configurée')
    }

    const categories = [
      'Alimentation',
      'Artisanat',
      'Mode',
      'Électronique',
      'Cosmétiques',
      'Agriculture',
      'Services',
      'Technologie',
      'Immobilier',
      'Transport',
      'Éducation',
      'Santé',
      'Autre',
    ]

    const prompt = options.productName
      ? `Nom du produit: ${options.productName}\n\nChoisis UNE catégorie parmi : ${categories.join(', ')}`
      : `Choisis UNE catégorie parmi : ${categories.join(', ')}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Tu es un expert en catégorisation de produits. Réponds UNIQUEMENT avec le nom de la catégorie, sans explication.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: { url: options.imageUrl },
            },
          ],
        },
      ],
      max_tokens: 20,
      temperature: 0.3,
    })

    const suggestedCategory = response.choices[0]?.message?.content?.trim()

    // Vérifier que la catégorie suggérée est dans la liste
    const matchedCategory = categories.find(
      (cat) => cat.toLowerCase() === suggestedCategory?.toLowerCase()
    )

    return matchedCategory || suggestedCategory || null
  } catch (error) {
    console.error('Error suggesting category:', error)
    throw error
  }
}

/**
 * Générer des tags pour un produit
 */
export async function generateTags(
  imageUrl: string,
  productName?: string,
  description?: string
): Promise<string[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY non configurée')
    }

    const prompt = `Génère 3-5 tags pertinents pour ce produit${
      productName ? ` nommé "${productName}"` : ''
    }${description ? `\nDescription: ${description}` : ''}. Réponds uniquement avec les tags séparés par des virgules, sans explication.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    })

    const tagsString = response.choices[0]?.message?.content?.trim() || ''
    return tagsString
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 5)
  } catch (error) {
    console.error('Error generating tags:', error)
    return []
  }
}

