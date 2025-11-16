/**
 * Client component pour le dashboard admin de la foire
 */

'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FoireStats } from '@/components/foire-admin/foire-stats'
import { ExhibitorManagement } from '@/components/foire-admin/exhibitor-management'
import { VisitorManagement } from '@/components/foire-admin/visitor-management'
import { OrderManagement } from '@/components/foire-admin/order-management'
import { Building2, Users, ShoppingCart, BarChart3 } from 'lucide-react'

interface AdminClientProps {
  organizationSlug: string
  organizationName: string
  eventId: string
  eventName: string
}

export function AdminClient({
  organizationSlug,
  organizationName,
  eventId,
  eventName,
}: AdminClientProps) {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-24">
      <div className="container mx-auto max-w-7xl px-6 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
            Administration Foire
          </p>
          <h1 className="text-4xl font-black text-slate-900">{eventName}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Gérez les exposants, visiteurs et commandes de la foire
          </p>
        </div>

        {/* Stats KPIs */}
        <FoireStats eventId={eventId} />

        {/* Tabs */}
        <Tabs defaultValue="exhibitors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="exhibitors" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Exposants
            </TabsTrigger>
            <TabsTrigger value="visitors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Visiteurs
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Commandes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exhibitors" className="space-y-4">
            <ExhibitorManagement eventId={eventId} />
          </TabsContent>

          <TabsContent value="visitors" className="space-y-4">
            <VisitorManagement eventId={eventId} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <OrderManagement eventId={eventId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

