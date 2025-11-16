"use client";

import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePrice } from "@/lib/hooks/use-price";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface RelatedProductsProps {
  category: string;
  currentProductId: number;
}

const relatedProducts = [
  {
    id: 2,
    name: "Imprimante XS-1000",
    price: 499990,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80",
    rating: 4.7,
    reviews: 89,
    stock: true,
  },
  {
    id: 3,
    name: "Imprimante XS-3000",
    price: 999990,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 156,
    stock: true,
  },
  {
    id: 4,
    name: "Imprimante XS-1500",
    price: 699990,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews: 67,
    stock: false,
  },
];

export function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const { locale } = useParams();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
      {relatedProducts
        .filter((product) => product.id !== currentProductId)
        .map((product, index) => {
          const { formatted: price } = usePrice({ amount: product.price });
          
          return (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm animate-fade-in-up"
            >
              <Link href={`/${locale}/products/${product.id}`}>
                <div className="relative aspect-square animate-fade-in-up">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover animate-fade-in-up"
                  />
                  {product.stock ? (
                    <Badge className="absolute top-2 right-2 bg-green-500 animate-fade-in-up">
                      En stock
                    </Badge>
                  ) : (
                    <Badge className="absolute top-2 right-2 bg-orange-500 animate-fade-in-up">
                      Sur commande
                    </Badge>
                  )}
                </div>

                <div className="p-4 animate-fade-in-up">
                  <h3 className="font-semibold mb-2 animate-fade-in-up">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-4 animate-fade-in-up">
                    <div className="flex items-center animate-fade-in-up">
                      <Star className="h-4 w-4 text-yellow-400 fill-current animate-fade-in-up" />
                      <span className="ml-1 text-sm animate-fade-in-up">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500 animate-fade-in-up">
                      ({product.reviews} avis)
                    </span>
                  </div>

                  <div className="flex items-center justify-between animate-fade-in-up">
                    <span className="text-lg font-bold text-primary-orange animate-fade-in-up">
                      {price}
                    </span>
                    <Button variant="ghost" size="sm">
                      Voir
                      <ArrowRight className="h-4 w-4 ml-2 animate-fade-in-up" />
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
    </div>
  );
}
