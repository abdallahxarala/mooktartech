import { CardTemplate, CardThemePreset } from "@/lib/types/card-template";

// Templates de base
export const baseTemplates: CardTemplate[] = [
  {
    id: "classic",
    name: "Classique",
    description: "Design professionnel et épuré",
    preview: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    category: "standard",
    layout: {
      photo: { x: 20, y: 20, size: 80 },
      name: { x: 120, y: 30, size: 24 },
      title: { x: 120, y: 60, size: 16 },
      contact: { x: 20, y: 120, spacing: 24 },
      social: { x: 20, y: 220, spacing: 16 },
      qr: { x: 280, y: 200, size: 80 },
    },
    wave: {
      style: "classic",
      amplitude: 30,
      frequency: 2,
      opacity: 0.3,
      position: { x: 0, y: 0.5 },
    },
    colors: {
      primary: "#7B3FF2",
      secondary: "#FF7A00",
      text: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      name: "montserrat",
      title: "montserrat",
      text: "inter",
    },
  },
  {
    id: "modern",
    name: "Moderne",
    description: "Style contemporain avec des accents audacieux",
    preview: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4",
    category: "standard",
    layout: {
      photo: { x: 40, y: 40, size: 100 },
      name: { x: 160, y: 50, size: 28 },
      title: { x: 160, y: 85, size: 18 },
      contact: { x: 40, y: 160, spacing: 28 },
      social: { x: 40, y: 260, spacing: 20 },
      qr: { x: 260, y: 180, size: 100 },
    },
    wave: {
      style: "dynamic",
      amplitude: 40,
      frequency: 3,
      opacity: 0.4,
      position: { x: 0, y: 0.6 },
    },
    colors: {
      primary: "#FF7A00",
      secondary: "#7B3FF2",
      text: "#111827",
      background: "#F9FAFB",
    },
    fonts: {
      name: "poppins",
      title: "poppins",
      text: "inter",
    },
  },
];

// Templates premium avec motifs africains
export const africanTemplates: CardTemplate[] = [
  {
    id: "sahel",
    name: "Sahel",
    description: "Inspiré des motifs traditionnels du Sahel",
    preview: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    category: "premium",
    layout: {
      photo: { x: 30, y: 30, size: 90 },
      name: { x: 140, y: 40, size: 26 },
      title: { x: 140, y: 70, size: 17 },
      contact: { x: 30, y: 140, spacing: 26 },
      social: { x: 30, y: 240, spacing: 18 },
      qr: { x: 270, y: 190, size: 90 },
    },
    wave: {
      style: "minimal",
      amplitude: 20,
      frequency: 2,
      opacity: 0.3,
      position: { x: 0, y: 0.7 },
    },
    colors: {
      primary: "#C17817",
      secondary: "#E6B325",
      text: "#1A1A1A",
      background: "#FDF6E3",
      accent: "#8B4513",
    },
    fonts: {
      name: "playfair",
      title: "montserrat",
      text: "inter",
    },
    patterns: {
      type: "traditional",
      color: "#8B4513",
      opacity: 0.1,
      scale: 1.5,
    },
  },
];

// Templates par industrie
export const industryTemplates: CardTemplate[] = [
  {
    id: "tech",
    name: "Tech",
    description: "Design moderne pour les professionnels de la tech",
    preview: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    category: "industry",
    industry: "tech",
    layout: {
      photo: { x: 25, y: 25, size: 85 },
      name: { x: 130, y: 35, size: 25 },
      title: { x: 130, y: 65, size: 16 },
      contact: { x: 25, y: 130, spacing: 25 },
      social: { x: 25, y: 230, spacing: 17 },
      qr: { x: 265, y: 185, size: 85 },
    },
    wave: {
      style: "dynamic",
      amplitude: 35,
      frequency: 2.5,
      opacity: 0.35,
      position: { x: 0, y: 0.65 },
    },
    colors: {
      primary: "#2563EB",
      secondary: "#7C3AED",
      text: "#1F2937",
      background: "#F8FAFC",
      accent: "#06B6D4",
    },
    fonts: {
      name: "inter",
      title: "inter",
      text: "inter",
    },
    patterns: {
      type: "dots",
      color: "#2563EB",
      opacity: 0.1,
      scale: 1,
    },
  },
];

// Thèmes prédéfinis
export const themePresets: CardThemePreset[] = [
  {
    id: "xarala",
    name: "Xarala",
    description: "Thème officiel Xarala Solutions",
    colors: {
      primary: "#7B3FF2",
      secondary: "#FF7A00",
      text: "#1F2937",
      background: "#FFFFFF",
    },
    wave: {
      style: "classic",
      amplitude: 30,
      frequency: 2,
      opacity: 0.3,
    },
  },
  {
    id: "teranga",
    name: "Teranga",
    description: "Inspiré des couleurs du Sénégal",
    colors: {
      primary: "#00853F",
      secondary: "#FDEF42",
      text: "#FFFFFF",
      background: "#E31B23",
      accent: "#FDEF42",
    },
    wave: {
      style: "dynamic",
      amplitude: 40,
      frequency: 3,
      opacity: 0.4,
    },
    patterns: {
      type: "traditional",
      color: "#FDEF42",
      opacity: 0.15,
      scale: 1.2,
    },
  },
];

// Fonction pour extraire les couleurs d'une image
export async function extractColorsFromImage(imageUrl: string): Promise<{
  primary: string;
  secondary: string;
  text: string;
  background: string;
}> {
  // Simulation d'extraction de couleurs
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        primary: "#7B3FF2",
        secondary: "#FF7A00",
        text: "#1F2937",
        background: "#FFFFFF",
      });
    }, 1000);
  });
}

// Fonction pour vérifier le contraste
export function checkContrast(color1: string, color2: string): number {
  // Simulation de vérification de contraste
  return 4.5; // Ratio minimum recommandé pour l'accessibilité
}

// Fonction pour suggérer des combinaisons de couleurs harmonieuses
export function suggestColorCombinations(baseColor: string): {
  primary: string;
  secondary: string;
  text: string;
  background: string;
}[] {
  // Simulation de suggestions de couleurs
  return [
    {
      primary: "#7B3FF2",
      secondary: "#FF7A00",
      text: "#1F2937",
      background: "#FFFFFF",
    },
    {
      primary: "#2563EB",
      secondary: "#7C3AED",
      text: "#1F2937",
      background: "#F8FAFC",
    },
  ];
}