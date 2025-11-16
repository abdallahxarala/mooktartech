"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import Link from "next/link";

type CheckoutStep = "information" | "shipping" | "payment" | "confirmation";

interface CheckoutConfirmationProps {
  onNext: (step: CheckoutStep) => void;
}

export function CheckoutConfirmation({ onNext }: CheckoutConfirmationProps) {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div
      className="text-center space-y-6 animate-fade-in-up"
    >
      <div
        className="flex justify-center animate-fade-in-up"
      >
        <CheckCircle className="h-16 w-16 text-green-500 animate-fade-in-up" />
      </div>

      <h2 className="text-2xl font-semibold animate-fade-in-up">Commande confirmée !</h2>
      <p className="text-gray-600 animate-fade-in-up">
        Merci pour votre commande. Vous recevrez un email de confirmation avec les détails de votre commande.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg text-left animate-fade-in-up">
        <h3 className="font-semibold mb-4 animate-fade-in-up">Informations de suivi</h3>
        <p className="text-gray-600 animate-fade-in-up">
          Numéro de commande: <span className="font-medium animate-fade-in-up">XAR-2024-001</span>
        </p>
        <p className="text-gray-600 animate-fade-in-up">
          Livraison estimée: <span className="font-medium animate-fade-in-up">3-5 jours ouvrés</span>
        </p>
      </div>

      

      <div className="space-y-4 animate-fade-in-up">
        <h3 className="font-semibold animate-fade-in-up">Vous pourriez aussi aimer</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
          {/* Suggestions de produits similaires */}
        </div>
      </div>

      <div className="flex justify-center space-x-4 pt-6 animate-fade-in-up">
        <Link href="/products">
          <Button variant="outline">Continuer vos achats</Button>
        </Link>
        <Link href="/dashboard">
          <Button className="bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up">
            Voir mes commandes
          </Button>
        </Link>
      </div>
    </div>
  );
}
