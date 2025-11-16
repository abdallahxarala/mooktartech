export type CardTheme = "classic" | "flat" | "modern" | "smooth" | "african" | "business" | "tech" | "art" | "education";
export type CardFont = "inter" | "poppins" | "roboto" | "montserrat" | "playfair";
export type WaveStyle = "classic" | "dynamic" | "minimal" | "double" | "custom";

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: "standard" | "premium" | "industry";
  industry?: string;
  featured?: boolean;
  layout: {
    photo: { x: number; y: number; size: number };
    name: { x: number; y: number; size: number };
    title: { x: number; y: number; size: number };
    contact: { x: number; y: number; spacing: number };
    social: { x: number; y: number; spacing: number };
    qr: { x: number; y: number; size: number };
  };
  wave: {
    style: WaveStyle;
    amplitude: number;
    frequency: number;
    opacity: number;
    position: { x: number; y: number };
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
    accent?: string;
  };
  fonts: {
    name: CardFont;
    title: CardFont;
    text: CardFont;
  };
  patterns?: {
    type: "dots" | "lines" | "waves" | "traditional";
    color: string;
    opacity: number;
    scale: number;
  };
}

export interface CardThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
    accent?: string;
  };
  wave: {
    style: WaveStyle;
    amplitude: number;
    frequency: number;
    opacity: number;
  };
  patterns?: {
    type: "dots" | "lines" | "waves" | "traditional";
    color: string;
    opacity: number;
    scale: number;
  };
}