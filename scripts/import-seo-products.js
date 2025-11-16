const fs = require('fs').promises
const path = require('path')

async function importSEOProducts() {
  console.log('📦 [IMPORT-SEO] Début importation produits optimisés SEO...')
  
  // Lire le fichier JSON
  const jsonPath = path.join(process.cwd(), 'data', 'products-seo-optimized.json')
  const jsonContent = await fs.readFile(jsonPath, 'utf-8')
  const data = JSON.parse(jsonContent)
  
  console.log(`✅ [IMPORT-SEO] ${data.products.length} produits chargés`)
  
  // Générer TypeScript pour import dans le store
  const tsCode = `
/**
 * PRODUITS OPTIMISÉS SEO - IMPORTATION AUTOMATIQUE
 * Générés depuis: products-seo-optimized.json
 * Date: ${new Date().toISOString()}
 */

export const SEO_OPTIMIZED_PRODUCTS = ${JSON.stringify(data.products, null, 2)}

export const PRODUCTS_METADATA = ${JSON.stringify(data.metadata, null, 2)}
`.trim()
  
  const tsPath = path.join(process.cwd(), 'lib', 'data', 'seo-products.ts')
  await fs.writeFile(tsPath, tsCode, 'utf-8')
  
  console.log('✅ [IMPORT-SEO] Fichier TypeScript créé:', tsPath)
  console.log('📊 [IMPORT-SEO] Statistiques:')
  console.log(`   - Total produits: ${data.metadata.totalProducts}`)
  console.log(`   - Marques: ${data.metadata.brands.join(', ')}`)
  console.log(`   - Prix: ${data.metadata.priceRange.min.toLocaleString()} - ${data.metadata.priceRange.max.toLocaleString()} ${data.metadata.priceRange.currency}`)
  console.log('✅ [IMPORT-SEO] === IMPORTATION TERMINÉE ===')
}

// Exécuter
importSEOProducts().catch(console.error)
