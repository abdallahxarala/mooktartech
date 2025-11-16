export interface Layer {
  id: string
  type: 'text' | 'image' | 'shape' | 'qrcode' | 'background'
  name: string
  visible: boolean
  locked: boolean
  fabricObject?: any
}

export interface CardDesignerProps {
  initialData?: any
  onSave?: (data: any) => void
  onExport?: (blob: Blob) => void
}

