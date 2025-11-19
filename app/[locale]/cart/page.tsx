'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

/**
 * Redirection depuis l'ancienne route /cart vers /org/[slug]/cart
 * Détecte l'organisation depuis le localStorage du panier ou utilise xarala-solutions par défaut
 */
export default function CartRedirectPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string || 'fr'

  useEffect(() => {
    // Essayer de détecter l'organisation depuis le localStorage du panier
    let detectedSlug = 'xarala-solutions' // Défaut

    try {
      const cartData = localStorage.getItem('cart-storage')
      if (cartData) {
        const cart = JSON.parse(cartData)
        // Si le panier contient des items, on pourrait analyser leur organisation
        // Pour l'instant, on utilise le défaut
      }
    } catch (error) {
      console.error('Error reading cart from localStorage:', error)
    }

    // Rediriger vers la nouvelle route avec slug
    router.replace(`/${locale}/org/${detectedSlug}/cart`)
  }, [locale, router])

  // Afficher un loader pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers le panier...</p>
      </div>
    </div>
  )
}
