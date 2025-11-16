/**
 * Composant de statistiques KPIs pour le dashboard admin
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Ticket, TrendingUp, Users, Clock, AlertCircle } from 'lucide-react'
import { useRealtimeStats } from '@/lib/hooks/use-realtime-stats'
import { Loader2 } from 'lucide-react'

interface FoireStatsProps {
  eventId: string
}

export function FoireStats({ eventId }: FoireStatsProps) {
  const { stats, isLoading, error } = useRealtimeStats({ eventId })

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

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p>Erreur: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  const cards = [
    {
      title: 'Exposants inscrits',
      value: stats.exhibitors_count,
      subtitle: `${stats.exhibitors_approved} approuvés`,
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      trend: stats.exhibitors_pending > 0 ? `${stats.exhibitors_pending} en attente` : undefined,
    },
    {
      title: 'Tickets vendus',
      value: stats.tickets_sold,
      subtitle: `${stats.visitors_checked_in} présents`,
      icon: Ticket,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Revenus totaux',
      value: `${stats.total_revenue.toLocaleString()} XOF`,
      subtitle: 'Tous paiements confondus',
      icon: TrendingUp,
      color: 'from-orange-500 to-pink-500',
    },
    {
      title: 'Visiteurs présents',
      value: stats.visitors_present,
      subtitle: `${stats.visitors_checked_in} check-in effectués`,
      icon: Users,
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
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                  {card.trend && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-orange-600">{card.trend}</span>
                    </div>
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

