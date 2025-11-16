"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { useNFC, type NFCFormat } from "@/lib/hooks/use-nfc";
import {
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
} from "lucide-react";

const writeSteps = [
  {
    id: "prepare",
    title: "Préparation",
    description: "Assurez-vous que le NFC est activé sur votre appareil",
    icon: Shield,
  },
  {
    id: "approach",
    title: "Approchez la carte",
    description: "Placez votre appareil près de la carte NFC",
    icon: Smartphone,
  },
  {
    id: "write",
    title: "Écriture",
    description: "Maintenez l'appareil immobile pendant l'écriture",
    icon: Loader2,
  },
  {
    id: "verify",
    title: "Vérification",
    description: "Vérification de l'écriture des données",
    icon: CheckCircle,
  },
] as const;

export function NFCWriter() {
  const [selectedFormat, setSelectedFormat] = useState<NFCFormat>("text");
  const [data, setData] = useState("");
  const [currentStep, setCurrentStep] = useState<string>("prepare");
  const [progress, setProgress] = useState(0);

  const { status, writeData, error } = useNFC({
    mode: "write",
    onWriting: (status, error) => {
      if (status === "success") {
        setCurrentStep("verify");
        setProgress(100);
      } else {
        setCurrentStep("error");
      }
    },
  });

  useEffect(() => {
    if (currentStep === "write") {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(Math.min(currentProgress, 90));
        if (currentProgress >= 90) clearInterval(interval);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handleWrite = async () => {
    try {
      setCurrentStep("approach");
      await writeData(data, { format: selectedFormat });
    } catch (err) {
      setCurrentStep("error");
    }
  };

  const currentStepIndex = writeSteps.findIndex(step => step.id === currentStep);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        {/* Étapes d'écriture */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
            <div className="relative flex justify-between">
              {writeSteps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = step.id === currentStep;
                const Icon = step.icon;
                
                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center relative"
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white relative z-10 ${
                        isCompleted || isCurrent 
                          ? "border-primary-orange bg-primary-orange" 
                          : "border-gray-300"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${
                        isCompleted || isCurrent ? "text-white" : "text-gray-400"
                      }`} />
                    </div>
                    <span className={`mt-2 text-sm ${
                      isCurrent ? "text-primary-orange font-medium" : "text-gray-500"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Instructions et statut */}
        <div className="min-h-[200px]">
          {currentStep === "prepare" && (
            <div key="prepare" className="text-center space-y-4">
              {status === "unavailable" ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    NFC non disponible sur cet appareil
                  </AlertDescription>
                </Alert>
              ) : (
                <Button
                  onClick={handleWrite}
                  className="bg-primary-orange hover:bg-primary-orange/90"
                  disabled={!data || status !== "enabled"}
                >
                  Commencer l'écriture
                </Button>
              )}
            </div>
          )}

          {currentStep === "approach" && (
            <div key="approach" className="text-center space-y-4">
              <div className="relative mx-auto w-24 h-24">
                <Smartphone className="w-full h-full text-gray-400" />
                <div className="absolute inset-0 border-2 border-primary-orange rounded-lg" />
              </div>
              <p className="font-medium">Approchez votre appareil de la carte NFC</p>
            </div>
          )}

          {currentStep === "write" && (
            <div key="writing" className="text-center space-y-4">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary-orange" />
              <Progress value={progress} />
              <p className="font-medium">Écriture en cours...</p>
              <p className="text-sm text-gray-600">
                Ne déplacez pas votre appareil
              </p>
            </div>
          )}

          {currentStep === "verify" && (
            <div key="success" className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <p className="font-medium">Écriture réussie !</p>
              <p className="text-sm text-gray-600">
                Les données ont été écrites et vérifiées avec succès
              </p>
              <Button
                onClick={() => {
                  setCurrentStep("prepare");
                  setProgress(0);
                  setData("");
                }}
                variant="outline"
              >
                Écrire une autre carte
              </Button>
            </div>
          )}

          {currentStep === "error" && (
            <div key="error" className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
              <p className="font-medium">Erreur d'écriture</p>
              <p className="text-sm text-red-600">
                {error?.message || "Une erreur est survenue lors de l'écriture"}
              </p>
              <Button
                onClick={() => {
                  setCurrentStep("prepare");
                  setProgress(0);
                }}
                variant="outline"
              >
                Réessayer
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
