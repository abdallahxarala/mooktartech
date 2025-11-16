"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckoutStep } from "@/app/checkout/page";

const shippingMethods = [
  {
    id: "standard",
    name: "Standard",
    price: 9.99,
    duration: "3-5 jours ouvrés",
  },
  {
    id: "express",
    name: "Express",
    price: 19.99,
    duration: "1-2 jours ouvrés",
  },
  {
    id: "priority",
    name: "Prioritaire",
    price: 29.99,
    duration: "Livraison le lendemain",
  },
];

interface CheckoutShippingProps {
  onNext: (step: CheckoutStep) => void;
}

export function CheckoutShipping({ onNext }: CheckoutShippingProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Options de livraison</h2>
        
        <RadioGroup defaultValue="standard" className="space-y-4">
          {shippingMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center space-x-4 border rounded-lg p-4 cursor-pointer hover:border-primary-orange transition-colors"
            >
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.duration}</p>
                  </div>
                  <span className="font-semibold">{method.price}€</span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => onNext("information")}
        >
          Retour
        </Button>
        <Button
          className="bg-primary-orange hover:bg-primary-orange/90"
          onClick={() => onNext("payment")}
        >
          Continuer vers le paiement
        </Button>
      </div>
    </div>
  );
}
