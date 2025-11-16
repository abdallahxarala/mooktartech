import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ExhibitorOverview = dynamic(
  () => import("@/components/exhibitors/ExhibitorCard").then((mod) => mod.ExhibitorOverviewCard),
  { ssr: false }
);

export default function ExhibitorDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Tableau de bord exposant</h1>
        <p className="text-slate-600">
          Visualisez la performance globale, les produits mis en avant et les statistiques en temps réel.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-80 w-full" />}>
        <ExhibitorOverview />
      </Suspense>
    </div>
  );
}

