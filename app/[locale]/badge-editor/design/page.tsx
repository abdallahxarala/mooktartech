import { getDictionary } from '@/lib/dictionaries'
import { locales } from '@/i18n.config'
import { BadgeDesignClient } from './badgeDesignClient'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function BadgeDesignPage({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const translations = await getDictionary(locale)
  
  return (
    <BadgeDesignClient 
      locale={locale}
      translations={translations}
    />
  )
}
