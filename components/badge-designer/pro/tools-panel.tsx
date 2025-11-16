'use client'

import { motion } from 'framer-motion'
import { 
  Type, Image, Building2, User, QrCode, 
  RectangleHorizontal, Circle, Container, 
  Layout, Sparkles
} from 'lucide-react'
import { useBadgeDesignerStore } from '@/lib/store/badge-designer-store'
import { BadgeElement } from '@/lib/store/badge-designer-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface Tool {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  type: BadgeElement['type']
  variant?: string
  defaultProps?: Partial<BadgeElement['properties']>
}

const dynamicContentTools: Tool[] = [
  {
    id: 'name',
    label: 'Nom',
    icon: User,
    type: 'text',
    variant: 'name',
    defaultProps: {
      text: 'Nom Prénom',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1f2937',
    },
  },
  {
    id: 'company',
    label: 'Entreprise',
    icon: Building2,
    type: 'text',
    variant: 'company',
    defaultProps: {
      text: 'Nom de l\'entreprise',
      fontSize: 14,
      color: '#6b7280',
    },
  },
  {
    id: 'role',
    label: 'Rôle',
    icon: Type,
    type: 'text',
    variant: 'role',
    defaultProps: {
      text: 'Poste / Rôle',
      fontSize: 12,
      color: '#9ca3af',
    },
  },
  {
    id: 'qr',
    label: 'QR Code',
    icon: QrCode,
    type: 'qr',
    variant: 'qr',
    defaultProps: {
      data: 'https://example.com',
      format: 'qr',
    },
  },
]

const visualElementsTools: Tool[] = [
  {
    id: 'photo',
    label: 'Photo',
    icon: Image,
    type: 'image',
    variant: 'photo',
    defaultProps: {
      src: '',
      borderRadius: 0,
    },
  },
  {
    id: 'logo',
    label: 'Logo',
    icon: Sparkles,
    type: 'image',
    variant: 'logo',
    defaultProps: {
      src: '',
      borderRadius: 0,
    },
  },
]

const shapesTools: Tool[] = [
  {
    id: 'rectangle',
    label: 'Rectangle',
    icon: RectangleHorizontal,
    type: 'shape',
    variant: 'rectangle',
    defaultProps: {
      shape: 'rectangle',
      fillColor: '#f3f4f6',
      strokeColor: '#d1d5db',
      strokeWidth: 1,
    },
  },
  {
    id: 'circle',
    label: 'Cercle',
    icon: Circle,
    type: 'shape',
    variant: 'circle',
    defaultProps: {
      shape: 'circle',
      fillColor: '#f3f4f6',
      strokeColor: '#d1d5db',
      strokeWidth: 1,
    },
  },
  {
    id: 'container',
    label: 'Conteneur',
    icon: Container,
    type: 'shape',
    variant: 'container',
    defaultProps: {
      shape: 'rectangle',
      fillColor: 'transparent',
      strokeColor: '#d1d5db',
      strokeWidth: 2,
      borderRadius: 8,
    },
  },
  {
    id: 'sidebar',
    label: 'Bande latérale',
    icon: Layout,
    type: 'shape',
    variant: 'sidebar',
    defaultProps: {
      shape: 'rectangle',
      fillColor: '#f97316',
      strokeColor: 'transparent',
      strokeWidth: 0,
    },
  },
]

export function ToolsPanel() {
  const { addElement, currentDesign } = useBadgeDesignerStore()

  const handleToolClick = (tool: Tool) => {
    if (!currentDesign) return

    // Calculer position par défaut (centre du badge)
    const centerX = currentDesign.dimensions.width / 2
    const centerY = currentDesign.dimensions.height / 2

    // Taille par défaut selon le type
    let defaultSize = { width: 100, height: 40 }
    if (tool.type === 'image') {
      defaultSize = { width: 60, height: 60 }
    } else if (tool.type === 'shape') {
      defaultSize = { width: 80, height: 80 }
    } else if (tool.type === 'qr') {
      defaultSize = { width: 60, height: 60 }
    }

    addElement({
      type: tool.type,
      variant: tool.variant,
      name: tool.label,
      position: { x: centerX - defaultSize.width / 2, y: centerY - defaultSize.height / 2 },
      size: defaultSize,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      layer: currentDesign.elements.length,
      properties: {
        ...tool.defaultProps,
      },
    })
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="px-2 mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Outils
          </h2>
        </div>

        <Accordion type="multiple" defaultValue={['dynamic', 'visual', 'shapes']} className="space-y-2">
          {/* Contenu dynamique */}
          <AccordionItem value="dynamic" className="border-slate-800">
            <AccordionTrigger className="text-sm font-medium text-slate-300 hover:text-slate-100 px-2">
              Contenu dynamique
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="grid grid-cols-2 gap-2">
                {dynamicContentTools.map((tool) => (
                  <ToolButton key={tool.id} tool={tool} onClick={() => handleToolClick(tool)} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Éléments visuels */}
          <AccordionItem value="visual" className="border-slate-800">
            <AccordionTrigger className="text-sm font-medium text-slate-300 hover:text-slate-100 px-2">
              Éléments visuels
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="grid grid-cols-2 gap-2">
                {visualElementsTools.map((tool) => (
                  <ToolButton key={tool.id} tool={tool} onClick={() => handleToolClick(tool)} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Formes & Layout */}
          <AccordionItem value="shapes" className="border-slate-800">
            <AccordionTrigger className="text-sm font-medium text-slate-300 hover:text-slate-100 px-2">
              Formes & Layout
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="grid grid-cols-2 gap-2">
                {shapesTools.map((tool) => (
                  <ToolButton key={tool.id} tool={tool} onClick={() => handleToolClick(tool)} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ScrollArea>
  )
}

interface ToolButtonProps {
  tool: Tool
  onClick: () => void
}

function ToolButton({ tool, onClick }: ToolButtonProps) {
  const Icon = tool.icon

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-orange-500/50 transition-colors group"
    >
      <Icon className="w-5 h-5 text-slate-300 group-hover:text-orange-400 transition-colors" />
      <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
        {tool.label}
      </span>
    </motion.button>
  )
}

