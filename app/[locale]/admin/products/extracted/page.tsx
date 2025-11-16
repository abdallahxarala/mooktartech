'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Copy, Upload } from 'lucide-react'
import { useAppStore } from '@/lib/store/app-store'
import toast from 'react-hot-toast'

// Import direct des produits
const IMPORTED_PRODUCTS = [
  {
    id: 'entrust-sigma-dse',
    name: 'Entrust Sigma DSE',
    brand: 'Entrust',
    category: 'imprimantes',
    shortDescription: 'Imprimante de cartes direct-to-card pour besoins essentiels',
    price: 1850000,
    priceUnit: 'FCFA',
    stock: 3,
    featured: true,
    new: true,
    features: [
      'Impression recto simple face',
      'Résolution 300 dpi',
      'Jusqu\'à 185 cartes/heure',
      'Tableau de bord intuitif'
    ],
    applications: ['Cartes employés', 'Badges visiteurs'],
    pdfSource: 'Sigma_DSE_Datasheet_Draft_EMEA.pdf'
  },
  {
    id: 'datacard-cd800',
    name: 'Datacard CD800',
    brand: 'Datacard',
    category: 'imprimantes',
    shortDescription: 'Imprimante professionnelle haute vitesse',
    price: 2450000,
    priceUnit: 'FCFA',
    stock: 2,
    featured: true,
    new: false,
    features: [
      'Impression recto ou recto-verso',
      'Résolution jusqu\'à 300x1200 dpi',
      'Jusqu\'à 220 cartes/heure (couleur)',
      'Technologie TrueMatch™'
    ],
    applications: ['Cartes employés', 'Cartes étudiants'],
    pdfSource: 'Datacard_CD800_fr__1_.pdf'
  },
  {
    id: 'entrust-sigma-ds1',
    name: 'Entrust Sigma DS1',
    brand: 'Entrust',
    category: 'imprimantes',
    shortDescription: 'Imprimante directe sur carte ultra-conviviale',
    price: 1950000,
    priceUnit: 'FCFA',
    stock: 4,
    featured: true,
    new: true,
    features: [
      'Tableau de bord intuitif mobile',
      'Libre-service avec QR code',
      'Anneau lumineux LED',
      'Cassettes préchargées'
    ],
    applications: ['Cartes employés', 'Badges médicaux'],
    pdfSource: 'imprimante-de-cartes-badges-datacard-entrust-sigma-ds1.pdf'
  },
  {
    id: 'hiti-cs200e',
    name: 'HiTi CS-200e',
    brand: 'HiTi',
    category: 'imprimantes',
    shortDescription: 'Imprimante de badges compacte et silencieuse',
    price: 1650000,
    priceUnit: 'FCFA',
    stock: 5,
    featured: false,
    new: false,
    features: [
      'Impression haute vitesse',
      'Fonctionnement silencieux',
      'Interface intuitive',
      'Modules optionnels variés'
    ],
    applications: ['Cartes employés', 'Badges visiteurs'],
    pdfSource: 'CS200e_EN_A4.pdf'
  },
  {
    id: 'entrust-sigma-ds2',
    name: 'Entrust Sigma DS2',
    brand: 'Entrust',
    category: 'imprimantes',
    shortDescription: 'Imprimante directe sur carte recto-verso performante',
    price: 2650000,
    priceUnit: 'FCFA',
    stock: 2,
    featured: true,
    new: true,
    features: [
      'Impression recto ou recto-verso',
      'Jusqu\'à 225 cartes/heure (recto)',
      'Jusqu\'à 140 cartes/heure (duplex)',
      'Sécurité maximale'
    ],
    applications: ['Cartes employés', 'Identifications gouvernementales'],
    pdfSource: 'Sigma-DS2-Direct-to-Card-Printer-ds.pdf'
  },
  {
    id: 'entrust-sigma-ds3',
    name: 'Entrust Sigma DS3',
    brand: 'Entrust',
    category: 'imprimantes',
    shortDescription: 'Imprimante directe sur carte recto-verso haut de gamme',
    price: 2950000,
    priceUnit: 'FCFA',
    stock: 1,
    featured: true,
    new: true,
    features: [
      'Impression recto-verso ultra-rapide',
      'Jusqu\'à 250 cartes/heure (recto)',
      'Tableau de bord mobile',
      'Sécurité maximale'
    ],
    applications: ['Cartes employés', 'Cartes bancaires'],
    pdfSource: 'sigma-ds3-direct-to-card-printer-ds_fr.pdf'
  }
];

export default function ExtractedProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const addProduct = useAppStore(state => state.addProduct)

  const handleImportProduct = async (product: any) => {
    setLoading(true)
    const toastId = toast.loading('Import en cours...')

    try {
      // Convertir le format
      const newProduct = {
        id: product.id,
        name: product.name,
        slug: product.id,
        brand: product.brand,
        category: product.category,
        shortDescription: product.shortDescription,
        description: product.shortDescription,
        mainImage: '',
        images: [],
        price: product.price,
        priceUnit: product.priceUnit,
        stock: product.stock,
        featured: product.featured || false,
        new: product.new || false,
        specifications: {},
        features: product.features || [],
        options: [],
        tags: [],
        applications: product.applications || []
      }

      await addProduct(newProduct)
      toast.success('✅ Produit importé avec succès !', { id: toastId })
      
    } catch (error) {
      console.error('Erreur import:', error)
      toast.error('❌ Erreur lors de l\'import', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleImportAll = async () => {
    setLoading(true)
    const toastId = toast.loading(`Import de ${IMPORTED_PRODUCTS.length} produits...`)

    try {
      for (const product of IMPORTED_PRODUCTS) {
        await handleImportProduct(product)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      toast.success('✅ Tous les produits importés !', { id: toastId })
    } catch (error) {
      toast.error('❌ Erreur lors de l\'import', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

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
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Produits Extraits des PDFs
                </h1>
                <p className="text-gray-600 mt-1">
                  {IMPORTED_PRODUCTS.length} produits prêts à importer
                </p>
              </div>
            </div>

            <button
              onClick={handleImportAll}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              <span>Importer Tout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Système d'extraction prêt !
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {IMPORTED_PRODUCTS.length} produits ont été extraits des PDFs et sont prêts à être importés dans votre catalogue.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            {IMPORTED_PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-orange-500 transition-all"
              >
                <div className="text-4xl mb-4">📦</div>
                <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{product.shortDescription}</p>
                <div className="text-2xl font-bold text-orange-500">
                  {product.price.toLocaleString()} {product.priceUnit}
                </div>
                <button
                  onClick={() => handleImportProduct(product)}
                  disabled={loading}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>Importer</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
