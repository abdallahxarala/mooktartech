/**
 * Script de test pour OpenAI
 * Usage: node scripts/test-openai.js
 */

require('dotenv').config({ path: '.env.local' })

async function testOpenAI() {
  try {
    const { generateProductDescription, suggestCategory } = require('../lib/integrations/openai')

    console.log('🧪 Test OpenAI...\n')

    // Test avec une image exemple
    const testImageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'

    console.log('1. Test génération description...')
    const description = await generateProductDescription({
      imageUrl: testImageUrl,
      productName: 'Casque Audio Premium',
      language: 'fr',
    })
    console.log('✅ Description générée:', description?.substring(0, 100) + '...\n')

    console.log('2. Test suggestion catégorie...')
    const category = await suggestCategory({
      imageUrl: testImageUrl,
      productName: 'Casque Audio Premium',
    })
    console.log('✅ Catégorie suggérée:', category, '\n')

    console.log('✅ Tous les tests OpenAI sont passés!')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    if (error.message.includes('OPENAI_API_KEY')) {
      console.error('\n💡 Vérifiez que OPENAI_API_KEY est configurée dans .env.local')
    }
    process.exit(1)
  }
}

testOpenAI()

