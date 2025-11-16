import { locales } from '@/i18n.config';

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default function CardEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}