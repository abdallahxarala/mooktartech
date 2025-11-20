import { locales, type Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionaries';
import AuthClient from './authClient';

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default async function Page({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  return <AuthClient />;
}