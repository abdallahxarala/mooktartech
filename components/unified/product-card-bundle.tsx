"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePrice } from "@/lib/hooks/use-price";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCart, CreditCard } from "lucide-react";

interface ProductCardBundleProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    virtualCards: {
      name: string;
      design: string;
      color: string;
    }[];
    savings: number;
  };
}

export function ProductCardBundle({ product }: ProductCardBundleProps) {
  const { addItem } = useCartStore();
  const { formatted: price } = usePrice({ amount: product.price });
  const { formatted: savings } = usePrice({ amount: product.savings });

  return (
    <Card className="overflow-hidden animate-fade-in-up">
      <div>
        <div className="relative aspect-square animate-fade-in-up">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover animate-fade-in-up"
          />
          <div className="absolute top-2 right-2 bg-primary-orange text-white px-3 py-1 rounded-full text-sm font-medium animate-fade-in-up">
            Économisez {savings}
          </div>
        </div>

        <div className="p-4 animate-fade-in-up">
          <h3 className="font-semibold text-lg mb-2 animate-fade-in-up">{product.name}</h3>
          
          <div className="space-y-2 mb-4 animate-fade-in-up">
            {product.virtualCards.map((card, index) => (
              <div key={index} className="flex items-center gap-2 text-sm animate-fade-in-up">
                <CreditCard className="h-4 w-4 text-gray-500 animate-fade-in-up" />
                <span>{card.name}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4 animate-fade-in-up">
            <div>
              <p className="text-2xl font-bold animate-fade-in-up">{price}</p>
              <p className="text-sm text-gray-500 animate-fade-in-up">Au lieu de {usePrice({ 
                amount: product.price + product.savings 
              }).formatted}</p>
            </div>
          </div>

          <Button
            onClick={() => addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.image,
            })}
            className="w-full bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up"
          >
            <ShoppingCart className="h-4 w-4 mr-2 animate-fade-in-up" />
            Ajouter au panier
          </Button>
        </div>
      </div>
    </Card>
  );
}
