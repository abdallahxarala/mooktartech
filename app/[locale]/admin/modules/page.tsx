import { locales } from '@/i18n.config';
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
  params: { locale: string }
}) {
  const translations = await getDictionary(locale);
  
  return <ModuleManager />;
}