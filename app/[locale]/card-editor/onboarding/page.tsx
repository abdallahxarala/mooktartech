import { locales } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionaries';
import OnboardingClient from './onboardingClient';

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
    <OnboardingClient
      locale={locale}
      translations={translations}
    />
  );
}