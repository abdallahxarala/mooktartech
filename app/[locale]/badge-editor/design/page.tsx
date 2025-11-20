import { getDictionary } from '@/lib/dictionaries'
import { locales, type Locale } from '@/i18n.config'
import { BadgeDesignClient } from './badgeDesignClient'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function BadgeDesignPage({ 
  params: { locale } 
}: { 
  params: { locale: Locale } 
}) {
  const translations = await getDictionary(locale)
  
  return (
    <BadgeDesignClient 
      locale={locale}
      translations={translations}
    />
  )
}
