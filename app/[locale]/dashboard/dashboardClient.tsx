'use client'

import React from 'react'

export default function DashboardClient() {
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in-up">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de bord</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
            <p className="text-gray-600">Vue d'ensemble des performances</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
            <p className="text-gray-600">Dernières activités</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <p className="text-gray-600">Alertes et notifications</p>
          </div>
        </div>
      </div>
    </div>
  )
}
