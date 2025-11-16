'use client'

import { useBadgeDesignerStore } from '@/lib/store/badge-designer-store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function PropertiesPanel() {
  const { currentDesign, selectedElementId, updateElement, setTemplate } =
    useBadgeDesignerStore()

  if (!currentDesign) {
    return (
      <div className="p-4 text-center text-slate-400">
        <p>Aucun design chargé</p>
      </div>
    )
  }

  const selectedElement = currentDesign.elements.find(
    (el) => el.id === selectedElementId
  )

  // Si aucun élément sélectionné, afficher les propriétés globales du badge
  if (!selectedElement) {
    return <GlobalProperties design={currentDesign} onTemplateChange={setTemplate} />
  }

  // Afficher les propriétés de l'élément sélectionné
  return <ElementProperties element={selectedElement} onUpdate={updateElement} />
}

function GlobalProperties({
  design,
  onTemplateChange,
}: {
  design: any
  onTemplateChange: (template: any) => void
}) {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Propriétés du badge</h3>
      </div>

      <Tabs defaultValue="style" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Template</Label>
            <Select value={design.template} onValueChange={onTemplateChange}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-slate-700" />

          <div className="space-y-2">
            <Label className="text-slate-300">Format</Label>
            <div className="text-sm text-slate-400">
              {design.dimensions.width} × {design.dimensions.height} mm
            </div>
            <div className="text-xs text-slate-500">
              {design.dimensions.dpi} DPI
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dimensions" className="space-y-4 mt-4">
          <div className="text-sm text-slate-400">
            Dimensions fixes (CR80 standard)
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ElementProperties({
  element,
  onUpdate,
}: {
  element: any
  onUpdate: (id: string, updates: any) => void
}) {
  const handlePropertyChange = (property: string, value: any) => {
    onUpdate(element.id, {
      properties: {
        ...element.properties,
        [property]: value,
      },
    })
  }

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    onUpdate(element.id, {
      position: {
        ...element.position,
        [axis]: value,
      },
    })
  }

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    onUpdate(element.id, {
      size: {
        ...element.size,
        [dimension]: value,
      },
    })
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-1">{element.name}</h3>
        <p className="text-xs text-slate-400 capitalize">{element.type}</p>
      </div>

      <Tabs defaultValue="style" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="position">Position</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
        </TabsList>

        {/* Style Tab */}
        <TabsContent value="style" className="space-y-4 mt-4">
          {element.type === 'text' && (
            <>
              <div className="space-y-2">
                <Label className="text-slate-300">Contenu</Label>
                <Input
                  value={element.properties.text || ''}
                  onChange={(e) => handlePropertyChange('text', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Police</Label>
                <Select
                  value={element.properties.fontFamily || 'Arial'}
                  onValueChange={(value) => handlePropertyChange('fontFamily', value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">
                  Taille: {element.properties.fontSize || 20}px
                </Label>
                <Slider
                  value={[element.properties.fontSize || 20]}
                  onValueChange={([value]) => handlePropertyChange('fontSize', value)}
                  min={8}
                  max={72}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Couleur</Label>
                <Input
                  type="color"
                  value={element.properties.color || '#000000'}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                  className="h-10 bg-slate-800 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Alignement</Label>
                <Select
                  value={element.properties.alignment || 'left'}
                  onValueChange={(value) => handlePropertyChange('alignment', value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Gauche</SelectItem>
                    <SelectItem value="center">Centre</SelectItem>
                    <SelectItem value="right">Droite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {element.type === 'shape' && (
            <>
              <div className="space-y-2">
                <Label className="text-slate-300">Couleur de fond</Label>
                <Input
                  type="color"
                  value={element.properties.fillColor || '#f3f4f6'}
                  onChange={(e) => handlePropertyChange('fillColor', e.target.value)}
                  className="h-10 bg-slate-800 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Couleur de bordure</Label>
                <Input
                  type="color"
                  value={element.properties.strokeColor || 'transparent'}
                  onChange={(e) => handlePropertyChange('strokeColor', e.target.value)}
                  className="h-10 bg-slate-800 border-slate-700"
                />
              </div>

              {element.properties.shape === 'rectangle' && (
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Rayon: {element.properties.borderRadius || 0}px
                  </Label>
                  <Slider
                    value={[element.properties.borderRadius || 0]}
                    onValueChange={([value]) => handlePropertyChange('borderRadius', value)}
                    min={0}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </>
          )}

          {element.type === 'image' && (
            <>
              <div className="space-y-2">
                <Label className="text-slate-300">Image</Label>
                <Button
                  variant="outline"
                  className="w-full bg-slate-800 border-slate-700 text-slate-200"
                >
                  Remplacer l'image
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">
                  Rayon: {element.properties.borderRadius || 0}px
                </Label>
                <Slider
                  value={[element.properties.borderRadius || 0]}
                  onValueChange={([value]) => handlePropertyChange('borderRadius', value)}
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
            </>
          )}
        </TabsContent>

        {/* Position Tab */}
        <TabsContent value="position" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-300">X (mm)</Label>
              <Input
                type="number"
                value={element.position.x.toFixed(1)}
                onChange={(e) => handlePositionChange('x', parseFloat(e.target.value) || 0)}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Y (mm)</Label>
              <Input
                type="number"
                value={element.position.y.toFixed(1)}
                onChange={(e) => handlePositionChange('y', parseFloat(e.target.value) || 0)}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
          </div>

          <Separator className="bg-slate-700" />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-300">Largeur (mm)</Label>
              <Input
                type="number"
                value={element.size.width.toFixed(1)}
                onChange={(e) => handleSizeChange('width', parseFloat(e.target.value) || 0)}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Hauteur (mm)</Label>
              <Input
                type="number"
                value={element.size.height.toFixed(1)}
                onChange={(e) => handleSizeChange('height', parseFloat(e.target.value) || 0)}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Opacité</Label>
            <Slider
              value={[element.opacity * 100]}
              onValueChange={([value]) =>
                onUpdate(element.id, { opacity: value / 100 })
              }
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-4 mt-4">
          {element.type === 'qr' && (
            <div className="space-y-2">
              <Label className="text-slate-300">Données QR</Label>
              <Input
                value={element.properties.data || ''}
                onChange={(e) => handlePropertyChange('data', e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-100"
                placeholder="https://example.com"
              />
            </div>
          )}

          <div className="text-sm text-slate-400">
            ID: <code className="text-xs">{element.id}</code>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

