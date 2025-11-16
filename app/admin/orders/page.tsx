import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { fetchOrders, fetchOrderStats } from '@/lib/orders/queries'
import { OrdersTable } from '@/components/admin/OrdersTable'
import type { Database } from '@/lib/types/database.types'

async function ensureAdmin() {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle()

  if (profile?.role !== 'admin' && profile?.role !== 'moderator') {
    redirect('/')
  }
}

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  await ensureAdmin()
  const [orders, summary] = await Promise.all([fetchOrders({ limit: 200 }), fetchOrderStats()])

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-24">
      <div className="container mx-auto max-w-6xl px-6">
        <header className="mb-10 flex flex-col gap-2">
          <h1 className="text-4xl font-black text-slate-900">Commandes</h1>
          <p className="text-sm text-slate-500">
            Surveillez les ventes en temps réel, mettez à jour les statuts et exportez vos rapports en un clic.
          </p>
        </header>

        <OrdersTable
          orders={orders.map((order) => ({
            id: order.id,
            order_number: order.order_number,
            status: order.status,
            payment_status: order.payment_status,
            total: order.total,
            currency: order.currency,
            created_at: order.created_at,
            user: order.user
          }))}
          summary={summary}
        />
      </div>
    </div>
  )
}

