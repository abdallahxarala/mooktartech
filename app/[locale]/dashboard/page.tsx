import DashboardClient from './dashboardClient';

export const dynamic = 'force-dynamic';

export const revalidate = 0;

export default async function DashboardPage({
  params: { locale }
}: {
  params: { locale: 'fr' | 'en' | 'wo' }
}) {
  return <DashboardClient />;
}