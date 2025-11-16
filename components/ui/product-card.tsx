"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePrice } from "@/lib/hooks/use-price";
import { useCartStore } from "@/lib/store/cart-store";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  bgColor: "orange" | "purple";
  productId?: string; // Optionnel : si fourni, utiliser celui-ci
}

export function ProductCard({ name, price, image, bgColor, productId }: ProductCardProps) {
  const { formatted } = usePrice({ amount: price });
  const { addItem } = useCartStore();

  // Générer un productId unique basé sur name+price si non fourni
  const uniqueProductId = productId || `product-${name.toLowerCase().replace(/\s+/g, '-')}-${price}`;

  return (
    <div>
      <Card className="overflow-hidden animate-fade-in-up">
        <div className={`aspect-square bg-${bgColor === "orange" ? "primary-orange" : "primary"}/10 relative`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover animate-fade-in-up"
          />
        </div>
        <div className="p-4 animate-fade-in-up">
          <h3 className="font-semibold mb-2 animate-fade-in-up">{name}</h3>
          <div className="flex items-center justify-between animate-fade-in-up">
            <span className="text-lg font-bold animate-fade-in-up">{formatted}</span>
            <Button
              size="sm"
              className="bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up"
              onClick={() =>
                addItem({
                  productId: uniqueProductId,
                  name,
                  price,
                  quantity: 1,
                  image,
                })
              }
            >
              <ShoppingCart className="h-4 w-4 mr-2 animate-fade-in-up" />
              Ajouter
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
