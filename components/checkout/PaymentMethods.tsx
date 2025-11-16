'use client'

import { UseFormReturn } from 'react-hook-form'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Wallet } from 'lucide-react'
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

interface PaymentMethodsProps {
  form: UseFormReturn<CheckoutFormValues>
}

const paymentOptions = [
  {
    value: 'orange_money' as const,
    title: 'Orange Money WebPay',
    description: 'Paiement mobile sécurisé via Orange Money, confirmation instantanée.',
    icon: Smartphone,
    badge: 'Recommandé'
  },
  {
    value: 'wave' as const,
    title: 'Wave Money',
    description: 'Code marchand Wave ou QR Code, frais réduits.',
    icon: Smartphone
  },
  {
    value: 'stripe' as const,
    title: 'Carte bancaire (Visa / Mastercard)',
    description: 'Paiement international sécurisé via Stripe Checkout.',
    icon: CreditCard
  },
  {
    value: 'cash' as const,
    title: 'Espèces à la livraison',
    description: 'Payez directement au livreur sur Dakar et sa banlieue.',
    icon: Wallet
  },
  {
    value: 'bank_transfer' as const,
    title: 'Virement bancaire',
    description: 'RIB envoyé par email après validation de la commande.',
    icon: CreditCard
  }
]

export function PaymentMethods({ form }: PaymentMethodsProps) {
  return (
    <motion.div
      key="payment-methods"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-6"
    >
      <FormField
        control={form.control}
        name="paymentMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Méthode de paiement</FormLabel>
            <FormControl>
              <RadioGroup className="grid gap-4 md:grid-cols-2" value={field.value} onValueChange={field.onChange}>
                {paymentOptions.map(({ value, title, description, icon: Icon, badge }) => (
                  <label key={value}>
                    <Card className="h-full cursor-pointer border-2 transition-all hover:border-pink-400">
                      <CardHeader className="space-y-3">
                        <div className="flex items-center justify-between">
                          <RadioGroupItem value={value} />
                          {badge && (
                            <span className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
                              {badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <CardTitle className="text-base">{title}</CardTitle>
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
    </motion.div>
  )
}

