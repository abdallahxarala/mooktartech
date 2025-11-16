"use client";

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  layout: {
    photo: { x: number; y: number; size: number };
    name: { x: number; y: number; size: number };
    title: { x: number; y: number; size: number };
    contact: { x: number; y: number; spacing: number };
    social: { x: number; y: number; spacing: number };
    qr: { x: number; y: number; size: number };
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  fonts: {
    name: string;
    title: string;
    text: string;
  };
}

export const cardTemplates: CardTemplate[] = [
  {
    id: "classic",
    name: "Classique",
    description: "Design professionnel et épuré",
    preview: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    layout: {
      photo: { x: 20, y: 20, size: 80 },
      name: { x: 120, y: 30, size: 24 },
      title: { x: 120, y: 60, size: 16 },
      contact: { x: 20, y: 120, spacing: 24 },
      social: { x: 20, y: 220, spacing: 16 },
      qr: { x: 280, y: 200, size: 80 },
    },
    colors: {
      primary: "#7B3FF2",
      secondary: "#FF7A00",
      text: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      name: "Montserrat",
      title: "Montserrat",
      text: "Inter",
    },
  },
  {
    id: "modern",
    name: "Moderne",
    description: "Style contemporain avec des accents audacieux",
    preview: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4",
    layout: {
      photo: { x: 40, y: 40, size: 100 },
      name: { x: 160, y: 50, size: 28 },
      title: { x: 160, y: 85, size: 18 },
      contact: { x: 40, y: 160, spacing: 28 },
      social: { x: 40, y: 260, spacing: 20 },
      qr: { x: 260, y: 180, size: 100 },
    },
    colors: {
      primary: "#FF7A00",
      secondary: "#7B3FF2",
      text: "#111827",
      background: "#F9FAFB",
    },
    fonts: {
      name: "Poppins",
      title: "Poppins",
      text: "Inter",
    },
  },
  {
    id: "elegant",
    name: "Élégant",
    description: "Design raffiné avec une touche de luxe",
    preview: "https://images.unsplash.com/photo-1542744094-24638eff58bb",
    layout: {
      photo: { x: 30, y: 30, size: 90 },
      name: { x: 140, y: 40, size: 26 },
      title: { x: 140, y: 70, size: 17 },
      contact: { x: 30, y: 140, spacing: 26 },
      social: { x: 30, y: 240, spacing: 18 },
      qr: { x: 270, y: 190, size: 90 },
    },
    colors: {
      primary: "#1E293B",
      secondary: "#94A3B8",
      text: "#0F172A",
      background: "#FFFFFF",
    },
    fonts: {
      name: "Playfair Display",
      title: "Playfair Display",
      text: "Inter",
    },
  },
];