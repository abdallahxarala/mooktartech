import { redirect } from "next/navigation"
import { locales } from '@/i18n.config'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function CardDesignerPage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  redirect(`/${locale}/badge-editor/design`)
}
