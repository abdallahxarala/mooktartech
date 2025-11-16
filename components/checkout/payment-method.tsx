"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaymentProvider } from "@/lib/types/payment";
import { paymentProviders } from "@/lib/config/payment-providers";
import { AlertCircle, Loader2 } from "lucide-react";

interface PaymentMethodProps {
  amount: number;
  onPaymentComplete: () => void;
  onPaymentError: (error: string) => void;
}

export function PaymentMethod({
  amount,
  onPaymentComplete,
  onPaymentError,
}: PaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Simulation du processus de paiement
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() > 0.8) {
        throw new Error("Échec de la transaction. Veuillez réessayer.");
      }

      onPaymentComplete();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <RadioGroup
        value={selectedMethod?.id}
        onValueChange={(value) => {
          setSelectedMethod(paymentProviders.find((p) => p.id === value) || null);
          setError(null);
        }}
      >
        <div className="grid gap-4 animate-fade-in-up">
          {paymentProviders.map((provider) => (
            <div
              key={provider.id}
              className={`flex items-center space-x-4 border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMethod?.id === provider.id
                  ? "border-primary-orange bg-primary-orange/5"
                  : "hover:border-gray-400"
              }`}
            >
              <RadioGroupItem value={provider.id} id={provider.id} />
              <div className="flex-1 animate-fade-in-up">
                <Label htmlFor={provider.id} className="font-medium animate-fade-in-up">
                  {provider.name}
                </Label>
                <p className="text-sm text-gray-600 animate-fade-in-up">{provider.description}</p>
                <div className="mt-1 text-sm animate-fade-in-up">
                  <span className="text-gray-500 animate-fade-in-up">
                    Frais: {provider.fees}% • Délai: {provider.processingTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>

      
        {selectedMethod && (
          <div className="space-y-4 animate-fade-in-up">
            {["orange-money", "wave", "free-money"].includes(selectedMethod.id) && (
              <div className="space-y-2 animate-fade-in-up">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="77 000 00 00"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            )}

            {selectedMethod.id === "bank-transfer" && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 animate-fade-in-up">
                <p className="font-medium animate-fade-in-up">Informations bancaires</p>
                <p className="text-sm animate-fade-in-up">IBAN: SN12 3456 7890 1234 5678 9012</p>
                <p className="text-sm animate-fade-in-up">BIC: BICXXXXX</p>
                <p className="text-sm text-gray-600 animate-fade-in-up">
                  Veuillez inclure votre numéro de commande dans la référence du virement
                </p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 animate-fade-in-up" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="pt-4 animate-fade-in-up">
              <Button
                className="w-full bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isProcessing
                  ? "Traitement en cours..."
                  : `Payer ${amount.toFixed(2)}€`}
              </Button>
            </div>
          </div>
        )}
      
    </div>
  );
}
