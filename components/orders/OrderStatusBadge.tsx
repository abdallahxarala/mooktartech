'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-700 border-rose-200'
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  processing: 'En préparation',
  paid: 'Payée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée'
}

interface OrderStatusBadgeProps {
  status: string
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const key = status?.toLowerCase?.() ?? 'pending'
  const label = STATUS_LABELS[key] ?? status
  const colors = STATUS_COLORS[key] ?? STATUS_COLORS.pending

  return (
    <Badge
      variant="outline"
      className={cn(
        'uppercase tracking-wide',
        'border-2 font-semibold px-3 py-1 text-xs rounded-full',
        colors,
        className
      )}
    >
      {label}
    </Badge>
  )
}

