export interface BadgeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'conference' | 'exhibition' | 'corporate' | 'vip' | 'custom';
  thumbnail: string;
  dimensions: {
    width: number;  // mm
    height: number; // mm
    dpi: number;
  };
  layers: BadgeLayer[];
  variables: BadgeVariable[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BadgeLayer {
  id: string;
  type: 'text' | 'image' | 'qr' | 'barcode' | 'shape' | 'logo';
  name: string;
  visible: boolean;
  locked: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
  zIndex: number;
  properties: Record<string, any>;
}

export interface BadgeVariable {
  id: string;
  name: string;
  type: 'text' | 'image' | 'qr' | 'barcode';
  placeholder: string;
  required: boolean;
  csvColumn?: string;
}

export interface BadgeDesign {
  id: string;
  templateId?: string;
  name: string;
  layers: BadgeLayer[];
  variables: BadgeVariable[];
  savedAt: Date;
}

