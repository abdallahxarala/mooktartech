import { notFound } from 'next/navigation'
import { fetchOrderDetails } from '@/lib/orders/queries'
import { OrderDetailsClient } from './OrderDetailsClient'

interface OrderPageProps {
  params: {
    orderId: string
  }
}

export const dynamic = 'force-dynamic'

export default async function OrderPage({ params }: OrderPageProps) {
  const details = await fetchOrderDetails(params.orderId)

  if (!details) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-28">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900">Suivi de commande</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Retrouvez ici toutes les informations concernant votre commande, suivez le statut en
            temps réel et téléchargez votre facture en un clic.
          </p>
        </div>

        <OrderDetailsClient initialOrder={details.order} items={details.items} />
      </div>
    </div>
  )
}

