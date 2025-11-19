import { redirect } from 'next/navigation'

export default function CardEditorRedirect({
  params: { locale }
}: {
  params: { locale: string }
}) {
  // Rediriger vers NFC Editor (la bonne version)
  redirect(`/${locale}/org/xarala-solutions/nfc-editor`)
}
