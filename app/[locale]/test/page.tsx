'use client'

import React from 'react'
import toast from 'react-hot-toast'

export default function TestPage() {
  const testToast = () => {
    toast.success('✅ Test réussi !')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-8">
          Test du système de toasts
        </h1>
        <button
          onClick={testToast}
          className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl"
        >
          Tester les toasts
        </button>
      </div>
    </div>
  )
}
