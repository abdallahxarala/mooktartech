"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNFC } from "@/lib/hooks/use-nfc";
import { CaptureForm } from "@/components/leads/CaptureForm";
import {
  Smartphone,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  MapPin,
  Download,
  Share2,
  History,
} from "lucide-react";

interface NFCCardData {
  cardId: string;
  organizationId?: string | null;
  name: string;
  title: string;
  company: string;
  photo: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  format: string;
}

export function NFCReader() {
  const [cardData, setCardData] = useState<NFCCardData | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const { status, isScanning, error, history, startScanning } = useNFC({
    mode: "read",
    onReading: (message) => {
      // Parser les données de la carte
      const data = parseCardData(message);
      setCardData(data);
    },
  });

  const parseCardData = (message: any): NFCCardData => {
    // Simulation de parsing des données
    // Dans une vraie implémentation, cela dépendrait du format des données
    return {
      cardId: message?.records?.[0]?.cardId ?? "00000000-0000-0000-0000-000000000000",
      organizationId: message?.records?.[0]?.organizationId ?? null,
      name: "John Doe",
      title: "Directeur Marketing",
      company: "Xarala Solutions",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      phone: "+221 77 000 00 00",
      email: "john@xarala.co",
      website: "www.xarala.co",
      address: "Dakar, Sénégal",
      format: "vcard",
    };
  };

  const handleSave = async () => {
    if (!cardData) return;

    // Créer un contact
    const contact = new (window as any).Contact({
      name: [cardData.name],
      email: [cardData.email],
      tel: [cardData.phone],
      url: [cardData.website],
    });

    try {
      await contact.save();
      // Afficher une notification de succès
    } catch (err) {
      // Gérer l'erreur
    }
  };

  const handleShare = async () => {
    if (!cardData) return;

    try {
      await navigator.share({
        title: cardData.name,
        text: `${cardData.title} at ${cardData.company}`,
        url: cardData.website,
      });
    } catch (err) {
      // Gérer l'erreur
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="min-h-[200px]">
          {status === "unavailable" ? (
            <div key="unavailable" className="text-center space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  NFC non disponible sur cet appareil
                </AlertDescription>
              </Alert>
            </div>
          ) : !isScanning && !cardData ? (
            <div key="idle" className="text-center space-y-6">
              <h3 className="text-lg font-semibold">
                Lecture d'une carte NFC
              </h3>
              <Button
                onClick={startScanning}
                className="bg-primary-orange hover:bg-primary-orange/90"
              >
                Commencer la lecture
              </Button>
              {history.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowHistory(true)}
                >
                  <History className="h-4 w-4 mr-2" />
                  Historique ({history.length})
                </Button>
              )}
            </div>
          ) : isScanning && !cardData ? (
            <div key="scanning" className="text-center space-y-6">
              <div className="relative mx-auto w-24 h-24">
                <Smartphone className="w-full h-full text-gray-400" />
                <div className="absolute inset-0 border-2 border-primary-orange rounded-lg" />
              </div>
              <p className="font-medium">Recherche d'une carte NFC...</p>
              <p className="text-sm text-gray-600">
                Approchez votre téléphone de la carte NFC
              </p>
            </div>
          ) : cardData ? (
            <div key="success" className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={cardData.photo} />
                  <AvatarFallback>
                    {cardData.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{cardData.name}</h3>
                  <p className="text-sm text-gray-600">{cardData.title}</p>
                  <p className="text-sm text-gray-600">{cardData.company}</p>
                  <Badge variant="secondary" className="mt-2">
                    Format: {cardData.format}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{cardData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{cardData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="h-4 w-4" />
                  <span>{cardData.website}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{cardData.address}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  className="bg-primary-orange hover:bg-primary-orange/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <CaptureForm
                  cardId={cardData.cardId}
                  organizationId={cardData.organizationId ?? undefined}
                  trigger={
                    <Button variant="outline">
                      Échanger contacts
                    </Button>
                  }
                />
              </div>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setCardData(null);
                  startScanning();
                }}
              >
                Lire une autre carte
              </Button>
            </div>
          ) : error ? (
            <div key="error" className="text-center space-y-6">
              <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
              <p className="font-medium">Erreur de lecture</p>
              <p className="text-sm text-red-600">{error.message}</p>
              <Button
                onClick={() => {
                  setCardData(null);
                  startScanning();
                }}
                variant="outline"
              >
                Réessayer
              </Button>
            </div>
          ) : null}
        </div>

        {/* Historique des lectures */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Historique des lectures
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">Format: {item.format}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => setShowHistory(false)}
              >
                Fermer
              </Button>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}
