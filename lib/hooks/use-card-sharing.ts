"use client";

import { useState, useCallback } from "react";
import ShortUniqueId from "short-unique-id";
import { useToast } from "@/components/ui/use-toast";

interface ShareStats {
  whatsapp: number;
  telegram: number;
  facebook: number;
  email: number;
  sms: number;
  qrcode: number;
}

interface UseCardSharingReturn {
  shareUrl: string;
  qrCodeUrl: string;
  generateVCard: () => Promise<void>;
  downloadImage: () => Promise<void>;
  shareOffline: () => Promise<void>;
  shareStats: {
    data: ShareStats;
    increment: (platform: string) => Promise<void>;
  };
  isGenerating: boolean;
  error: string | null;
}

export function useCardSharing(cardId: string): UseCardSharingReturn {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ShareStats>({
    whatsapp: 0,
    telegram: 0,
    facebook: 0,
    email: 0,
    sms: 0,
    qrcode: 0,
  });

  // Générer un lien court unique
  const uid = new ShortUniqueId({ length: 8 });
  const shortId = uid.rnd();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://xarala.co";
  const shareUrl = `${baseUrl}/c/${shortId}`;
  const qrCodeUrl = `${baseUrl}/qr/${shortId}`;

  const generateVCard = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Simuler la génération de vCard
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dans une vraie implémentation :
      // 1. Récupérer les données de la carte depuis l'API
      // 2. Générer le format vCard
      // 3. Créer un blob et déclencher le téléchargement

      toast({
        title: "vCard générée",
        description: "La carte de contact a été téléchargée",
      });
    } catch (err) {
      setError("Erreur lors de la génération de la vCard");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer la vCard",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const downloadImage = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Simuler la génération d'image
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dans une vraie implémentation :
      // 1. Utiliser html2canvas pour capturer la carte
      // 2. Optimiser l'image pour la taille
      // 3. Ajouter le QR code
      // 4. Déclencher le téléchargement

      toast({
        title: "Image générée",
        description: "L'image de la carte a été téléchargée",
      });
    } catch (err) {
      setError("Erreur lors de la génération de l'image");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer l'image",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const shareOffline = useCallback(async () => {
    try {
      // Simuler la sauvegarde hors ligne
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dans une vraie implémentation :
      // 1. Compresser les données de la carte
      // 2. Stocker dans IndexedDB
      // 3. Créer un fichier de partage léger

      toast({
        title: "Sauvegarde réussie",
        description: "La carte est disponible hors ligne",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la carte",
      });
    }
  }, [toast]);

  const incrementStats = useCallback(async (platform: string) => {
    try {
      // Simuler la mise à jour des stats
      setStats((prev) => ({
        ...prev,
        [platform]: prev[platform as keyof ShareStats] + 1,
      }));

      // Dans une vraie implémentation :
      // Mettre à jour les stats dans la base de données
    } catch (err) {
      console.error("Erreur lors de la mise à jour des stats:", err);
    }
  }, []);

  return {
    shareUrl,
    qrCodeUrl,
    generateVCard,
    downloadImage,
    shareOffline,
    shareStats: {
      data: stats,
      increment: incrementStats,
    },
    isGenerating,
    error,
  };
}