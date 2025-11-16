const fs = require('fs')
const path = require('path')

// Lire les données des cartes PVC
const cartesData = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), 'data/cartes-pvc-collection.json'),
    'utf-8'
  )
)

// Charger les produits existants depuis le store
const storePath = path.join(process.cwd(), 'lib/data/products.json')
let existingProducts = []

if (fs.existsSync(storePath)) {
  const storeData = JSON.parse(fs.readFileSync(storePath, 'utf-8'))
  existingProducts = storeData.products || []
}

// Ajouter les cartes PVC aux produits existants
const newProducts = cartesData.products.map(p => ({
  ...p,
  images: p.mainImage ? [p.mainImage] : [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}))

// Fusionner sans doublons
const existingIds = new Set(existingProducts.map(p => p.id))
const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id))

const allProducts = [...existingProducts, ...uniqueNewProducts]

// Enregistrer dans le store
const storeData = {
  products: allProducts
}

fs.writeFileSync(
  storePath,
  JSON.stringify(storeData, null, 2)
)

console.log(`✅ ${uniqueNewProducts.length} nouvelles cartes PVC importées`)
console.log(`📦 Total produits : ${allProducts.length}`)

// Afficher les produits importés
uniqueNewProducts.forEach(p => {
  console.log(`  - ${p.name} (${p.price} ${p.priceUnit})`)
})

