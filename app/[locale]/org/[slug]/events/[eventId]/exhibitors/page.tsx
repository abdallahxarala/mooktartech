import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ExhibitorDashboardList = dynamic(
  () => import("@/components/exhibitors/ExhibitorDashboard").then((mod) => mod.ExhibitorDashboard),
  { ssr: false }
);

export default function ExhibitorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Exposants</h1>
        <p className="text-slate-600">
          Gérez les exposants, leurs produits et leur visibilité durant l&apos;événement.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ExhibitorDashboardList />
      </Suspense>
    </div>
  );
}

