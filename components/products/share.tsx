"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Share2, Copy, MapIcon as WhatsappIcon, Mail, Link } from "lucide-react";

interface ShareButtonsProps {
  product: {
    name: string;
    description: string;
  };
}

export function ShareButtons({ product }: ShareButtonsProps) {
  const { toast } = useToast();
  const shareUrl = window.location.href;

  const handleShare = async (platform: string) => {
    const shareText = `Découvrez ${product.name} sur Xarala Solutions`;

    switch (platform) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`,
          "_blank"
        );
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(
          shareText
        )}&body=${encodeURIComponent(product.description + "\n\n" + shareUrl)}`;
        break;
      case "copy":
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
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
          <WhatsappIcon className="h-4 w-4 mr-2" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("email")}>
          <Mail className="h-4 w-4 mr-2" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("copy")}>
          <Copy className="h-4 w-4 mr-2" />
          Copier le lien
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
