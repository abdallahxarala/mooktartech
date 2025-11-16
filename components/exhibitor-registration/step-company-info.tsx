/**
 * Étape 1: Informations entreprise
 */

'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Building2, User, Mail, Phone, Globe, FileText } from 'lucide-react'
import type { ExhibitorRegistrationFormData } from '@/lib/schemas/exhibitor-registration.schema'

export function StepCompanyInfo() {
  const form = useFormContext<ExhibitorRegistrationFormData>()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Informations entreprise</h2>
        <p className="text-gray-600">Remplissez les informations de votre entreprise</p>
      </div>

      <div className="space-y-6">
        {/* Nom de l'entreprise */}
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Nom de l'entreprise *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Entreprise XYZ"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormDescription>
                Le nom officiel de votre entreprise
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nom du contact */}
        <FormField
          control={form.control}
          name="contact_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Nom du contact *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Jean Dupont"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormDescription>
                Le nom de la personne à contacter
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="contact@entreprise.com"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormDescription>
                Email de contact principal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Téléphone */}
        <FormField
          control={form.control}
          name="contact_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Téléphone *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  placeholder="+221 XX XXX XX XX"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormDescription>
                Numéro de téléphone avec indicatif pays
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Site web */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Site web
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://www.entreprise.com"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormDescription>
                Site web de votre entreprise (optionnel)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Décrivez votre entreprise en quelques lignes..."
                  className="min-h-[120px] text-base"
                  maxLength={1000}
                />
              </FormControl>
              <FormDescription>
                {field.value?.length || 0} / 1000 caractères
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

