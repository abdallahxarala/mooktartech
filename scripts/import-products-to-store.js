const fs = require('fs').promises;
const path = require('path');

async function importProductsToStore() {
  console.log('📦 [IMPORT] Début de l\'importation...');
  
  // Lire les produits extraits
  const productsPath = path.join(process.cwd(), 'data', 'extracted-products.json');
  const productsJSON = await fs.readFile(productsPath, 'utf-8');
  const products = JSON.parse(productsJSON);
  
  console.log(`📊 [IMPORT] ${products.length} produits à importer`);
  
  // Générer le code TypeScript pour le store
  const storeCode = `
// PRODUITS IMPORTÉS AUTOMATIQUEMENT
// Source: extracted-products.json
// Date: ${new Date().toISOString()}

export const IMPORTED_PRODUCTS = ${JSON.stringify(products, null, 2)};
  `.trim();
  
  const storePath = path.join(process.cwd(), 'lib', 'data', 'imported-products.ts');
  await fs.writeFile(storePath, storeCode, 'utf-8');
  
  console.log('✅ [IMPORT] Fichier TypeScript créé');
  console.log('📁 [IMPORT] Chemin:', storePath);
  
  return products;
}

// Exécuter
importProductsToStore().then((products) => {
  console.log('✅ [IMPORT] Importation terminée !');
  console.log(`📦 [IMPORT] ${products.length} produits disponibles`);
});
