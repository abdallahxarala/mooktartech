import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ExhibitorProductDetail = dynamic(
  () => import("@/components/exhibitors/ProductCard").then((mod) => mod.ExhibitorProductDetail),
  { ssr: false }
);

interface ExhibitorProductPageProps {
  params: {
    eventSlug: string;
    exhibitorSlug: string;
    productId: string;
  };
}

export default function ExhibitorProductPage({ params }: ExhibitorProductPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <Suspense fallback={<Skeleton className="mx-auto h-[640px] w-full max-w-4xl" />}>
        <ExhibitorProductDetail
          eventSlug={params.eventSlug}
          exhibitorSlug={params.exhibitorSlug}
          productId={params.productId}
        />
      </Suspense>
    </div>
  );
}

