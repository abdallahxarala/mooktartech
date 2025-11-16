import { headers } from 'next/headers'
import { getTenantBySlug } from '@/lib/config/tenants'
import { TenantProvider } from '@/lib/contexts/tenant-context'
import { Toaster } from 'react-hot-toast'

export default async function XaralaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const tenantSlug = headersList.get('x-tenant-slug') || 'xarala'
  const tenant = getTenantBySlug(tenantSlug)
  
  return (
    <TenantProvider tenant={tenant}>
      <div className="min-h-screen">
        {children}
      </div>
      <Toaster position="top-right" />
    </TenantProvider>
  )
}

