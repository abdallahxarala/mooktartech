'use server'

import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export interface ImageGenerationParams {
  prompt: string
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:4'
  model?: 'flux-pro' | 'flux-dev' | 'sdxl'
}

export async function generateProductImage(params: ImageGenerationParams) {
  const { prompt, aspectRatio = '4:3', model = 'flux-pro' } = params

  try {
    const output = await replicate.run(
      "black-forest-labs/flux-pro",
      {
        input: {
          prompt: `Professional product photography: ${prompt}. Studio lighting, white background, high resolution, commercial photography, 8K, sharp focus, professional color grading`,
          aspect_ratio: aspectRatio,
          output_format: "jpg",
          output_quality: 95,
        }
      }
    )

    return output as string
  } catch (error) {
    console.error('Error generating image:', error)
    throw new Error('Failed to generate image')
  }
}

// Génération en batch
export async function generateAllProductImages() {
  const PRODUCT_IMAGE_PROMPTS = {
    'entrust-sd260': 'Entrust Datacard SD260 card printer, professional ID card printer machine, side view on white background, studio photography',
    'entrust-sd360': 'Entrust Datacard SD360 dual-sided card printer, modern office equipment, professional product shot',
    'entrust-sd460': 'Entrust Datacard SD460 industrial card printer, large professional printer, high-end commercial equipment',
    'carte-pvc-blanche': 'Stack of blank white PVC cards, CR80 standard size, clean white background, professional product photography',
    'carte-magnetique-hico': 'PVC card with magnetic stripe, professional ID badge, black magnetic stripe visible, studio lighting',
    'carte-puce-contact': 'Smart card with contact chip visible, gold chip contacts, professional close-up photography',
    'carte-rfid-mifare': 'RFID access card, modern design, contactless technology, professional product shot',
    'carte-nfc': 'NFC card with phone icon, modern digital business card, clean minimal design, white background',
  }

  const results: Record<string, string> = {}

  for (const [productId, prompt] of Object.entries(PRODUCT_IMAGE_PROMPTS)) {
    try {
      console.log(`Generating image for ${productId}...`)
      const imageUrl = await generateProductImage({ prompt })
      results[productId] = imageUrl
      console.log(`✓ Generated: ${productId}`)
      
      // Délai pour éviter rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`✗ Failed: ${productId}`, error)
    }
  }

  return results
}
