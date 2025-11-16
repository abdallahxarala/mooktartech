'use client'

import React from 'react'

export default function CartClient() {
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in-up">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Panier</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Votre panier est vide</p>
        </div>
      </div>
    </div>
  )
}
