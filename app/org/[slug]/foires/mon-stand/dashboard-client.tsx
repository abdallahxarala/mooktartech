/**
 * Client component pour le dashboard exposant
 */

'use client'

import { useEffect } from 'react'
import { useFoireStore } from '@/lib/store/foire-store'
import { useProducts } from '@/lib/hooks/use-products'
// Temporarily disabled - requires server component
// import { getExhibitorStats, getOrdersByExhibitor } from '@/lib/services/exhibitor-product.service'
import { StatsCards } from '@/components/exhibitor-dashboard/stats-cards'
import { ProductList } from '@/components/exhibitor-dashboard/product-list'
import { ProductForm } from '@/components/exhibitor-dashboard/product-form'
import { OrdersList } from '@/components/exhibitor-dashboard/orders-list'
import { Button } from '@/components/ui/button'
import { Plus, Package } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DashboardClientProps {
  organizationSlug: string
  organizationName: string
  exhibitorId: string
  eventId: string
  companyName: string
}

export function DashboardClient({
  organizationSlug,
  organizationName,
  exhibitorId,
  eventId,
  companyName,
}: DashboardClientProps) {
  const {
    stats,
    isLoadingStats,
    orders,
    isLoadingOrders,
    setExhibitor,
    setStats,
    setLoadingStats,
    setOrders,
    setLoadingOrders,
    openProductForm,
  } = useFoireStore()

  // Temporarily disabled - requires server component
  // const { products, isLoadingProducts } = useProducts(exhibitorId)
  const products: any[] = []
  const isLoadingProducts = false

  // Initialiser l'exposant dans le store
  useEffect(() => {
    setExhibitor(exhibitorId, eventId)
  }, [exhibitorId, eventId, setExhibitor])

  // Charger les stats - Temporarily disabled (requires server component)
  // useEffect(() => {
  //   const loadStats = async () => {
  //     setLoadingStats(true)
  //     const { stats: fetchedStats, error } = await getExhibitorStats(exhibitorId)
  //     if (!error && fetchedStats) {
  //       setStats(fetchedStats)
  //     }
  //     setLoadingStats(false)
  //   }

  //   if (exhibitorId) {
  //     loadStats()
  //   }
  // }, [exhibitorId, setStats, setLoadingStats])

  // Charger les commandes - Temporarily disabled (requires server component)
  // useEffect(() => {
  //   const loadOrders = async () => {
  //     setLoadingOrders(true)
  //     const { orders: fetchedOrders, error } = await getOrdersByExhibitor(exhibitorId)
  //     if (!error && fetchedOrders) {
  //       setOrders(fetchedOrders)
  //     }
  //     setLoadingOrders(false)
  //   }

  //   if (exhibitorId) {
  //     loadOrders()
  //   }
  // }, [exhibitorId, setOrders, setLoadingOrders])

  const handleUpdateOrder = async (orderId: string, status: string) => {
    // TODO: Implémenter la mise à jour de commande
    console.log('Update order:', orderId, status)
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-24">
      <div className="container mx-auto max-w-6xl px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
              Mon Stand
            </p>
            <h1 className="text-4xl font-black text-slate-900">{companyName}</h1>
            <p className="mt-2 text-sm text-slate-500">
              Gérez vos produits et commandes pour {organizationName}
            </p>
          </div>
          <Button
            onClick={() => openProductForm()}
            className="bg-orange-500 hover:bg-orange-600 h-12 px-6 text-base font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un produit
          </Button>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} isLoading={isLoadingStats} />

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produits ({products.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Commandes ({orders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <ProductList exhibitorId={exhibitorId} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <OrdersList
              orders={orders}
              isLoading={isLoadingOrders}
              onUpdateOrder={handleUpdateOrder}
            />
          </TabsContent>
        </Tabs>

        {/* Product Form Dialog */}
        <ProductForm exhibitorId={exhibitorId} />
      </div>
    </div>
  )
}

