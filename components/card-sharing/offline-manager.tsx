"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Wifi, WifiOff, Upload, AlertCircle } from "lucide-react";

interface OfflineManagerProps {
  cardId: string;
}

export function OfflineManager({ cardId }: OfflineManagerProps) {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingShares, setPendingShares] = useState<any[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Surveiller l'état de la connexion
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncPendingShares = async () => {
    if (!isOnline || pendingShares.length === 0) return;

    setIsSyncing(true);
    setSyncProgress(0);

    try {
      for (let i = 0; i < pendingShares.length; i++) {
        // Simuler la synchronisation
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSyncProgress(((i + 1) / pendingShares.length) * 100);
      }

      setPendingShares([]);
      toast({
        title: "Synchronisation terminée",
        description: "Toutes les données ont été synchronisées",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur de synchronisation",
        description: "Certaines données n'ont pas pu être synchronisées",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOnline) {
    return (
      <Alert>
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          Mode hors ligne actif - Les partages seront synchronisés une fois la connexion rétablie
        </AlertDescription>
      </Alert>
    );
  }

  if (pendingShares.length > 0) {
    return (
      <div className="space-y-4">
        <Alert>
          <Upload className="h-4 w-4" />
          <AlertDescription>
            {pendingShares.length} partages en attente de synchronisation
          </AlertDescription>
        </Alert>

        {isSyncing && <Progress value={syncProgress} />}

        <Button
          onClick={syncPendingShares}
          disabled={isSyncing}
          className="w-full"
        >
          {isSyncing ? "Synchronisation..." : "Synchroniser maintenant"}
        </Button>
      </div>
    );
  }

  return null;
}
