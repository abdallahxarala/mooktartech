'use client'

import { UseFormReturn, useWatch } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Home, MapPin } from 'lucide-react'
import { CheckoutFormValues } from '@/lib/validations/checkout'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface DeliveryOptionsProps {
  form: UseFormReturn<CheckoutFormValues>
}

const deliveryChoices = [
  {
    value: 'pickup' as const,
    title: 'Retrait express Dakar (24h)',
    description: 'Disponible au showroom Yarakh du lundi au vendredi, 9h-18h.',
    icon: Home
  },
  {
    value: 'delivery' as const,
    title: 'Livraison partout au Sénégal',
    description: 'Livraison standard 48h. Gratuite à partir de 500 000 FCFA.',
    icon: MapPin
  }
]

export function DeliveryOptions({ form }: DeliveryOptionsProps) {
  const deliveryMethod = useWatch({
    control: form.control,
    name: 'deliveryMethod'
  })

  return (
    <motion.div
      key="delivery-options"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-6"
    >
      <FormField
        control={form.control}
        name="deliveryMethod"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid gap-4 sm:grid-cols-2"
              >
                {deliveryChoices.map(({ value, title, description, icon: Icon }) => (
                  <label key={value}>
                    <Card
                      className="h-full cursor-pointer border-2 transition-all hover:border-orange-400"
                      data-active={field.value === value}
                    >
                      <CardHeader className="flex flex-row items-center gap-3">
                        <RadioGroupItem value={value} className="mt-1" />
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/10 to-pink-500/10 text-orange-600">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <CardTitle className="text-lg">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </label>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {deliveryMethod === 'delivery' && (
        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse de livraison détaillée</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Ex : Immeuble Mansoura, 3e étage, Appartement 5"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </motion.div>
  )
}

