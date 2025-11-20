import { locales, type Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionaries';
import ModuleManager from '@/components/modules/module-manager';

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default async function ModulesPage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  const translations = await getDictionary(locale);
  
  return <ModuleManager />;
}