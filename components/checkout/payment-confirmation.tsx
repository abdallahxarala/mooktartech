"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Download } from "lucide-react";
import Link from "next/link";

interface PaymentConfirmationProps {
  orderId: string;
  amount: number;
  customerEmail: string;
}

export function PaymentConfirmation({
  orderId,
  amount,
  customerEmail,
}: PaymentConfirmationProps) {
  useEffect(() => {
    // Envoyer un SMS de confirmation
    const sendSMS = async () => {
      // Intégration SMS à implémenter
    };

    // Envoyer un email de confirmation
    const sendEmail = async () => {
      // Intégration email à implémenter
    };

    sendSMS();
    sendEmail();
  }, []);

  return (
    <div className="max-w-lg mx-auto animate-fade-in-up">
      <div
        className="text-center space-y-4 animate-fade-in-up"
      >
        <div className="flex justify-center animate-fade-in-up">
          <CheckCircle className="h-16 w-16 text-green-500 animate-fade-in-up" />
        </div>
        <h2 className="text-2xl font-bold animate-fade-in-up">Paiement confirmé !</h2>
        <p className="text-gray-600 animate-fade-in-up">
          Merci pour votre commande. Un email de confirmation a été envoyé à{" "}
          {customerEmail}
        </p>
      </div>

      <Card className="mt-8 p-6 space-y-4 animate-fade-in-up">
        <div className="space-y-2 animate-fade-in-up">
          <p className="text-sm text-gray-600 animate-fade-in-up">Numéro de commande</p>
          <p className="font-medium animate-fade-in-up">{orderId}</p>
        </div>
        <div className="space-y-2 animate-fade-in-up">
          <p className="text-sm text-gray-600 animate-fade-in-up">Montant payé</p>
          <p className="font-medium animate-fade-in-up">{amount.toFixed(2)}€</p>
        </div>
        <Button className="w-full animate-fade-in-up" variant="outline">
          <Download className="h-4 w-4 mr-2 animate-fade-in-up" />
          Télécharger la facture
        </Button>
      </Card>

      <div className="mt-8 space-y-4 animate-fade-in-up">
        <Link href="/dashboard">
          <Button className="w-full bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up">
            Suivre ma commande
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" className="w-full animate-fade-in-up">
            Continuer mes achats
          </Button>
        </Link>
      </div>
    </div>
  );
}
