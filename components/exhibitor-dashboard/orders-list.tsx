/**
 * Liste des commandes reçues
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useFoireStore } from '@/lib/store/foire-store'
import { CheckCircle2, Package, ShoppingCart, Loader2 } from 'lucide-react'
import type { Order, OrderStatus } from '@/lib/types/exhibitor-product'

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Loader2,
  },
  accepted: {
    label: 'Acceptée',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle2,
  },
  preparing: {
    label: 'En préparation',
    color: 'bg-orange-100 text-orange-800',
    icon: Package,
  },
  ready: {
    label: 'Prête',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle2,
  },
  completed: {
    label: 'Terminée',
    color: 'bg-gray-100 text-gray-800',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Annulée',
    color: 'bg-red-100 text-red-800',
    icon: CheckCircle2,
  },
}

interface OrdersListProps {
  orders: Order[]
  isLoading: boolean
  onUpdateOrder?: (orderId: string, status: OrderStatus) => void
}

export function OrdersList({ orders, isLoading, onUpdateOrder }: OrdersListProps) {
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    onUpdateOrder?.(orderId, newStatus)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commandes reçues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4" />
              <p className="text-gray-600">Chargement des commandes...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commandes reçues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune commande pour le moment</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commandes reçues</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const status = statusConfig[order.status]
                const StatusIcon = status.icon

                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-semibold">{order.product_name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.customer_email}</div>
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell className="font-semibold">
                      {order.total.toLocaleString()} XOF
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accepter
                          </Button>
                        )}
                        {order.status === 'accepted' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'preparing')}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Préparer
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'ready')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Marquer prête
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

