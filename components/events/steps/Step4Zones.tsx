import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface Step4Props {
  data: any
  onChange: (data: any) => void
}

const ACCESS_LEVELS = ['attendee', 'vip', 'staff', 'exhibitor', 'speaker']

export function Step4Zones({ data, onChange }: Step4Props) {
  const [newZone, setNewZone] = useState({
    name: '',
    type: 'general',
    capacity: null as number | null,
    access_levels: ['attendee']
  })

  const addZone = () => {
    if (!newZone.name.trim()) return
    onChange({
      zones: [...data.zones, newZone]
    })
    setNewZone({
      name: '',
      type: 'general',
      capacity: null,
      access_levels: ['attendee']
    })
  }

  const removeZone = (index: number) => {
    onChange({
      zones: data.zones.filter((_: any, zoneIndex: number) => zoneIndex !== index)
    })
  }

  const toggleAccessLevel = (level: string) => {
    setNewZone((prev) => ({
      ...prev,
      access_levels: prev.access_levels.includes(level)
        ? prev.access_levels.filter((item) => item !== level)
        : [...prev.access_levels, level]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Zones configurées</h3>
        {data.zones.length === 0 ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/40 py-8 text-center text-muted-foreground">
            <p>Aucune zone configurée.</p>
            <p className="text-sm">
              Ajoutez des zones pour gérer les accès (VIP, backstage, etc.).
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.zones.map((zone: any, index: number) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{zone.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Type : {zone.type} • Capacité : {zone.capacity ?? 'Illimitée'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {zone.access_levels.map((level: string) => (
                      <Badge key={level} variant="secondary" className="text-xs">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeZone(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 border-t pt-6">
        <h3 className="font-medium">Ajouter une zone</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nom de la zone</Label>
            <Input
              value={newZone.name}
              onChange={(event) => setNewZone({ ...newZone, name: event.target.value })}
              placeholder="Ex: Salle plénière"
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={newZone.type}
              onValueChange={(value) => setNewZone({ ...newZone, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Générale</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="backstage">Backstage</SelectItem>
                <SelectItem value="expo">Exposition</SelectItem>
                <SelectItem value="conference">Conférence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Capacité (optionnel)</Label>
          <Input
            type="number"
            min="1"
            value={newZone.capacity ?? ''}
            onChange={(event) =>
              setNewZone({
                ...newZone,
                capacity: event.target.value
                  ? parseInt(event.target.value, 10)
                  : null
              })
            }
            placeholder="Laisser vide pour illimité"
          />
        </div>

        <div className="space-y-2">
          <Label>Niveaux d&apos;accès</Label>
          <div className="flex flex-wrap gap-2">
            {ACCESS_LEVELS.map((level) => (
              <Badge
                key={level}
                variant={newZone.access_levels.includes(level) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleAccessLevel(level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={addZone} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter cette zone
        </Button>
      </div>
    </div>
  )
}

