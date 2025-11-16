"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardTemplate } from "./templates";
import { useCardEditor } from "@/lib/hooks/use-card-editor";
import {
  Smartphone,
  Monitor,
  Move,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  Share2,
  Download,
  QrCode,
} from "lucide-react";

interface EditorWorkspaceProps {
  template: CardTemplate;
  onSave: () => void;
}

export function EditorWorkspace({ template, onSave }: EditorWorkspaceProps) {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    cardData,
    updateCardData,
    selectedElement,
    setSelectedElement,
    moveElement,
    history,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCardEditor(template);

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("text/plain", type);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    moveElement(type, { x, y });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-1 gap-8 animate-fade-in-up">
      {/* Zone d'édition */}
      <div className="flex-1 animate-fade-in-up">
        <div className="mb-6 flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-4 animate-fade-in-up">
            <Button
              variant={view === "desktop" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("desktop")}
            >
              <Monitor className="h-4 w-4 animate-fade-in-up" />
            </Button>
            <Button
              variant={view === "mobile" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("mobile")}
            >
              <Smartphone className="h-4 w-4 animate-fade-in-up" />
            </Button>
          </div>
          <div className="flex items-center gap-2 animate-fade-in-up">
            <Button
              variant="outline"
              size="icon"
              onClick={undo}
              disabled={!canUndo}
            >
              ↩
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={redo}
              disabled={!canRedo}
            >
              ↪
            </Button>
          </div>
        </div>

        <div
          className={`relative bg-white rounded-lg shadow-lg mx-auto transition-all ${
            view === "mobile" ? "w-[375px]" : "w-full max-w-3xl"
          }`}
          style={{ aspectRatio: "1.586/1" }}
          ref={cardRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Éléments de la carte */}
          
            {Object.entries(cardData).map(([key, value]) => (
              <div
                key={key}
                className={`absolute cursor-move ${
                  selectedElement === key ? "ring-2 ring-primary-orange" : ""
                }`}
                style={{
                  left: value.position.x,
                  top: value.position.y,
                  width: value.size?.width,
                  height: value.size?.height,
                }}
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  moveElement(key, {
                    x: value.position.x + info.offset.x,
                    y: value.position.y + info.offset.y,
                  });
                }}
                onClick={() => setSelectedElement(key)}
              >
                {/* Rendu de l'élément selon son type */}
                {key === "photo" && (
                  <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden animate-fade-in-up">
                    {value.content ? (
                      <img
                        src={value.content}
                        alt="Profile"
                        className="w-full h-full object-cover animate-fade-in-up"
                      />
                    ) : (
                      <ImageIcon className="w-full h-full p-6 text-gray-400 animate-fade-in-up" />
                    )}
                  </div>
                )}
                {key === "name" && (
                  <h2
                    className="text-2xl font-bold animate-fade-in-up"
                    style={{ color: template.colors.text }}
                  >
                    {value.content || "Votre nom"}
                  </h2>
                )}
                {/* Autres éléments... */}
              </div>
            ))}
          
        </div>
      </div>

      {/* Panneau d'édition */}
      <div className="w-80 bg-white rounded-lg shadow-lg p-6 animate-fade-in-up">
        <Tabs defaultValue="elements">
          <TabsList className="w-full animate-fade-in-up">
            <TabsTrigger value="elements">Éléments</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="elements" className="mt-6 animate-fade-in-up">
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <Label>Éléments disponibles</Label>
                <div className="grid grid-cols-2 gap-4 mt-2 animate-fade-in-up">
                  {[
                    { icon: ImageIcon, label: "Photo", type: "photo" },
                    { icon: Type, label: "Texte", type: "text" },
                    { icon: LinkIcon, label: "Lien", type: "link" },
                    { icon: QrCode, label: "QR Code", type: "qr" },
                  ].map((item) => (
                    <div
                      key={item.type}
                      className="p-4 border rounded-lg text-center cursor-move animate-fade-in-up"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.type)}
                    >
                      <item.icon className="h-6 w-6 mx-auto mb-2 animate-fade-in-up" />
                      <span className="text-sm animate-fade-in-up">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedElement && (
                <div className="space-y-4 animate-fade-in-up">
                  <Label>Propriétés</Label>
                  <Input
                    value={cardData[selectedElement].content || ""}
                    onChange={(e) =>
                      updateCardData(selectedElement, {
                        ...cardData[selectedElement],
                        content: e.target.value,
                      })
                    }
                    placeholder="Contenu"
                  />
                  {/* Autres propriétés selon le type d'élément */}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="style" className="mt-6 animate-fade-in-up">
            {/* Options de style */}
          </TabsContent>

          <TabsContent value="export" className="mt-6 animate-fade-in-up">
            <div className="space-y-4 animate-fade-in-up">
              <Button className="w-full animate-fade-in-up" onClick={onSave}>
                <Download className="h-4 w-4 mr-2 animate-fade-in-up" />
                Télécharger
              </Button>
              <Button variant="outline" className="w-full animate-fade-in-up">
                <Share2 className="h-4 w-4 mr-2 animate-fade-in-up" />
                Partager
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
