import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductManager = dynamic(
  () => import("@/components/exhibitors/ProductForm").then((mod) => mod.ProductManager),
  { ssr: false }
);

export default function ExhibitorProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Produits & Services</h1>
        <p className="text-slate-600">
          Ajoutez, classez et mettez en avant les offres disponibles sur la marketplace de l&apos;événement.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[720px] w-full" />}>
        <ProductManager />
      </Suspense>
    </div>
  );
}

