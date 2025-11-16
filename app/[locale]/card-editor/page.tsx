import { locales } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionaries';
import { CardEditorClient } from './cardEditorClient';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Page({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const translations = await getDictionary(locale);
  
  return (
    <CardEditorClient
      locale={locale}
      translations={translations}
    />
  );
}