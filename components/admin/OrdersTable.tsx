'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'react-hot-toast'
import { Download, RefreshCw } from 'lucide-react'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type OrderSummary = {
  today: number
  week: number
  month: number
}

type OrderRecord = {
  id: string
  order_number: string | null
  status: string
  payment_status: string
  total: number
  currency: string | null
  created_at: string
  user?: {
    full_name?: string | null
    email?: string | null
  } | null
}

interface OrdersTableProps {
  orders: OrderRecord[]
  summary: OrderSummary
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En préparation' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' }
] as const

const DATE_FILTERS = [
  { value: 'all', label: 'Toutes les dates' },
  { value: '7', label: '7 derniers jours' },
  { value: '30', label: '30 derniers jours' },
  { value: '90', label: '90 derniers jours' }
] as const

function formatCurrency(amount: number, currency = 'XOF') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount)
}

export function OrdersTable({ orders, summary }: OrdersTableProps) {
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]['value']>('all')
  const [dateFilter, setDateFilter] = useState<(typeof DATE_FILTERS)[number]['value']>('all')
  const [search, setSearch] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [internalOrders, setInternalOrders] = useState<OrderRecord[]>(orders)

  const filteredOrders = useMemo(() => {
    const now = new Date()
    const dateLimit =
      dateFilter === 'all' ? null : new Date(now.getTime() - Number(dateFilter) * 24 * 60 * 60 * 1000)

    return internalOrders.filter((order) => {
      const matchesStatus =
        statusFilter === 'all' ? true : order.status.toLowerCase() === statusFilter
      const matchesDate =
        !dateLimit || new Date(order.created_at).getTime() >= dateLimit.getTime()
      const matchesSearch =
        !search ||
        order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(search.toLowerCase())

      return matchesStatus && matchesDate && matchesSearch
    })
  }, [internalOrders, statusFilter, dateFilter, search])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId)
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body?.message ?? 'Mise à jour impossible')
      }

      setInternalOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus
              }
            : order
        )
      )

      toast.success('Statut mis à jour')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message ?? 'Impossible de mettre à jour le statut')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const rows = [
        ['Order ID', 'Numéro', 'Client', 'Email', 'Statut', 'Paiement', 'Total', 'Date']
      ]

      filteredOrders.forEach((order) => {
        rows.push([
          order.id,
          order.order_number ?? '-',
          order.user?.full_name ?? '-',
          order.user?.email ?? '-',
          order.status,
          order.payment_status,
          formatCurrency(order.total, order.currency ?? 'XOF'),
          format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })
        ])
      })

      const csvContent = rows.map((cells) =>
        cells
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(',')
      ).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `orders-${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl md:grid-cols-3">
        {[
          { label: 'Chiffre du jour', value: summary.today },
          { label: '7 derniers jours', value: summary.week },
          { label: '30 derniers jours', value: summary.month }
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-500/10 to-pink-500/10 p-4"
          >
            <p className="text-sm font-semibold text-orange-500">{item.label}</p>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {formatCurrency(item.value)}
            </p>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <Input
          className="w-full max-w-xs"
          placeholder="Rechercher une commande..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as any)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            {DATE_FILTERS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="ml-auto inline-flex items-center gap-2"
          onClick={handleExport}
          disabled={isExporting || filteredOrders.length === 0}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {['Commande', 'Client', 'Montant', 'Statut', 'Paiement', 'Date', 'Actions'].map(
                (label) => (
                  <th
                    key={label}
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-gray-500"
                  >
                    {label}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                  Aucune commande ne correspond à votre recherche.
                </td>
              </tr>
            )}
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/60">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                  #{order.order_number ?? order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="font-medium text-gray-900">{order.user?.full_name ?? 'N/A'}</div>
                  <div className="text-xs text-gray-500">{order.user?.email ?? '—'}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                  {formatCurrency(order.total, order.currency ?? 'XOF')}
                </td>
                <td className="px-6 py-4 text-sm">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 text-sm">
                  <OrderStatusBadge status={order.payment_status} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {format(new Date(order.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                      disabled={updatingOrderId === order.id}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'text-gray-400 hover:text-orange-500',
                        updatingOrderId === order.id && 'animate-spin'
                      )}
                      disabled
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

