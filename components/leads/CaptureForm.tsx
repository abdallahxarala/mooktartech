"use client"

import { useState } from "react"
import { z } from "zod"
import { toast } from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const captureSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
})

interface CaptureFormProps {
  trigger?: React.ReactNode
  cardId: string
  organizationId?: string
  capturedBy?: string
  source?: string
  metadata?: Record<string, unknown>
  onCaptured?: () => void
}

export function CaptureForm({
  trigger,
  cardId,
  organizationId,
  capturedBy,
  source = "nfc_scan",
  metadata,
  onCaptured,
}: CaptureFormProps) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const parse = captureSchema.safeParse(formState)
    if (!parse.success) {
      toast.error(parse.error.errors[0]?.message ?? "Formulaire invalide")
      return
    }

    setPending(true)
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId,
          organizationId,
          capturedBy,
          source,
          metadata,
          ...formState,
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body?.error ?? "Enregistrement impossible")
      }

      toast.success("Contact enregistré !")
      setOpen(false)
      setFormState({
        name: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
      })
      onCaptured?.()
    } catch (error: any) {
      toast.error(error.message ?? "Erreur lors de l'enregistrement")
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Échanger vos contacts</DialogTitle>
          <DialogDescription>
            Laissez vos coordonnées pour que ce contact puisse vous recontacter facilement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Nom complet *</Label>
            <Input
              id="lead-name"
              value={formState.name}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-email">Email</Label>
            <Input
              id="lead-email"
              type="email"
              value={formState.email}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="vous@entreprise.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-phone">Téléphone</Label>
            <Input
              id="lead-phone"
              value={formState.phone}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, phone: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-company">Entreprise</Label>
            <Input
              id="lead-company"
              value={formState.company}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, company: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-notes">Note</Label>
            <Textarea
              id="lead-notes"
              value={formState.notes}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, notes: event.target.value }))
              }
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white"
            disabled={pending}
          >
            {pending ? "Enregistrement..." : "Envoyer mes coordonnées"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

