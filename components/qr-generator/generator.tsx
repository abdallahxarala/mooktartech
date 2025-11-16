"use client";

import { useState, useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Download,
  Share2,
  RefreshCcw,
  AlertCircle,
  Check,
  Link as LinkIcon,
  Mail,
  Phone,
  FileText,
  Image,
} from "lucide-react";
type QRContentType = "url" | "vcard" | "email" | "phone" | "text";
type QRSize = "small" | "medium" | "large";
type QRCornerType = "square" | "rounded";
type QRErrorLevel = "L" | "M" | "Q" | "H";

interface QRConfig {
  content: string;
  contentType: QRContentType;
  size: QRSize;
  fgColor: string;
  bgColor: string;
  cornerType: QRCornerType;
  errorLevel: QRErrorLevel;
  includeMargin: boolean;
  logoImage: string | null;
  logoWidth: number;
  logoHeight: number;
}

const defaultConfig: QRConfig = {
  content: "https://xarala.co/cards/default",
  contentType: "url",
  size: "medium",
  fgColor: "#7B3FF2",
  bgColor: "#FFFFFF",
  cornerType: "square",
  errorLevel: "M",
  includeMargin: true,
  logoImage: null,
  logoWidth: 50,
  logoHeight: 50,
};

const sizesMap = {
  small: 200,
  medium: 300,
  large: 400,
};

export function QRCodeGenerator() {
  const [config, setConfig] = useState<QRConfig>(defaultConfig);
  const [showColorPicker, setShowColorPicker] = useState<"fg" | "bg" | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleContentTypeChange = (type: QRContentType) => {
    setConfig((prev) => ({
      ...prev,
      contentType: type,
      content: defaultConfig.content,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setConfig((prev) => ({
          ...prev,
          logoImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = async (format: "png" | "svg") => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    
    if (format === "png") {
      link.href = canvas.toDataURL("image/png");
      link.download = "qrcode.png";
    } else {
      // Pour SVG, nous devons créer un nouveau SVG à partir du canvas
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", canvas.width.toString());
      svg.setAttribute("height", canvas.height.toString());
      
      const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
      image.setAttribute("width", "100%");
      image.setAttribute("height", "100%");
      image.setAttribute("href", canvas.toDataURL("image/png"));
      
      svg.appendChild(image);
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      link.href = URL.createObjectURL(svgBlob);
      link.download = "qrcode.svg";
    }

    link.click();
  };

  const shareQR = async () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    const blob = await new Promise<Blob>((resolve) => 
      canvas.toBlob((blob) => resolve(blob!), "image/png")
    );

    if (navigator.share) {
      try {
        await navigator.share({
          files: [new File([blob], "qrcode.png", { type: "image/png" })],
          title: "Mon QR Code Xarala",
          text: "Voici mon QR code personnalisé créé avec Xarala Solutions",
        });
      } catch (error) {
        console.error("Erreur lors du partage:", error);
      }
    }
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-fade-in-up">
      {/* Prévisualisation */}
      <div className="bg-white p-8 rounded-lg shadow-sm animate-fade-in-up">
        <div className="flex flex-col items-center animate-fade-in-up">
          <div
            ref={qrRef}
            className="bg-white p-6 rounded-lg shadow-sm animate-fade-in-up"
          >
            <QRCode
              value={config.content}
              size={sizesMap[config.size]}
              fgColor={config.fgColor}
              bgColor={config.bgColor}
              level={config.errorLevel}
              includeMargin={config.includeMargin}
              imageSettings={config.logoImage ? {
                src: config.logoImage,
                width: config.logoWidth,
                height: config.logoHeight,
              } : undefined}
            />
          </div>

          <div className="flex gap-4 mt-8 animate-fade-in-up">
            <Button
              onClick={() => downloadQR("png")}
              className="bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up"
            >
              <Download className="w-4 h-4 mr-2 animate-fade-in-up" />
              PNG
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadQR("svg")}
            >
              <Download className="w-4 h-4 mr-2 animate-fade-in-up" />
              SVG
            </Button>
            <Button
              variant="outline"
              onClick={shareQR}
            >
              <Share2 className="w-4 h-4 mr-2 animate-fade-in-up" />
              Partager
            </Button>
            <Button
              variant="ghost"
              onClick={resetConfig}
            >
              <RefreshCcw className="w-4 h-4 mr-2 animate-fade-in-up" />
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      {/* Options de personnalisation */}
      <div className="space-y-8 animate-fade-in-up">
        {/* Type de contenu */}
        <div>
          <Label>Type de contenu</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 animate-fade-in-up">
            {[
              { type: "url" as QRContentType, icon: LinkIcon, label: "URL" },
              { type: "vcard" as QRContentType, icon: FileText, label: "vCard" },
              { type: "email" as QRContentType, icon: Mail, label: "Email" },
              { type: "phone" as QRContentType, icon: Phone, label: "Téléphone" },
              { type: "text" as QRContentType, icon: FileText, label: "Texte" },
            ].map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant={config.contentType === type ? "default" : "outline"}
                className={config.contentType === type ? "bg-primary-orange" : ""}
                onClick={() => handleContentTypeChange(type)}
              >
                <Icon className="w-4 h-4 mr-2 animate-fade-in-up" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div>
          <Label>Contenu</Label>
          <Input
            value={config.content}
            onChange={(e) => setConfig((prev) => ({ ...prev, content: e.target.value }))}
            className="mt-2 animate-fade-in-up"
            placeholder="Entrez le contenu du QR code"
          />
        </div>

        {/* Couleurs */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
          <div>
            <Label>Couleur principale</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-2 animate-fade-in-up"
                  style={{ backgroundColor: config.fgColor }}
                >
                  {config.fgColor}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 animate-fade-in-up">
                <HexColorPicker
                  color={config.fgColor}
                  onChange={(color) => setConfig((prev) => ({ ...prev, fgColor: color }))}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Couleur de fond</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-2 animate-fade-in-up"
                  style={{ backgroundColor: config.bgColor }}
                >
                  {config.bgColor}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 animate-fade-in-up">
                <HexColorPicker
                  color={config.bgColor}
                  onChange={(color) => setConfig((prev) => ({ ...prev, bgColor: color }))}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Taille */}
        <div>
          <Label>Taille</Label>
          <Select
            value={config.size}
            onValueChange={(value: QRSize) => 
              setConfig((prev) => ({ ...prev, size: value }))
            }
          >
            <SelectTrigger className="mt-2 animate-fade-in-up">
              <SelectValue placeholder="Choisir une taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petit</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="large">Grand</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Style des coins */}
        <div>
          <Label>Style des coins</Label>
          <div className="flex gap-4 mt-2 animate-fade-in-up">
            <Button
              variant={config.cornerType === "square" ? "default" : "outline"}
              className={config.cornerType === "square" ? "bg-primary-orange" : ""}
              onClick={() => setConfig((prev) => ({ ...prev, cornerType: "square" }))}
            >
              Carré
            </Button>
            <Button
              variant={config.cornerType === "rounded" ? "default" : "outline"}
              className={config.cornerType === "rounded" ? "bg-primary-orange" : ""}
              onClick={() => setConfig((prev) => ({ ...prev, cornerType: "rounded" }))}
            >
              Arrondi
            </Button>
          </div>
        </div>

        {/* Niveau de correction */}
        <div>
          <Label>Niveau de correction d'erreur</Label>
          <Select
            value={config.errorLevel}
            onValueChange={(value: QRErrorLevel) => 
              setConfig((prev) => ({ ...prev, errorLevel: value }))
            }
          >
            <SelectTrigger className="mt-2 animate-fade-in-up">
              <SelectValue placeholder="Choisir un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Faible (7%)</SelectItem>
              <SelectItem value="M">Moyen (15%)</SelectItem>
              <SelectItem value="Q">Quartile (25%)</SelectItem>
              <SelectItem value="H">Haut (30%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logo */}
        <div>
          <Label>Logo</Label>
          <div className="mt-2 space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-4 animate-fade-in-up">
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden animate-fade-in-up"
                id="logo-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("logo-upload")?.click()}
              >
                <Image className="w-4 h-4 mr-2 animate-fade-in-up" />
                Choisir un logo
              </Button>
              {config.logoImage && (
                <Button
                  variant="ghost"
                  onClick={() => setConfig((prev) => ({ ...prev, logoImage: null }))}
                >
                  Supprimer
                </Button>
              )}
            </div>
            {config.logoImage && (
              <div>
                <Label>Taille du logo</Label>
                <Slider
                  value={[config.logoWidth]}
                  min={20}
                  max={150}
                  step={5}
                  className="mt-2 animate-fade-in-up"
                  onValueChange={([value]) => 
                    setConfig((prev) => ({
                      ...prev,
                      logoWidth: value,
                      logoHeight: value,
                    }))
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Marge */}
        <div className="flex items-center justify-between animate-fade-in-up">
          <Label>Inclure une marge</Label>
          <Switch
            checked={config.includeMargin}
            onCheckedChange={(checked) =>
              setConfig((prev) => ({ ...prev, includeMargin: checked }))
            }
          />
        </div>
      </div>
    </div>
  );
}
