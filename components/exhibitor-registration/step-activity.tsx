/**
 * Étape 2: Activité
 */

'use client'

import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ACTIVITY_CATEGORIES } from '@/lib/schemas/exhibitor-registration.schema'
import type { ExhibitorRegistrationFormData } from '@/lib/schemas/exhibitor-registration.schema'
import { Briefcase } from 'lucide-react'

export function StepActivity() {
  const form = useFormContext<ExhibitorRegistrationFormData>()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Secteur d'activité</h2>
        <p className="text-gray-600">Sélectionnez le secteur d'activité de votre entreprise</p>
      </div>

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5" />
              Catégorie *
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {ACTIVITY_CATEGORIES.map((category) => (
                  <div
                    key={category.value}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-orange-500 ${
                      field.value === category.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => field.onChange(category.value)}
                  >
                    <RadioGroupItem value={category.value} id={category.value} />
                    <Label
                      htmlFor={category.value}
                      className="flex items-center gap-2 cursor-pointer flex-1 text-base font-medium"
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <span>{category.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormDescription className="mt-4">
              Choisissez la catégorie qui correspond le mieux à votre activité
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

