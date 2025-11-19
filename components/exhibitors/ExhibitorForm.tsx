'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const exhibitorSchema = z.object({
  companyName: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  boothNumber: z.string().optional(),
  boothLocation: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  paymentAmount: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), {
      message: "Veuillez saisir un montant valide"
    })
});

type ExhibitorFormValues = z.infer<typeof exhibitorSchema>;

export function ExhibitorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ExhibitorFormValues>({
    resolver: zodResolver(exhibitorSchema),
    defaultValues: {
      companyName: "",
      slug: "",
      contactEmail: ""
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    console.log("📨 Envoi du formulaire exposant", values);
    // TODO: intégrer Supabase mutation
    setTimeout(() => setIsSubmitting(false), 800);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Informations entreprise</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
            <Input id="companyName" {...form.register("companyName")} placeholder="Xarala Solutions" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug boutique</Label>
            <Input id="slug" {...form.register("slug")} placeholder="xarala-solutions" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              {...form.register("description")}
              placeholder="Présentez l'entreprise et sa proposition de valeur."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact principal</Label>
            <Input id="contactName" {...form.register("contactName")} placeholder="Aïssatou Ndiaye" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              {...form.register("contactEmail")}
              placeholder="contact@xarala.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Téléphone</Label>
            <Input id="contactPhone" {...form.register("contactPhone")} placeholder="+221 77 000 00 00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Site web</Label>
            <Input id="website" {...form.register("website")} placeholder="https://xarala.com" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stand & catégorisation</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="boothNumber">Numéro de stand</Label>
            <Input id="boothNumber" {...form.register("boothNumber")} placeholder="A12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="boothLocation">Zone / Hall</Label>
            <Input id="boothLocation" {...form.register("boothLocation")} placeholder="Hall Innovation" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Input id="category" {...form.register("category")} placeholder="Technologie" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input id="tags" {...form.register("tags")} placeholder="SaaS, IA, Automation" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paiement & activation</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="paymentAmount">Montant (XOF)</Label>
            <Input id="paymentAmount" {...form.register("paymentAmount")} placeholder="150000" />
          </div>
          <div className="space-y-2">
            <Label>Activation immédiate ?</Label>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
          {isSubmitting ? "Enregistrement..." : "Enregistrer l'exposant"}
        </Button>
      </div>
    </form>
  );
}

export function ExhibitorSettings() {
  const [autoApprove, setAutoApprove] = useState(true);
  const [qrEnabled, setQrEnabled] = useState(true);

  return (
    <Card className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Paramètres généraux</h2>
        <p className="text-sm text-slate-500">
          Définissez les règles d&apos;inscription, les options de paiement et l&apos;expérience digitale proposée aux exposants.
        </p>
      </div>
      <Separator />
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Approbation automatique</h3>
            <p className="text-sm text-slate-500">
              Lorsque cette option est activée, les exposants sont ajoutés immédiatement au catalogue public.
            </p>
          </div>
          <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
        </div>
        <Separator />
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">QR codes dynamiques</h3>
            <p className="text-sm text-slate-500">
              Permet aux exposants de générer un QR code unique pour leur stand et leurs produits.
            </p>
          </div>
          <Switch checked={qrEnabled} onCheckedChange={setQrEnabled} />
        </div>
      </div>
    </Card>
  );
}

