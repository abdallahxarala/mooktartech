import Link from "next/link";
import { Building2, Mail, MapPin, Phone, Store } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ExhibitorSummary = {
  id: string;
  companyName: string;
  slug: string;
  status: "pending" | "approved" | "active" | "rejected";
  paymentStatus: "unpaid" | "paid" | "refunded";
  boothNumber?: string | null;
  boothLocation?: string | null;
  contactEmail: string;
  contactPhone?: string | null;
  website?: string | null;
  category?: string | null;
  tags?: string[] | null;
};

interface ExhibitorCardProps {
  exhibitor: ExhibitorSummary;
  basePath: string;
}

export function ExhibitorCard({ exhibitor, basePath }: ExhibitorCardProps) {
  return (
    <Card className="flex flex-col border border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <Building2 className="h-5 w-5 text-orange-500" />
            {exhibitor.companyName}
          </CardTitle>
          <Badge variant={exhibitor.status === "active" ? "default" : "secondary"}>
            {exhibitor.status}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Mail className="h-4 w-4" />
          <span>{exhibitor.contactEmail}</span>
          {exhibitor.contactPhone && (
            <>
              <span>•</span>
              <Phone className="h-4 w-4" />
              <span>{exhibitor.contactPhone}</span>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Store className="h-4 w-4" />
          <span>{`${basePath}/exhibitors/${exhibitor.id}`}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          {exhibitor.boothLocation ? (
            <span>
              Stand {exhibitor.boothNumber ?? "?"} · {exhibitor.boothLocation}
            </span>
          ) : (
            <span>Stand à confirmer</span>
          )}
        </div>
        {exhibitor.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {exhibitor.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="mt-auto flex flex-wrap gap-2">
        <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600">
          <Link href={`${basePath}/exhibitors/${exhibitor.id}`}>Voir le dashboard</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`${basePath}/exhibitors/${exhibitor.id}/products`}>Produits</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`${basePath}/exhibitors/${exhibitor.id}/analytics`}>Analytics</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ExhibitorOverviewCard() {
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-slate-900">
          Aperçu exposant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-slate-600">
        <p>
          Cette vue présentera prochainement les métriques clés de l&apos;exposant : nombre de scans,
          ventes estimées, produits vedettes et interactions visiteurs.
        </p>
        <p>
          Connectez le module d&apos;analytics pour afficher des graphiques détaillés et des
          recommandations alimentées par l&apos;IA.
        </p>
      </CardContent>
    </Card>
  );
}

