/**
 * Composant de gestion des commandes
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShoppingCart, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'
import { useFoireAdmin } from '@/lib/hooks/use-foire-admin'
import { Loader2 } from 'lucide-react'

interface OrderManagementProps {
  eventId: string
}

export function OrderManagement({ eventId }: OrderManagementProps) {
  const {
    orders,
    isLoadingOrders,
    fetchOrders,
    updateOrderStatus,
  } = useFoireAdmin({ eventId })

  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders(statusFilter === 'all' ? undefined : statusFilter)
  }, [statusFilter, fetchOrders])

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'all') return true
    return order.status === statusFilter
  })

  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        )
      case 'accepted':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Acceptée
          </Badge>
        )
      case 'preparing':
        return (
          <Badge className="bg-orange-100 text-orange-800">
            En préparation
          </Badge>
        )
      case 'ready':
        return (
          <Badge className="bg-green-100 text-green-800">
            Prête
          </Badge>
        )
      case 'completed':
        return (
          <Badge className="bg-gray-100 text-gray-800">
            Terminée
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Alertes */}
      {pendingOrders > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Commandes en attente</AlertTitle>
          <AlertDescription>
            {pendingOrders} commande{pendingOrders > 1 ? 's' : ''} nécessite{pendingOrders > 1 ? 'nt' : ''} votre attention
          </AlertDescription>
        </Alert>
      )}

      {/* Timeline commandes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Gestion des commandes
            </CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="accepted">Acceptées</SelectItem>
                <SelectItem value="preparing">En préparation</SelectItem>
                <SelectItem value="ready">Prêtes</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingOrders ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucune commande trouvée
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-semibold">
                        {order.product_name || 'Produit'}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{order.customer_name || 'Client'}</div>
                          <div className="text-gray-500">{order.customer_email || ''}</div>
                        </div>
                      </TableCell>
                      <TableCell>{order.quantity || 0}</TableCell>
                      <TableCell className="font-semibold">
                        {order.total ? `${order.total.toLocaleString()} XOF` : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status || 'pending')}</TableCell>
                      <TableCell>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('fr-FR')
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accepter
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

