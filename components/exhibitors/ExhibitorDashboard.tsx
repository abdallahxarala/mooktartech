import { useMemo } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ExhibitorCard, type ExhibitorSummary } from "./ExhibitorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function ExhibitorDashboard() {
  const mockExhibitors = useMemo<ExhibitorSummary[]>(
    () => [
      {
        id: "demo-1",
        companyName: "Xarala Tech Lab",
        slug: "xarala-tech-lab",
        status: "approved",
        paymentStatus: "paid",
        boothNumber: "A12",
        boothLocation: "Hall Innovation",
        contactEmail: "contact@xarala.tech",
        contactPhone: "+221 77 000 00 00",
        website: "https://xarala.com",
        category: "Technologie",
        tags: ["SaaS", "Automatisation", "IA"]
      },
      {
        id: "demo-2",
        companyName: "Dakar Foodies",
        slug: "dakar-foodies",
        status: "pending",
        paymentStatus: "unpaid",
        boothNumber: "B07",
        contactEmail: "hello@dakarfoodies.sn",
        contactPhone: "+221 78 123 45 67",
        category: "Gastronomie",
        tags: ["Street-food", "Local"]
      }
    ],
    []
  );

  const basePath = "/org/demo/events/demo-event"; // remplacé lors de l'intégration serveur

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Rechercher un exposant par nom, catégorie ou stand..."
          className="max-w-xl"
        />
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`${basePath}/exhibitors/settings`}>Paramètres module</Link>
          </Button>
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link href={`${basePath}/exhibitors/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un exposant
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border border-dashed border-slate-300 bg-white/60">
        <CardContent className="space-y-2 px-6 py-4 text-sm text-slate-500">
          <p>
            Cette vue affichera la liste en temps réel des exposants inscrits pour l&apos;événement,
            avec filtres par statut, paiements et catégories. Les données sont actuellement simulées
            pour faciliter l&apos;intégration UI.
          </p>
          <p>
            Branchez les requêtes Supabase dans ce composant pour charger les vrais exposants et
            ajouter les actions de workflow (approbation, rejet, notifications, etc.).
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {mockExhibitors.map((exhibitor) => (
          <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} basePath={basePath} />
        ))}
      </div>
    </div>
  );
}

