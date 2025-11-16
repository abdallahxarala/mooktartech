import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ExhibitorForm = dynamic(
  () => import("@/components/exhibitors/ExhibitorForm").then((mod) => mod.ExhibitorForm),
  { ssr: false }
);

export default function NewExhibitorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Inscrire un exposant</h1>
        <p className="text-slate-600">
          Collectez les informations de l&apos;entreprise, définissez son stand et préparez sa boutique digitale.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[640px] w-full" />}>
        <ExhibitorForm />
      </Suspense>
    </div>
  );
}

