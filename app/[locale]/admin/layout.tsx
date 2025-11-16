'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, LogOut } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-black">Admin</h1>
          <p className="text-gray-400 text-sm">Xarala Solutions</p>
        </div>

        <nav className="px-4 space-y-2">
          <Link
            href="/fr/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === '/fr/admin'
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Tableau de bord</span>
          </Link>

          <Link
            href="/fr/admin/products"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname.includes('/admin/products')
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Produits</span>
          </Link>

          <Link
            href="/fr"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Retour au site</span>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  )
}