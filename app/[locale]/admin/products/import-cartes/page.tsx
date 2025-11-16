'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Package, Upload, CheckCircle, AlertCircle, Sparkles, Zap } from 'lucide-react'
import { useAppStore } from '@/lib/store/app-store'
import toast from 'react-hot-toast'

// Import direct des données (simulation de l'import JSON)
const cartesCollection = {
  "products": [
    {
      "id": "carte-pvc-blanche-cr80",
      "name": "Cartes PVC Blanches CR80",
      "slug": "carte-pvc-blanche-cr80",
      "brand": "Standard",
      "category": "cartes-pvc",
      "price": 50,
      "priceUnit": "FCFA/carte",
      "stock": 10000,
      "shortDescription": "Cartes blanches vierges format standard CR80. Qualité premium pour impression directe.",
      "description": "Cartes PVC blanches de haute qualité au format standard CR80 (85.6 x 54 mm), épaisseur 0.76mm (30 mil). Parfaites pour l'impression directe de badges, cartes d'accès, cartes de membre, etc.",
      "features": [
        "Format standard CR80 : 85.6 x 54 mm",
        "Épaisseur 0.76mm (30 mil)",
        "PVC blanc brillant haute qualité",
        "Compatible toutes imprimantes",
        "Surface optimisée pour impression directe",
        "Résistant à l'eau et aux UV",
        "Durée de vie : 3-5 ans"
      ],
      "featured": true,
      "new": false
    },
    {
      "id": "carte-pvc-preimprimee-badge",
      "name": "Cartes PVC Pré-imprimées Badge Photo",
      "slug": "carte-pvc-preimprimee-badge",
      "brand": "Premium",
      "category": "cartes-pvc",
      "price": 150,
      "priceUnit": "FCFA/carte",
      "stock": 5000,
      "shortDescription": "Cartes pré-imprimées avec zone photo et infos. Design professionnel personnalisé.",
      "description": "Cartes PVC pré-imprimées avec votre design personnalisé, incluant zone photo, logo entreprise, et champs d'information.",
      "features": [
        "Design 100% personnalisé",
        "Impression offset haute définition",
        "Recto-verso disponible",
        "Zone photo pré-définie",
        "Logo et charte graphique inclus",
        "Vernis de protection"
      ],
      "featured": true,
      "new": false
    },
    {
      "id": "carte-pvc-magnetique-hico",
      "name": "Cartes PVC avec Bande Magnétique HiCo",
      "slug": "carte-pvc-magnetique-hico",
      "brand": "HiCo",
      "category": "cartes-pvc",
      "price": 120,
      "priceUnit": "FCFA/carte",
      "stock": 3000,
      "shortDescription": "Cartes PVC avec piste magnétique haute coercivité. Pour systèmes d'accès sécurisés.",
      "description": "Cartes PVC blanches équipées d'une bande magnétique HiCo (haute coercivité 2750 Oe). Compatibles avec tous les systèmes de contrôle d'accès.",
      "features": [
        "Bande magnétique HiCo (2750 Oe)",
        "Haute résistance démagnétisation",
        "Norme ISO 7811 (Track 1, 2, 3)",
        "Encodage possible sur demande",
        "Durée de vie piste : 5+ ans"
      ],
      "featured": false,
      "new": false
    },
    {
      "id": "carte-pvc-rfid-125khz",
      "name": "Cartes PVC RFID 125 kHz (EM4100)",
      "slug": "carte-pvc-rfid-125khz",
      "brand": "EM4100",
      "category": "cartes-pvc",
      "price": 200,
      "priceUnit": "FCFA/carte",
      "stock": 2000,
      "shortDescription": "Cartes RFID 125 kHz lecture seule. Pour contrôle d'accès sans contact.",
      "description": "Cartes PVC avec puce RFID 125 kHz (EM4100/TK4100) en lecture seule. Technologie sans contact pour contrôle d'accès.",
      "features": [
        "Puce RFID 125 kHz (EM4100/TK4100)",
        "Lecture seule (Read-Only)",
        "Portée de lecture : 2 à 10 cm",
        "UID unique pré-enregistré",
        "Sans contact, sans batterie",
        "Durée de vie : 10+ ans"
      ],
      "featured": false,
      "new": false
    },
    {
      "id": "carte-pvc-mifare-classic-1k",
      "name": "Cartes PVC MIFARE Classic 1K (13.56 MHz)",
      "slug": "carte-pvc-mifare-classic-1k",
      "brand": "NXP MIFARE",
      "category": "cartes-pvc",
      "price": 350,
      "priceUnit": "FCFA/carte",
      "stock": 1500,
      "shortDescription": "Cartes MIFARE 13.56 MHz réinscriptibles 1Ko. Standard mondial NFC.",
      "description": "Cartes PVC avec puce NXP MIFARE Classic 1K, technologie sans contact 13.56 MHz. Mémoire de 1024 octets réinscriptible.",
      "features": [
        "Puce NXP MIFARE Classic 1K originale",
        "Fréquence 13.56 MHz (NFC)",
        "1024 octets mémoire réinscriptible",
        "Sécurité par clés crypto 48 bits",
        "Compatible NFC smartphones",
        "Durée de vie : 100 000 cycles"
      ],
      "featured": true,
      "new": false
    },
    {
      "id": "carte-pvc-double-techno",
      "name": "Cartes Double Technologie Mag + RFID",
      "slug": "carte-pvc-double-techno",
      "brand": "Hybrid",
      "category": "cartes-pvc",
      "price": 450,
      "priceUnit": "FCFA/carte",
      "stock": 1000,
      "shortDescription": "Cartes hybrides : bande magnétique + RFID 125kHz. Maximum compatibilité.",
      "description": "Cartes PVC combinant bande magnétique HiCo ET puce RFID 125 kHz. Solution idéale pour la transition.",
      "features": [
        "Bande magnétique HiCo 2750 Oe",
        "Puce RFID 125 kHz intégrée",
        "Double compatibilité",
        "Idéal phase de transition",
        "PVC renforcé"
      ],
      "featured": false,
      "new": true
    }
  ]
}

export default function ImportCartesPage() {
  const { products, addProduct } = useAppStore()
  const [importing, setImporting] = useState(false)
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set())
  const [forceUpdate, setForceUpdate] = useState(0)

  const cartesProducts = cartesCollection.products

  // Update when products change
  useEffect(() => {
    setForceUpdate(prev => prev + 1)
  }, [products])

  // Vérifier quels produits sont déjà importés
  const isImported = (productId: string) => {
    return products.some(p => p.id === productId) || importedIds.has(productId)
  }

  // Importer un produit
  const handleImportProduct = async (carte: any) => {
    if (isImported(carte.id)) {
      toast.error('Ce produit est déjà importé')
      return
    }

    try {
      const newProduct = {
        ...carte,
        images: [],
        mainImage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await addProduct(newProduct)
      setImportedIds(prev => new Set([...prev, carte.id]))
      toast.success(`${carte.name} importé avec succès !`)
    } catch (error) {
      console.error('Erreur import:', error)
      toast.error('Erreur lors de l\'importation')
    }
  }

  // Importer tous les produits
  const handleImportAll = async () => {
    setImporting(true)
    let importCount = 0

    for (const carte of cartesProducts) {
      if (!isImported(carte.id)) {
        try {
          const newProduct = {
            ...carte,
            images: [],
            mainImage: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          await addProduct(newProduct)
          setImportedIds(prev => new Set([...prev, carte.id]))
          importCount++
        } catch (error) {
          console.error('Erreur import:', error)
        }
      }
    }

    setImporting(false)
    if (importCount > 0) {
      toast.success(`${importCount} cartes importées avec succès !`)
    } else {
      toast.info('Toutes les cartes sont déjà importées')
    }
  }

  const notImportedCount = cartesProducts.filter(c => !isImported(c.id)).length
  const totalCartes = cartesProducts.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/fr/admin/products"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  Importer Cartes PVC
                </h1>
                <p className="text-gray-600">
                  Collection de {totalCartes} types de cartes professionnelles
                </p>
              </div>
            </div>

            <button
              onClick={handleImportAll}
              disabled={importing || notImportedCount === 0}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {importing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Import en cours...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Importer Tout ({notImportedCount})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-semibold text-gray-600">Total Cartes</span>
            </div>
            <div className="text-3xl font-black text-gray-900">{totalCartes}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-sm font-semibold text-gray-600">Importées</span>
            </div>
            <div className="text-3xl font-black text-gray-900">
              {totalCartes - notImportedCount}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-semibold text-gray-600">Restantes</span>
            </div>
            <div className="text-3xl font-black text-gray-900">{notImportedCount}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8" />
              <span className="text-sm font-semibold">Technologies</span>
            </div>
            <div className="text-3xl font-black">6 Types</div>
          </div>
        </div>

        {/* Liste des cartes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartesProducts.map((carte) => {
            const imported = isImported(carte.id)

            return (
              <div
                key={carte.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg transition-all ${
                  imported
                    ? 'border-2 border-green-500 opacity-60'
                    : 'border-2 border-gray-200 hover:border-orange-500 hover:shadow-xl'
                }`}
              >
                {/* Header */}
                <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                  {imported && (
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Importé</span>
                      </div>
                    </div>
                  )}

                  {carte.new && (
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Nouveau</span>
                      </div>
                    </div>
                  )}

                  <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
                    <Package className="w-10 h-10 text-blue-600" />
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-semibold text-blue-600 mb-1">
                      {carte.brand}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {carte.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {carte.shortDescription}
                  </p>

                  {/* Prix */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="text-2xl font-black text-gray-900">
                      {carte.price.toLocaleString()} <span className="text-sm font-normal text-gray-600">{carte.priceUnit}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Stock : {carte.stock.toLocaleString()} unités
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-500 mb-2">
                      Caractéristiques principales :
                    </div>
                    <div className="space-y-1">
                      {carte.features.slice(0, 3).map((feature: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <Zap className="w-3 h-3 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => handleImportProduct(carte)}
                    disabled={imported}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      imported
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg'
                    }`}
                  >
                    {imported ? 'Déjà importé' : 'Importer cette carte'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

