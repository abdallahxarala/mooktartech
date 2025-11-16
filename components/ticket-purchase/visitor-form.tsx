/**
 * Formulaire d'informations visiteur
 */

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Form } from '@/components/ui/form'
import { User, Mail, Phone } from 'lucide-react'
import type { VisitorInfo } from '@/lib/types/ticket'

const visitorSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z
    .string()
    .regex(/^\+?[0-9]{9,15}$/, 'Numéro de téléphone invalide')
    .min(9, 'Le numéro de téléphone doit contenir au moins 9 chiffres'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
})

type VisitorFormData = z.infer<typeof visitorSchema>

interface VisitorFormProps {
  initialData?: Partial<VisitorInfo>
  onSubmit: (data: VisitorInfo) => void
}

export function VisitorForm({ initialData, onSubmit }: VisitorFormProps) {
  const form = useForm<VisitorFormData>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
    },
  })

  const handleSubmit = (data: VisitorFormData) => {
    onSubmit({
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      email: data.email || undefined,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Informations visiteur</h2>
          <p className="text-gray-600">Remplissez vos informations pour finaliser l'achat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prénom */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Prénom *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Jean"
                    className="h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nom */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Nom *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Dupont"
                    className="h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Téléphone */}
        <FormField
          control={form.control}
          name="phone"
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
                Numéro de téléphone avec indicatif pays (pour recevoir le QR code par SMS)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="jean.dupont@example.com"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormDescription>
                Email optionnel (pour recevoir la confirmation)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

