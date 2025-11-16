'use client'

import { useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { OrderDetails } from '@/lib/orders/queries'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'
import { OrderTimeline } from '@/components/orders/OrderTimeline'
import { InvoicePDF } from '@/components/orders/InvoicePDF'
import { calculateOrderTotals } from '@/lib/orders/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface OrderDetailsClientProps {
  initialOrder: OrderDetails['order']
  items: OrderDetails['items']
}

function formatCurrency(value: number, currency?: string | null) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency ?? 'XOF',
    maximumFractionDigits: 0
  }).format(value)
}

export function OrderDetailsClient({ initialOrder, items }: OrderDetailsClientProps) {
  const [order, setOrder] = useState(initialOrder)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    const channel = supabase
      .channel(`orders:${initialOrder.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${initialOrder.id}`
        },
        (payload) => {
          setOrder((prev) => ({
            ...prev,
            ...(payload.new as typeof prev)
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [initialOrder.id])

  const totals = useMemo(
    () => calculateOrderTotals({ order, items }),
    [order, items]
  )

  const shippingInfo = (order.shipping_address as any) ?? {}
  const statusLabel = order.status ?? 'pending'

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section className="space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
              Commande #{order.order_number ?? order.id.slice(0, 8).toUpperCase()}
            </p>
            <h2 className="text-3xl font-black text-slate-900">
              {formatCurrency(order.total ?? totals.total, order.currency)}
            </h2>
            <p className="text-sm text-slate-500">
              Créée le {new Date(order.created_at).toLocaleString('fr-FR')}
            </p>
          </div>
          <OrderStatusBadge status={statusLabel} className="text-sm" />
        </div>

        <Card className="border-none bg-gradient-to-br from-orange-50 to-pink-50 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Statut de votre commande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTimeline paymentStatus={order.payment_status ?? 'pending'} orderStatus={statusLabel as any} />
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Articles commandés</h3>
          <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-gray-50">
            {items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.product?.name ?? `Produit ${item.product_id}`}
                  </p>
                  <p className="text-sm text-slate-500">
                    Qté {item.quantity} · Prix unitaire {formatCurrency(item.price ?? 0, order.currency)}
                  </p>
                </div>
                <p className="text-base font-bold text-slate-900">
                  {formatCurrency((item.price ?? 0) * (item.quantity ?? 1), order.currency)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-900">Résumé</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-slate-500">
              <dt>Sous-total</dt>
              <dd className="font-semibold text-slate-900">
                {formatCurrency(totals.subtotal, order.currency)}
              </dd>
            </div>
            <div className="flex justify-between text-slate-500">
              <dt>TVA</dt>
              <dd className="font-semibold text-slate-900">
                {formatCurrency(totals.tax, order.currency)}
              </dd>
            </div>
            <div className="flex justify-between text-slate-500">
              <dt>Livraison</dt>
              <dd className="font-semibold text-slate-900">
                {formatCurrency(totals.shipping, order.currency)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4 text-base font-bold text-slate-900">
              <dt>Total</dt>
              <dd>{formatCurrency(totals.total, order.currency)}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <InvoicePDF order={order} items={items} totals={totals} />
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-900">Livraison</h3>
          <p className="text-sm text-slate-600">
            {shippingInfo.firstName && shippingInfo.lastName
              ? `${shippingInfo.firstName} ${shippingInfo.lastName}`
              : order.user?.full_name ?? 'Client'}
            <br />
            {shippingInfo.address ?? 'Adresse non fournie'}
            <br />
            {shippingInfo.city ?? 'Dakar'}
          </p>
          <p className="text-sm text-slate-500">
            Téléphone : {shippingInfo.phone ?? order.user?.phone ?? '—'}
          </p>
        </div>
      </aside>
    </div>
  )
}

