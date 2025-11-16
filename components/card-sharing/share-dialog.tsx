"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useCardSharing } from "@/lib/hooks/use-card-sharing";
import {
  WhatsappShareButton,
  TelegramShareButton,
  FacebookShareButton,
  EmailShareButton,
  WhatsappIcon,
  TelegramIcon,
  FacebookIcon,
  EmailIcon,
} from "react-share";
import {
  Copy,
  Download,
  QrCode,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Link as LinkIcon,
} from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardId: string;
  cardName: string;
  cardImage: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  cardId,
  cardName,
  cardImage,
}: ShareDialogProps) {
  const { toast } = useToast();
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const {
    shareUrl,
    qrCodeUrl,
    generateVCard,
    downloadImage,
    shareOffline,
    shareStats,
    isGenerating,
    error,
  } = useCardSharing(cardId);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans le presse-papier",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le lien",
      });
    }
  };

  const handleShare = async (platform: string) => {
    // Mettre à jour les statistiques de partage
    await shareStats.increment(platform);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Partager votre carte</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="direct">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="direct">Partage direct</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="direct" className="space-y-6">
            {/* Options de confidentialité */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Protection de la vie privée</Label>
                <p className="text-sm text-gray-500">
                  Masquer les informations sensibles
                </p>
              </div>
              <Switch
                checked={privacyEnabled}
                onCheckedChange={setPrivacyEnabled}
              />
            </div>

            {/* Message personnalisé */}
            <div>
              <Label>Message personnalisé</Label>
              <Input
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Ajoutez un message personnel..."
              />
            </div>

            {/* Boutons de partage */}
            <div className="grid grid-cols-2 gap-4">
              <WhatsappShareButton
                url={shareUrl}
                title={cardName}
                separator=" - "
                onClick={() => handleShare("whatsapp")}
              >
                <Button variant="outline" className="w-full">
                  <WhatsappIcon size={24} round className="mr-2" />
                  WhatsApp
                </Button>
              </WhatsappShareButton>

              <TelegramShareButton
                url={shareUrl}
                title={cardName}
                onClick={() => handleShare("telegram")}
              >
                <Button variant="outline" className="w-full">
                  <TelegramIcon size={24} round className="mr-2" />
                  Telegram
                </Button>
              </TelegramShareButton>

              <FacebookShareButton
                url={shareUrl}
                quote={cardName}
                onClick={() => handleShare("facebook")}
              >
                <Button variant="outline" className="w-full">
                  <FacebookIcon size={24} round className="mr-2" />
                  Facebook
                </Button>
              </FacebookShareButton>

              <EmailShareButton
                url={shareUrl}
                subject={cardName}
                onClick={() => handleShare("email")}
              >
                <Button variant="outline" className="w-full">
                  <EmailIcon size={24} round className="mr-2" />
                  Email
                </Button>
              </EmailShareButton>
            </div>

            {/* Lien et QR Code */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input value={shareUrl} readOnly />
                <Button variant="outline" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <QrCode value={qrCodeUrl} size={200} />
                </div>
              </div>
            </div>

            {/* Mode hors ligne */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => shareOffline()}
            >
              <Download className="h-4 w-4 mr-2" />
              Sauvegarder pour partage hors ligne
            </Button>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <Button
              className="w-full"
              onClick={() => generateVCard()}
              disabled={isGenerating}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Exporter en vCard
            </Button>

            <Button
              className="w-full"
              onClick={() => downloadImage()}
              disabled={isGenerating}
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger l'image
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(shareStats.data).map(([platform, count]) => (
                <div
                  key={platform}
                  className="p-4 bg-gray-50 rounded-lg text-center"
                >
                  <h3 className="font-medium capitalize">{platform}</h3>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
