"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePrice } from "@/lib/hooks/use-price";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCart, Package, Check } from "lucide-react";

interface CardCreatorUpsellProps {
  virtualCard: {
    name: string;
    design: string;
    color: string;
  };
}

const physicalCards = [
  {
    id: 1,
    name: "Carte NFC Standard",
    price: 19990,
    features: [
      "Compatible tous smartphones",
      "Design personnalisé",
      "Livraison standard",
    ],
  },
  {
    id: 2,
    name: "Carte NFC Premium",
    price: 29990,
    features: [
      "Matériau premium",
      "Design personnalisé",
      "Livraison express",
      "Garantie 2 ans",
    ],
    recommended: true,
  },
  {
    id: 3,
    name: "Pack Pro 3 Cartes",
    price: 79990,
    features: [
      "3 cartes NFC Premium",
      "Design personnalisé",
      "Livraison express",
      "Garantie 2 ans",
      "Support prioritaire",
    ],
  },
];

export function CardCreatorUpsell({ virtualCard }: CardCreatorUpsellProps) {
  const [showDialog, setShowDialog] = useState(false);
  const { addItem } = useCartStore();

  return (
    <>
      <Card className="p-6 bg-primary/5 border-primary/20 animate-fade-in-up">
        <div className="flex items-start gap-4 animate-fade-in-up">
          <div className="flex-1 animate-fade-in-up">
            <h3 className="font-semibold mb-2 animate-fade-in-up">
              Commandez votre carte physique
            </h3>
            <p className="text-sm text-gray-600 mb-4 animate-fade-in-up">
              Transformez votre carte virtuelle en carte NFC physique avec votre design personnalisé
            </p>
            <Button
              onClick={() => setShowDialog(true)}
              className="bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up"
            >
              <ShoppingCart className="h-4 w-4 mr-2 animate-fade-in-up" />
              Commander maintenant
            </Button>
          </div>
          <div className={`w-24 h-24 rounded-lg ${virtualCard.color}`} />
        </div>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-2xl animate-fade-in-up">
          <DialogHeader>
            <DialogTitle>Choisissez votre carte physique</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-3 mt-4 animate-fade-in-up">
            
              {physicalCards.map((card, index) => (
                <div
                  key={card.id}
                >
                  <Card className={`p-6 ${
                    card.recommended ? "border-primary-orange" : ""
                  }`}>
                    {card.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-orange text-white px-3 py-1 rounded-full text-sm animate-fade-in-up">
                        Recommandé
                      </div>
                    )}

                    <h3 className="font-semibold mb-2 animate-fade-in-up">{card.name}</h3>
                    <p className="text-2xl font-bold mb-4 animate-fade-in-up">
                      {usePrice({ amount: card.price }).formatted}
                    </p>

                    <ul className="space-y-2 mb-6 animate-fade-in-up">
                      {card.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm animate-fade-in-up">
                          <Check className="h-4 w-4 text-primary-orange animate-fade-in-up" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => {
                        addItem({
                          id: card.id,
                          name: card.name,
                          price: card.price,
                          quantity: 1,
                          image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
                        });
                        setShowDialog(false);
                      }}
                      className="w-full bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up"
                    >
                      <Package className="h-4 w-4 mr-2 animate-fade-in-up" />
                      Commander
                    </Button>
                  </Card>
                </div>
              ))}
            
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
