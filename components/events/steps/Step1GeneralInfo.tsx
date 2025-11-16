import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface Step1Props {
  data: any
  onChange: (data: any) => void
}

export function Step1GeneralInfo({ data, onChange }: Step1Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l&apos;événement *</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder="Ex: Conférence Tech Dakar 2025"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(event) =>
            onChange({ description: event.target.value ?? '' })
          }
          placeholder="Décrivez votre événement en quelques mots..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          {data.description?.length ?? 0} caractères
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type d&apos;événement</Label>
        <Select value={data.type} onValueChange={(value) => onChange({ type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="conference">Conférence</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="networking">Networking</SelectItem>
            <SelectItem value="salon">Salon</SelectItem>
            <SelectItem value="formation">Formation</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

