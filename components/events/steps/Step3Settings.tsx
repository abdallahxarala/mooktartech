import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface Step3Props {
  data: any
  onChange: (data: any) => void
}

export function Step3Settings({ data, onChange }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="max_attendees">Capacité maximale</Label>
        <Input
          id="max_attendees"
          type="number"
          min="1"
          value={data.max_attendees ?? ''}
          onChange={(event) =>
            onChange({
              max_attendees: event.target.value
                ? parseInt(event.target.value, 10)
                : null
            })
          }
          placeholder="Laisser vide pour illimité"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="registration_required"
          checked={data.registration_required}
          onCheckedChange={(checked) =>
            onChange({ registration_required: checked })
          }
        />
        <Label htmlFor="registration_required">
          Inscription obligatoire
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_public"
          checked={data.is_public}
          onCheckedChange={(checked) => onChange({ is_public: checked })}
        />
        <Label htmlFor="is_public">
          Événement public (visible sur la page /events)
        </Label>
      </div>
    </div>
  )
}

