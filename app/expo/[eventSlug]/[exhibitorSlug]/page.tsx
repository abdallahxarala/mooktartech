import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ExhibitorPublicStore = dynamic(
  () => import("@/components/exhibitors/ExhibitorStorefront").then((mod) => mod.ExhibitorStorefront),
  { ssr: false }
);

interface ExhibitorStorePageProps {
  params: {
    eventSlug: string;
    exhibitorSlug: string;
  };
}

export default function ExhibitorStorePage({ params }: ExhibitorStorePageProps) {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <Suspense fallback={<Skeleton className="mx-auto h-[720px] w-full max-w-5xl" />}>
        <ExhibitorPublicStore eventSlug={params.eventSlug} exhibitorSlug={params.exhibitorSlug} />
      </Suspense>
    </div>
  );
}

