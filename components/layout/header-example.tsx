'use client'

import { useEffect } from 'react'
import Header from './header'
import { useAppStore } from '@/lib/store/useAppStore'

/**
 * Exemple d'utilisation du Header avec le store Zustand
 * Montre comment intégrer le header dans une page
 */
export default function HeaderExample() {
  const { addToCart, cartItemsCount } = useAppStore()

  // Exemple : ajouter des articles au panier pour tester
  useEffect(() => {
    // Simuler l'ajout d'articles au panier
    const sampleItems = [
      {
        id: '1',
        name: 'Carte PVC Standard',
        price: 1500,
        image: '/images/card-standard.jpg'
      },
      {
        id: '2', 
        name: 'Carte NFC Premium',
        price: 2500,
        image: '/images/card-nfc.jpg'
      }
    ]

    // Ajouter un article toutes les 3 secondes pour démonstration
    const interval = setInterval(() => {
      const randomItem = sampleItems[Math.floor(Math.random() * sampleItems.length)]
      addToCart(randomItem)
    }, 3000)

    return () => clearInterval(interval)
  }, [addToCart])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec toutes les fonctionnalités */}
      <Header />
      
      {/* Contenu de la page pour tester le scroll */}
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Exemple d'utilisation du Header
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Article {i + 1}
                </h3>
                <p className="text-gray-600 mb-4">
                  Description de l'article {i + 1}. Le header reste fixe en haut de la page
                  pendant le scroll.
                </p>
                <div className="text-sm text-gray-500">
                  Panier actuel : {cartItemsCount} articles
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Fonctionnalités du Header</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✅ Logo "Xarala Solutions" avec animation au hover</li>
              <li>✅ Navigation responsive (desktop + mobile)</li>
              <li>✅ Sélecteur de langue (Français, English, Wolof)</li>
              <li>✅ Icône panier avec badge de comptage</li>
              <li>✅ Authentification (connexion/déconnexion)</li>
              <li>✅ Menu utilisateur avec dropdown</li>
              <li>✅ Effet sticky avec ombre au scroll</li>
              <li>✅ Animations Framer Motion</li>
              <li>✅ Accessibilité (ARIA labels)</li>
              <li>✅ TypeScript strict</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
