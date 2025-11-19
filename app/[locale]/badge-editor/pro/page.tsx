import { redirect } from 'next/navigation'

export default function BadgeEditorRedirect({
  params: { locale }
}: {
  params: { locale: string }
}) {
  // Rediriger vers Xarala Solutions par défaut
  redirect(`/${locale}/org/xarala-solutions/badge-editor/pro`)
}
