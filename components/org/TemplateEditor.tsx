'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { canManageTemplates, OrganizationPlan } from '@/lib/org-permissions'

export interface OrgTemplateRecord {
  id: string
  name: string
  design_json: Record<string, unknown>
  is_default: boolean
  created_at: string
}

interface TemplateEditorProps {
  organizationId: string
  plan: OrganizationPlan
  role: 'owner' | 'admin' | 'member'
  templates: OrgTemplateRecord[]
  onInvalidate?: () => void
}

export function TemplateEditor({
  organizationId,
  plan,
  role,
  templates,
  onInvalidate
}: TemplateEditorProps) {
  const [name, setName] = useState('')
  const [json, setJson] = useState('{}')
  const [isDefault, setIsDefault] = useState(false)
  const [pending, setPending] = useState(false)

  const allowCustomTemplates = plan !== 'free'
  const canEdit = canManageTemplates(role) && allowCustomTemplates

  const handleSave = async () => {
    setPending(true)
    try {
      let parsed: Record<string, unknown>
      try {
        parsed = JSON.parse(json)
      } catch {
        throw new Error('Le JSON de design est invalide.')
      }

      const response = await fetch('/api/org/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          name,
          design: parsed,
          isDefault
        })
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body?.message ?? 'Impossible d’enregistrer le template')
      }

      toast.success('Template enregistré')
      setName('')
      setJson('{}')
      setIsDefault(false)
      onInvalidate?.()
    } catch (error: any) {
      toast.error(error.message ?? 'Erreur enregistrement template')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Templates d’entreprise</h3>
          <p className="text-xs text-slate-500">
            Créez des modèles cohérents pour toutes les cartes de vos collaborateurs.
          </p>
        </div>
        {!allowCustomTemplates && (
          <p className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-600">
            Fonctionnalité disponible à partir du plan PRO.
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id} className="border border-gray-100 bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-semibold text-slate-900">
                {template.name}
                {template.is_default && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-600">
                    Template par défaut
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-40 overflow-auto rounded-lg bg-white p-3 text-xs text-slate-600">
                {JSON.stringify(template.design_json, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}
        {templates.length === 0 && (
          <p className="col-span-full rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-slate-500">
            Aucun template personnalisé. Créez votre premier modèle pour uniformiser vos cartes NFC.
          </p>
        )}
      </div>

      {canEdit && (
        <div className="space-y-4 rounded-2xl border border-orange-100 bg-orange-50 p-4">
          <Input
            placeholder="Nom du template"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <div className="space-y-2">
            <Label htmlFor="design">Design JSON</Label>
            <Textarea
              id="design"
              rows={6}
              value={json}
              onChange={(event) => setJson(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isDefault} onCheckedChange={setIsDefault} />
            <span className="text-sm text-slate-600">Définir comme template par défaut</span>
          </div>
          <Button
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white"
            onClick={handleSave}
            disabled={pending || !name}
          >
            {pending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      )}
    </div>
  )
}

