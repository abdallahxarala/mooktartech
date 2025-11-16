import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard, type ExhibitorProduct } from "./ProductCard";

interface ExhibitorStorefrontProps {
  eventSlug: string;
  exhibitorSlug: string;
}

export function ExhibitorStorefront({ eventSlug, exhibitorSlug }: ExhibitorStorefrontProps) {
  const products: ExhibitorProduct[] = [
    {
      id: "product-1",
      name: "Badge NFC Premium",
      description: "Badge connecté pour networking instantané",
      price: 50000,
      currency: "XOF",
      featured: true,
      tags: ["NFC", "Networking"]
    },
    {
      id: "product-2",
      name: "Kit d'activation événementielle",
      description: "Pack complet pour engager vos visiteurs avec QR codes et analytics.",
      price: 120000,
      currency: "XOF",
      tags: ["Activation", "Marketing"]
    }
  ];

  return (
    <div className="container mx-auto flex flex-col gap-10 px-6">
      <section className="rounded-3xl bg-gradient-to-br from-orange-500 to-pink-600 p-10 text-white shadow-xl">
        <Badge variant="secondary" className="mb-4 w-fit bg-white/20 text-xs uppercase tracking-wide text-white">
          {eventSlug}
        </Badge>
        <h1 className="text-4xl font-black capitalize">{exhibitorSlug.replace(/-/g, " ")}</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/80">
          Bienvenue sur la boutique officielle de cet exposant. Découvrez ses offres, réservez un
          rendez-vous et téléchargez ses ressources exclusives.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90">
            Demander une démo
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Ajouter à mes favoris
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Produits & services</h2>
          <Button variant="ghost" asChild>
            <Link href={`/expo/${eventSlug}/${exhibitorSlug}#catalogue`}>Voir tous les produits</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={`/expo/${eventSlug}/${exhibitorSlug}/${product.id}`}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Contact</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <p>Email: contact@{exhibitorSlug}.com</p>
            <p>Téléphone: +221 77 123 45 67</p>
            <p>Stand: A12 · Hall Innovation</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Ressources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>• Catalogue PDF</p>
            <p>• Brochure de présentation</p>
            <p>• Études de cas</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

