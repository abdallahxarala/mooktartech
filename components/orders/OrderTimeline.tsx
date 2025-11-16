'use client'

import { CheckCircle2, Clock, Package, Truck, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

type TimelineStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'

interface OrderTimelineProps {
  paymentStatus: PaymentStatus
  orderStatus: TimelineStatus
  updatedAt?: string
}

const steps = [
  {
    id: 'paid',
    title: 'Paiement confirmé',
    description: 'Votre règlement est validé.',
    icon: CheckCircle2
  },
  {
    id: 'processing',
    title: 'Préparation',
    description: 'Nos équipes préparent votre commande.',
    icon: Package
  },
  {
    id: 'shipped',
    title: 'Expédiée',
    description: 'Le colis est en cours d’acheminement.',
    icon: Truck
  },
  {
    id: 'delivered',
    title: 'Livrée',
    description: 'Commande réceptionnée, merci !',
    icon: Home
  }
] as const

export function OrderTimeline({ paymentStatus, orderStatus }: OrderTimelineProps) {
  const isPaid = paymentStatus === 'paid'
  const statusOrder: Record<string, number> = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
    cancelled: -1
  }

  const currentIndex = statusOrder[orderStatus] ?? 0

  return (
    <div className="relative">
      <div className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-orange-100 via-pink-100 to-orange-100" />
      <ul className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted =
            step.id === 'paid'
              ? isPaid
              : step.id === 'processing'
                ? isPaid && currentIndex >= 1
                : step.id === 'shipped'
                  ? isPaid && currentIndex >= 2
                  : isPaid && currentIndex >= 3

          const Icon = step.icon

          return (
            <li key={step.id} className="relative flex items-start gap-4 pl-12">
              <span
                className={cn(
                  'absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white shadow-sm',
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : index === 0 && !isPaid
                      ? 'border-amber-400 text-amber-500'
                      : 'border-gray-200 text-gray-400'
                )}
              >
                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </span>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.description}</p>
              </div>
            </li>
          )
        })}
        {orderStatus === 'cancelled' && (
          <li className="relative flex items-start gap-4 pl-12">
            <span className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-rose-500 bg-rose-500 text-white shadow-sm">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-rose-600">Commande annulée</h3>
              <p className="text-sm text-rose-500">
                Notre équipe reste disponible pour organiser un nouvel envoi.
              </p>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}

