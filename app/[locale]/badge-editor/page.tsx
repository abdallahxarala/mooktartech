import { redirect } from 'next/navigation'

export default function BadgeEditorRedirect({
  params: { locale }
}: {
  params: { locale: string }
}) {
  // Rediriger vers Badge Designer Pro par défaut
  redirect(`/${locale}/org/xarala-solutions/badge-editor/pro`)
}
