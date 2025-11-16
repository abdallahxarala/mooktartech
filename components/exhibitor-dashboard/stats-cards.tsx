/**
 * Cartes de statistiques KPI
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Eye, ShoppingCart, TrendingUp } from 'lucide-react'
import type { ProductStats } from '@/lib/types/exhibitor-product'

interface StatsCardsProps {
  stats: ProductStats | null
  isLoading: boolean
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Produits en ligne',
      value: stats?.visible_products || 0,
      total: stats?.total_products || 0,
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Vues totales',
      value: stats?.total_views || 0,
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Commandes reçues',
      value: stats?.total_orders || 0,
      icon: ShoppingCart,
      color: 'from-orange-500 to-pink-500',
    },
    {
      title: 'Chiffre d\'affaires',
      value: `${(stats?.total_revenue || 0).toLocaleString()} XOF`,
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-500',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black text-gray-900">{card.value}</p>
                  {card.total !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      sur {card.total} produits
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

