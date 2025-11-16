import { locales } from '@/i18n.config';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
    card: 'default'
  }));
}

export default function CardPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  redirect(`/${locale}/card-editor`);
}