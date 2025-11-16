import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Step2Props {
  data: any
  onChange: (data: any) => void
}

export function Step2DateTime({ data, onChange }: Step2Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_date">Date de début *</Label>
          <Input
            id="start_date"
            type="datetime-local"
            value={data.start_date}
            onChange={(event) => onChange({ start_date: event.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">Date de fin *</Label>
          <Input
            id="end_date"
            type="datetime-local"
            value={data.end_date}
            onChange={(event) => onChange({ end_date: event.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Nom du lieu</Label>
        <Input
          id="location"
          value={data.location}
          onChange={(event) => onChange({ location: event.target.value })}
          placeholder="Ex: King Fahd Palace"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location_address">Adresse complète</Label>
        <Input
          id="location_address"
          value={data.location_address}
          onChange={(event) =>
            onChange({ location_address: event.target.value })
          }
          placeholder="Adresse exacte"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            value={data.city}
            onChange={(event) => onChange({ city: event.target.value })}
            placeholder="Dakar"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Pays</Label>
          <Input
            id="country"
            value={data.country}
            onChange={(event) => onChange({ country: event.target.value })}
            placeholder="Sénégal"
          />
        </div>
      </div>
    </div>
  )
}

