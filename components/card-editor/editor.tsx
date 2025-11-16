"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { CardPreview } from "./card-preview";
import { EditorPanel } from "./editor-panel";
import { EditorSidebar } from "./editor-sidebar";
import { useAutoSave } from "@/lib/hooks/use-auto-save";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import QRCode from "qrcode";

export type CardTheme = "classic" | "flat" | "modern" | "smooth";
export type CardFont = "inter" | "poppins" | "roboto" | "montserrat";

export interface CardData {
  theme: CardTheme;
  color: string;
  font: CardFont;
  photo: string;
  logo: string;
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  badges: string[];
  qrCode: {
    enabled: boolean;
    style: "standard" | "branded";
    position: { x: number; y: number };
    data?: string;
  };
}

const initialCardData: CardData = {
  theme: "classic",
  color: "#FF7A00",
  font: "inter",
  photo: "",
  logo: "",
  name: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  website: "",
  address: "",
  socialLinks: {},
  badges: [],
  qrCode: {
    enabled: true,
    style: "standard",
    position: { x: 0, y: 0 },
  },
};

export function CardEditor() {
  const [cardData, setCardData] = useLocalStorage<CardData>("card-editor", initialCardData);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("design");
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  // Configure DnD sensors
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  // Autosave changes
  useAutoSave(cardData, "card-editor", 2000);

  // Generate QR code when data changes
  useEffect(() => {
    if (cardData.qrCode.enabled) {
      const generateQR = async () => {
        try {
          const qrData = {
            name: cardData.name,
            title: cardData.title,
            company: cardData.company,
            phone: cardData.phone,
            email: cardData.email,
            website: cardData.website,
          };

          const qrCodeData = await QRCode.toDataURL(JSON.stringify(qrData), {
            width: 200,
            margin: 1,
            color: {
              dark: cardData.color,
              light: "#FFFFFF",
            },
          });

          setCardData((prev) => ({
            ...prev,
            qrCode: {
              ...prev.qrCode,
              data: qrCodeData,
            },
          }));
        } catch (err) {
          console.error("Error generating QR code:", err);
        }
      };

      generateQR();
    }
  }, [cardData.name, cardData.title, cardData.company, cardData.phone, cardData.email, cardData.website, cardData.color]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const { x, y } = over.rect;
      
      if (active.id === "qr-code") {
        setCardData((prev) => ({
          ...prev,
          qrCode: {
            ...prev.qrCode,
            position: { x, y },
          },
        }));
      }
    }
    
    setIsDragging(false);
  };

  const handleCardUpdate = (updates: Partial<CardData>) => {
    setCardData((prev) => ({ ...prev, ...updates }));
  };

  const handleImageUpload = async (type: "photo" | "logo", file: File) => {
    try {
      // In a real app, upload to storage service
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardData((prev) => ({
          ...prev,
          [type]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger l'image",
      });
    }
  };

  const handleSave = async () => {
    try {
      // Save to database in real app
      toast({
        title: "Carte sauvegardée",
        description: "Vos modifications ont été enregistrées",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la carte",
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToParentElement]}
      onDragEnd={handleDragEnd}
      onDragStart={() => setIsDragging(true)}
    >
      <div className="h-screen flex">
        <EditorSidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1 flex">
          <div className={cn(
            "w-[450px] bg-gray-50 p-8 transition-all duration-300",
            sidebarCollapsed ? "ml-20" : "ml-[80px]"
          )}>
            <CardPreview
              data={cardData}
              isDragging={isDragging}
              onImageUpload={handleImageUpload}
            />
          </div>

          <div className="flex-1 bg-white">
            <EditorPanel
              data={cardData}
              onChange={handleCardUpdate}
              onSave={handleSave}
              activeTab={activeTab}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
}
