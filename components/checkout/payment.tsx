"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckoutStep } from "@/app/checkout/page";
import { useCartStore } from "@/lib/store/cart";

const schema = z.object({
  cardNumber: z.string().min(16, "Numéro de carte invalide"),
  cardName: z.string().min(2, "Nom sur la carte requis"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Format MM/YY requis"),
  cvv: z.string().length(3, "CVV invalide"),
});

interface CheckoutPaymentProps {
  onNext: (step: CheckoutStep) => void;
}

export function CheckoutPayment({ onNext }: CheckoutPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { getTotal } = useCartStore();
  const shipping = 9.99;
  const tax = getTotal() * 0.2;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    onNext("confirmation");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Méthode de paiement</h2>
        
        <RadioGroup
          defaultValue="card"
          onValueChange={setPaymentMethod}
          className="space-y-4"
        >
          <div className="flex items-center space-x-4 border rounded-lg p-4">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card">Carte bancaire</Label>
          </div>
          <div className="flex items-center space-x-4 border rounded-lg p-4">
            <RadioGroupItem value="transfer" id="transfer" />
            <Label htmlFor="transfer">Virement bancaire</Label>
          </div>
          <div className="flex items-center space-x-4 border rounded-lg p-4">
            <RadioGroupItem value="mobile" id="mobile" />
            <Label htmlFor="mobile">Mobile money</Label>
          </div>
        </RadioGroup>
      </div>

      {paymentMethod === "card" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("cardNumber")}
              placeholder="Numéro de carte"
              className="w-full"
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardNumber.message as string}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("cardName")}
              placeholder="Nom sur la carte"
              className="w-full"
            />
            {errors.cardName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardName.message as string}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                {...register("expiry")}
                placeholder="MM/YY"
                className="w-full"
              />
              {errors.expiry && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.expiry.message as string}
                </p>
              )}
            </div>

            <div>
              <Input
                {...register("cvv")}
                type="password"
                placeholder="CVV"
                className="w-full"
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cvv.message as string}
                </p>
              )}
            </div>
          </div>
        </form>
      )}

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">Récapitulatif de la commande</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Sous-total</span>
            <span>{getTotal().toFixed(2)}€</span>
          </div>
          <div className="flex justify-between">
            <span>Livraison</span>
            <span>{shipping.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between">
            <span>TVA (20%)</span>
            <span>{tax.toFixed(2)}€</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{(getTotal() + shipping + tax).toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => onNext("shipping")}
        >
          Retour
        </Button>
        <Button
          type="submit"
          className="bg-primary-orange hover:bg-primary-orange/90"
          onClick={handleSubmit(onSubmit)}
        >
          Confirmer la commande
        </Button>
      </div>
    </div>
  );
}
