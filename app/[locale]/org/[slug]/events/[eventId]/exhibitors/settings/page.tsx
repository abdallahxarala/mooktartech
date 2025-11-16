import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ExhibitorSettings = dynamic(
  () => import("@/components/exhibitors/ExhibitorForm").then((mod) => mod.ExhibitorSettings),
  { ssr: false }
);

export default function ExhibitorSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Paramètres du module exposants</h1>
        <p className="text-slate-600">
          Configurez les options d&apos;inscription, de paiement et les contrôles d&apos;accès pour les exposants.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[560px] w-full" />}>
        <ExhibitorSettings />
      </Suspense>
    </div>
  );
}

