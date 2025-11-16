"use client";

import { useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { HexColorPicker } from "react-colorful";
import { CardData, CardTheme, CardFont } from "./editor";
import { cardTemplates } from "./templates";
import {
  Save,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  QrCode,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
} from "lucide-react";

interface EditorPanelProps {
  data: CardData;
  onChange: (updates: Partial<CardData>) => void;
  onSave: () => void;
  activeTab: string;
}

export function EditorPanel({ data, onChange, onSave, activeTab }: EditorPanelProps) {
  const handleFileUpload = useCallback(
    (type: "photo" | "logo") => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            onChange({ [type]: reader.result as string });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    },
    [onChange]
  );

  return (
    <div className="h-full overflow-y-auto animate-fade-in-up">
      <Tabs value={activeTab} className="h-full animate-fade-in-up">
        <div className="px-6 pt-6 border-b animate-fade-in-up">
          <TabsList>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="information">Information</TabsTrigger>
            <TabsTrigger value="fields">Champs</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6 animate-fade-in-up">
          <TabsContent value="design" className="space-y-6 animate-fade-in-up">
            <section>
              <h3 className="text-lg font-semibold mb-4 animate-fade-in-up">Modèle</h3>
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                {cardTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      data.theme === template.id
                        ? "ring-2 ring-primary-orange bg-primary-orange/5"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => onChange({ theme: template.id as CardTheme })}
                  >
                    {template.name}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4 animate-fade-in-up">Couleur</h3>
              <HexColorPicker
                color={data.color}
                onChange={(color) => onChange({ color })}
              />
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4 animate-fade-in-up">Police</h3>
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                {["inter", "poppins", "roboto", "montserrat"].map((font) => (
                  <div
                    key={font}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      data.font === font
                        ? "ring-2 ring-primary-orange bg-primary-orange/5"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => onChange({ font: font as CardFont })}
                  >
                    {font}
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="information" className="space-y-6 animate-fade-in-up">
            <div className="space-y-4 animate-fade-in-up">
              <div>
                <Label>Nom complet</Label>
                <Input
                  value={data.name}
                  onChange={(e) => onChange({ name: e.target.value })}
                />
              </div>
              <div>
                <Label>Titre</Label>
                <Input
                  value={data.title}
                  onChange={(e) => onChange({ title: e.target.value })}
                />
              </div>
              <div>
                <Label>Entreprise</Label>
                <Input
                  value={data.company}
                  onChange={(e) => onChange({ company: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fields" className="space-y-6 animate-fade-in-up">
            <div className="space-y-4 animate-fade-in-up">
              <div>
                <Label>Téléphone</Label>
                <div className="flex items-center gap-2 animate-fade-in-up">
                  <Phone className="h-4 w-4 text-gray-500 animate-fade-in-up" />
                  <Input
                    value={data.phone}
                    onChange={(e) => onChange({ phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <div className="flex items-center gap-2 animate-fade-in-up">
                  <Mail className="h-4 w-4 text-gray-500 animate-fade-in-up" />
                  <Input
                    value={data.email}
                    onChange={(e) => onChange({ email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Site web</Label>
                <div className="flex items-center gap-2 animate-fade-in-up">
                  <LinkIcon className="h-4 w-4 text-gray-500 animate-fade-in-up" />
                  <Input
                    value={data.website}
                    onChange={(e) => onChange({ website: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Adresse</Label>
                <div className="flex items-center gap-2 animate-fade-in-up">
                  <MapPin className="h-4 w-4 text-gray-500 animate-fade-in-up" />
                  <Input
                    value={data.address}
                    onChange={(e) => onChange({ address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 animate-fade-in-up">Réseaux sociaux</h3>
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center gap-2 animate-fade-in-up">
                  <Linkedin className="h-4 w-4 text-gray-500 animate-fade-in-up" />
                  <Input
                    value={data.socialLinks.linkedin}
                    onChange={(e) =>
                      onChange({
                        socialLinks: { ...data.socialLinks, linkedin: e.target.value },
                      })
                    }
                    placeholder="LinkedIn"
                  />
                </div>
                <div className="flex items-center gap-2 animate-fade-in-up">
                  <Twitter className="h-4 w-4 text-gray-500 animate-fade-in-up" />
                  <Input
                    value={data.socialLinks.twitter}
                    onChange={(e) =>
                      onChange({
                        socialLinks: { ...data.socialLinks, twitter: e.target.value },
                      })
                    }
                    placeholder="Twitter"
                  />
                </div>
                <div className="flex items-center gap-2 animate-fade-in-up">
                  <Facebook className="h-4 w-4 text-gray-500 animate-fade-in-up" />
                  <Input
                    value={data.socialLinks.facebook}
                    onChange={(e) =>
                      onChange({
                        socialLinks: { ...data.socialLinks, facebook: e.target.value },
                      })
                    }
                    placeholder="Facebook"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 animate-fade-in-up">
            <div>
              <h3 className="text-lg font-semibold mb-4 animate-fade-in-up">Images</h3>
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <Label>Photo de profil</Label>
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload("photo")}
                    className="w-full animate-fade-in-up"
                  >
                    <ImageIcon className="h-4 w-4 mr-2 animate-fade-in-up" />
                    {data.photo ? "Changer la photo" : "Ajouter une photo"}
                  </Button>
                </div>
                <div>
                  <Label>Logo</Label>
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload("logo")}
                    className="w-full animate-fade-in-up"
                  >
                    <ImageIcon className="h-4 w-4 mr-2 animate-fade-in-up" />
                    {data.logo ? "Changer le logo" : "Ajouter un logo"}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 animate-fade-in-up">QR Code</h3>
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center justify-between animate-fade-in-up">
                  <Label>Activer le QR code</Label>
                  <Switch
                    checked={data.qrCode.enabled}
                    onCheckedChange={(enabled) =>
                      onChange({
                        qrCode: { ...data.qrCode, enabled },
                      })
                    }
                  />
                </div>
                {data.qrCode.enabled && (
                  <div>
                    <Label>Style du QR code</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2 animate-fade-in-up">
                      <Button
                        variant={data.qrCode.style === "standard" ? "default" : "outline"}
                        onClick={() =>
                          onChange({
                            qrCode: { ...data.qrCode, style: "standard" },
                          })
                        }
                      >
                        <QrCode className="h-4 w-4 mr-2 animate-fade-in-up" />
                        Standard
                      </Button>
                      <Button
                        variant={data.qrCode.style === "branded" ? "default" : "outline"}
                        onClick={() =>
                          onChange({
                            qrCode: { ...data.qrCode, style: "branded" },
                          })
                        }
                      >
                        <Type className="h-4 w-4 mr-2 animate-fade-in-up" />
                        Personnalisé
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t animate-fade-in-up">
          <Button
            className="w-full bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up"
            onClick={onSave}
          >
            <Save className="h-4 w-4 mr-2 animate-fade-in-up" />
            Sauvegarder
          </Button>
        </div>
      </Tabs>
    </div>
  );
}
