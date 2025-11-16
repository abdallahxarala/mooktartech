'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Phone, Mail, ArrowRight, Home } from 'lucide-react'

export default function OrderConfirmationPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-gray-100 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Commande confirmée !</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">Merci pour votre commande ! Notre équipe va vous contacter sous peu pour confirmer les détails de livraison.</p>
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 mb-8 border-2 border-orange-200">
              <div className="text-sm font-bold text-orange-600 mb-2">Numéro de commande</div>
              <div className="text-2xl font-black text-gray-900">#XAR-{Date.now().toString().slice(-8)}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 mb-8 text-left">
              <h2 className="text-xl font-black text-gray-900 mb-6 text-center">Prochaines étapes</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-black flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Confirmation par téléphone</div>
                    <div className="text-sm text-gray-600">Nous vous appelons dans l'heure pour confirmer votre commande</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-black flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Préparation de la commande</div>
                    <div className="text-sm text-gray-600">Votre commande est préparée avec soin dans nos locaux</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-black flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Livraison sous 24-48h</div>
                    <div className="text-sm text-gray-600">Réception à Dakar sous 24-48h, installation incluse</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="tel:+221775398139" className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg">
                <Phone className="w-5 h-5" />
                <span>Nous appeler</span>
              </a>
              <a href="mailto:contact@xarala-solutions.com" className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all">
                <Mail className="w-5 h-5" />
                <span>Nous écrire</span>
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fr" className="flex items-center justify-center gap-2 px-6 py-3 text-gray-600 hover:text-orange-500 font-semibold transition-colors">
                <Home className="w-5 h-5" />
                <span>Retour à l'accueil</span>
              </Link>
              <Link href="/fr/products" className="flex items-center justify-center gap-2 px-6 py-3 text-gray-600 hover:text-orange-500 font-semibold transition-colors">
                <Package className="w-5 h-5" />
                <span>Continuer mes achats</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


