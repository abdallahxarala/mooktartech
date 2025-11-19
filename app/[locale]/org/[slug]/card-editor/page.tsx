import { redirect } from 'next/navigation'

interface CardEditorPageProps {
  params: {
    locale: string
    slug: string
  }
}

export const dynamic = 'force-dynamic'

// Rediriger vers NFC Editor (la bonne version)
export default function CardEditorPage({ params }: CardEditorPageProps) {
  redirect(`/${params.locale}/org/${params.slug}/nfc-editor`)
}

