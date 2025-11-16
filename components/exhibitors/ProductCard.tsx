import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type ExhibitorProduct = {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
  featured?: boolean;
  featuredImage?: string | null;
  images?: string[] | null;
  tags?: string[] | null;
};

interface ProductCardProps {
  product: ExhibitorProduct;
  href: string;
}

export function ProductCard({ product, href }: ProductCardProps) {
  return (
    <Card className="flex flex-col border border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {product.featuredImage ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image
            src={product.featuredImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 320px, 100vw"
          />
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-t-lg bg-slate-100 text-slate-400">
          <ShoppingBag className="h-10 w-10" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-lg font-semibold text-slate-900">
          {product.name}
          {product.featured ? (
            <Badge className="bg-orange-500">
              <Star className="mr-1 h-4 w-4" />
              Vedette
            </Badge>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 text-sm text-slate-600">
        <p className="line-clamp-3">{product.description ?? "Description à venir."}</p>
        {product.price ? (
          <div className="text-lg font-semibold text-slate-900">
            {Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: product.currency ?? "XOF"
            }).format(product.price)}
          </div>
        ) : null}
        {product.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild size="sm">
          <Link href={href}>Voir le détail</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`${href}?mode=edit`}>Modifier</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

interface ExhibitorProductDetailProps {
  eventSlug: string;
  exhibitorSlug: string;
  productId: string;
}

export function ExhibitorProductDetail({
  eventSlug,
  exhibitorSlug,
  productId
}: ExhibitorProductDetailProps) {
  return (
    <Card className="mx-auto max-w-4xl border border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-slate-900">Produit #{productId}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-slate-600">
        <p>
          Cette page présentera la fiche complète du produit sélectionné de l&apos;exposant{" "}
          <strong>{exhibitorSlug}</strong> pour l&apos;événement <strong>{eventSlug}</strong>.
        </p>
        <p>
          Ajoutez ici la galerie d&apos;images, la description longue, les options de variantes et les boutons d&apos;action
          (prise de contact, ajout à un panier de prospection, etc.).
        </p>
        <Separator />
        <p className="text-sm text-slate-500">
          Les données affichées sont simulées pour l&apos;instant. Connectez cette page aux tables
          `exhibitor_products` et `exhibitor_interactions` pour suivre l&apos;engagement.
        </p>
      </CardContent>
    </Card>
  );
}

