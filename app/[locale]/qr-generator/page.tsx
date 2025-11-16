import { locales } from '@/i18n.config'
import { QrGeneratorClient } from './qrGeneratorClient'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function QrGeneratorPage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  return <QrGeneratorClient />
}

