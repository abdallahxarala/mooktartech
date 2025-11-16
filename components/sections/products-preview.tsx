'use client'

import { CreditCard, Smartphone, QrCode } from 'lucide-react'

/**
 * Section de prévisualisation des produits
 * Affiche les principales catégories de produits de Xarala Solutions
 */

const products = [
  {
    icon: CreditCard,
    title: "Cartes PVC",
    description: "Cartes d'identification professionnelles de haute qualité"
  },
  {
    icon: Smartphone,
    title: "Cartes NFC",
    description: "Technologie NFC pour l'interaction moderne"
  },
  {
    icon: QrCode,
    title: "QR Codes",
    description: "Codes QR personnalisés pour vos besoins"
  }
]

export default function ProductsPreview() {
  return (
    <section className="py-20 bg-gray-50 animate-fade-in-up">
      <div className="container mx-auto px-4 animate-fade-in-up">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            Solutions d'identification professionnelle
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 animate-fade-in-up">
            Découvrez notre gamme complète de produits pour répondre à tous vos besoins d'identification
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
            {products.map((product, index) => (
              <div
                key={product.title}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group animate-fade-in-up"
              >
                <div className="flex flex-col items-center text-center animate-fade-in-up">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors animate-fade-in-up">
                    <product.icon className="h-8 w-8 text-primary-600 animate-fade-in-up" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 animate-fade-in-up">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 animate-fade-in-up">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
