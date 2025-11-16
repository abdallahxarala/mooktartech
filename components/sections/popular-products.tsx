"use client";

import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useInView } from "react-intersection-observer";

const products = [
  {
    name: "Imprimante XS-2000 Pro",
    price: 799990,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80",
    bgColor: "purple" as const,
    href: "/products/printers/xs-2000-pro",
    category: "printers",
    description: "Imprimante de cartes professionnelle haute performance",
  },
  {
    name: "Cartes PVC Premium",
    price: 29990,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
    bgColor: "orange" as const,
    href: "/products/pvc-cards/premium",
    category: "cards",
    description: "Lot de 100 cartes PVC haute qualité",
  },
  {
    name: "Imprimante XS-1000",
    price: 499990,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80",
    bgColor: "purple" as const,
    href: "/products/printers/xs-1000",
    category: "printers",
    description: "Imprimante de cartes compacte et fiable",
  },
  {
    name: "Cartes PVC NFC",
    price: 39990,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
    bgColor: "orange" as const,
    href: "/products/pvc-cards/nfc",
    category: "cards",
    description: "Lot de 100 cartes PVC avec puce NFC",
  },
];

const categories = [
  { id: "all", label: "Tous" },
  { id: "printers", label: "Imprimantes" },
  { id: "cards", label: "Cartes" },
  { id: "readers", label: "Lecteurs" },
];

export function PopularProducts() {
  const { locale } = useParams();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="bg-gray-50 py-16 animate-fade-in-up" ref={ref}>
      <div className="container mx-auto px-4 animate-fade-in-up">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
            Nos Produits Populaires
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
            Découvrez notre sélection d'imprimantes et de cartes PVC professionnelles
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-8 animate-fade-in-up">
          <TabsList className="flex justify-center animate-fade-in-up">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-6 animate-fade-in-up"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
                {products
                  .filter(
                    (product) =>
                      category.id === "all" || product.category === category.id
                  )
                  .map((product, index) => (
                    <div key={product.name}>
                      <Link href={`/${locale}${product.href}`}>
                        <ProductCard {...product} />
                      </Link>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center mt-12 animate-fade-in-up">
          <Link href={`/${locale}/products`}>
            <Button 
              variant="outline" 
              className="group transform transition-all hover:scale-105 animate-fade-in-up"
            >
              Voir tous nos produits
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 animate-fade-in-up" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
