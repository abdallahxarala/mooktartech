import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ExhibitorAnalytics = dynamic(
  () => import("@/components/exhibitors/ExhibitorAnalytics").then((mod) => mod.ExhibitorAnalytics),
  { ssr: false }
);

export default function ExhibitorAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analyse de visibilité</h1>
        <p className="text-slate-600">
          Suivez les interactions visiteurs, les scans QR et les produits les plus consultés.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[480px] w-full" />}>
        <ExhibitorAnalytics />
      </Suspense>
    </div>
  );
}

