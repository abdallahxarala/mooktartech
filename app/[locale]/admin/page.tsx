import { redirect } from 'next/navigation'

export default function AdminRedirect({
  params: { locale }
}: {
  params: { locale: string }
}) {
  // Rediriger vers Xarala Solutions par défaut
  redirect(`/${locale}/org/xarala-solutions/admin`)
}
