import { locales } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionaries';
import { DashboardClient } from './dashboardClient';

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default async function Page({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const translations = await getDictionary(locale);
  
  return (
    <DashboardClient
      locale={locale}
      translations={translations}
    />
  );
}