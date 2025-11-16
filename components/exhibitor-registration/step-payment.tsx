/**
 * Étape 5: Paiement
 */

'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { CreditCard, CheckCircle2 } from 'lucide-react'
import type { ExhibitorRegistrationFormData } from '@/lib/schemas/exhibitor-registration.schema'
import { paymentProviders } from '@/lib/config/payment-providers'

export function StepPayment() {
  const form = useFormContext<ExhibitorRegistrationFormData>()

  const paymentMethod = form.watch('payment_method')
  const selectedProvider = paymentProviders.find((p) => p.id === paymentMethod)

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Paiement</h2>
        <p className="text-gray-600">Finalisez votre inscription</p>
      </div>

      <div className="space-y-6">
        {/* Montant */}
        <FormField
          control={form.control}
          name="payment_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Montant (XOF) *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="50000"
                  className="h-12 text-base"
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Montant de l'inscription en francs CFA
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Méthode de paiement */}
        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold mb-4 block">
                Méthode de paiement *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-3"
                >
                  {paymentProviders
                    .filter((p) => ['wave', 'orange-money', 'free-money', 'bank-transfer'].includes(p.id))
                    .map((provider) => (
                      <div
                        key={provider.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          field.value === provider.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => field.onChange(provider.id)}
                      >
                        <RadioGroupItem value={provider.id} id={provider.id} />
                        <Label
                          htmlFor={provider.id}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-semibold text-base">{provider.name}</div>
                          <div className="text-sm text-gray-600">{provider.description}</div>
                          {provider.fees > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Frais: {provider.fees}%
                            </div>
                          )}
                        </Label>
                      </div>
                    ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirmation */}
        <FormField
          control={form.control}
          name="payment_confirmed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-2 p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Confirmation *
                </FormLabel>
                <FormDescription className="text-sm">
                  Je confirme avoir effectué le paiement de{' '}
                  <span className="font-semibold">
                    {form.watch('payment_amount').toLocaleString()} XOF
                  </span>{' '}
                  via {selectedProvider?.name || 'la méthode sélectionnée'}
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Résumé */}
        {selectedProvider && (
          <div className="bg-gray-50 rounded-lg p-6 space-y-2">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Montant:</span>
              <span className="font-bold text-orange-600">
                {form.watch('payment_amount').toLocaleString()} XOF
              </span>
            </div>
            {selectedProvider.fees > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Frais ({selectedProvider.fees}%):</span>
                <span>
                  {Math.round(
                    (form.watch('payment_amount') * selectedProvider.fees) / 100
                  ).toLocaleString()}{' '}
                  XOF
                </span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-orange-600">
                {(
                  form.watch('payment_amount') +
                  (form.watch('payment_amount') * (selectedProvider.fees || 0)) / 100
                ).toLocaleString()}{' '}
                XOF
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

