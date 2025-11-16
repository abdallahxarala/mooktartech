import { redirect } from "next/navigation";
import { locales } from '@/i18n.config';

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default function BoutiquePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  redirect(`/${locale}/products`);
}