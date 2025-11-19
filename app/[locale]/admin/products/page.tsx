import { redirect } from 'next/navigation'

export default function AdminProductsRedirect({
  params
}: {
  params: { locale: string }
}) {
  // Rediriger vers Xarala Solutions par défaut
  redirect(`/${params.locale}/org/xarala-solutions/admin/products`)
}
