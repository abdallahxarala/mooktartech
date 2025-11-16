'use client'

import React from 'react'
import Link from 'next/link'
import { Smartphone, CreditCard, Sparkles, Zap } from 'lucide-react'

export function EditorsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-orange-200 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              Outils de création professionnels
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Créez vos cartes en quelques clics
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Deux éditeurs puissants pour tous vos besoins
          </p>
        </div>

        {/* Editors Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Éditeur NFC */}
          <div className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative p-8">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Smartphone className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Cartes Virtuelles NFC
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Créez votre carte de visite digitale personnalisée avec 
                4 designs professionnels, QR code et partage instantané.
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {[
                  'Création en 5 minutes',
                  '4 designs ultra-modernes',
                  'QR code intégré',
                  'Partage illimité',
                  'Statistiques en temps réel',
                  'Modification à volonté',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/fr/card-editor"
                className="group/btn inline-flex items-center gap-2 w-full justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
              >
                <span>Créer ma carte NFC</span>
                <Zap className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <p className="text-center text-sm text-gray-500 mt-4">
                Gratuit • Sans engagement
              </p>
            </div>
          </div>

          {/* Éditeur PVC */}
          <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            {/* Badge PRO */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
              PROFESSIONNEL
            </div>

            <div className="relative p-8">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <CreditCard className="w-10 h-10 text-gray-900" />
              </div>

              {/* Content */}
              <h3 className="text-3xl font-bold text-white mb-3">
                Cartes PVC Professionnelles
              </h3>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Éditeur avancé pour designer et imprimer vos badges 
                d'identification en série avec éléments de sécurité.
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {[
                  'Éditeur professionnel complet',
                  'Import Excel/CSV massif',
                  'Éléments de sécurité',
                  'Impression recto-verso',
                  'Templates prédéfinis',
                  'Export haute résolution',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-400 text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/fr/card-designer"
                className="group/btn inline-flex items-center gap-2 w-full justify-center px-6 py-4 bg-white text-gray-900 font-semibold rounded-2xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
              >
                <span>Accéder à l'éditeur PVC</span>
                <Zap className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <p className="text-center text-sm text-gray-400 mt-4">
                Pour entreprises • Devis sur demande
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
