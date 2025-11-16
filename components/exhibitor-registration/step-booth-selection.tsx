/**
 * Étape 3: Choix stand
 */

'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { MapPin, Hash } from 'lucide-react'
import type { ExhibitorRegistrationFormData } from '@/lib/schemas/exhibitor-registration.schema'
import { useMemo } from 'react'

interface BoothSelectionProps {
  foireConfig?: {
    pavillons?: Record<
      string,
      {
        nom: string
        capacite: number
        superficie?: number
        description?: string
      }
    >
    zones?: string[]
  }
}

export function StepBoothSelection({ foireConfig }: BoothSelectionProps) {
  const form = useFormContext<ExhibitorRegistrationFormData>()

  const pavillons = useMemo(() => {
    return foireConfig?.pavillons ? Object.entries(foireConfig.pavillons) : []
  }, [foireConfig])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Choix du stand</h2>
        <p className="text-gray-600">Sélectionnez votre emplacement dans la foire</p>
      </div>

      <div className="space-y-6">
        {/* Pavillon préféré */}
        {pavillons.length > 0 && (
          <FormField
            control={form.control}
            name="preferred_pavillon"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Pavillon préféré
                </FormLabel>
                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pavillons.map(([key, pavillon]) => (
                      <div
                        key={key}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          field.value === key
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => field.onChange(key)}
                      >
                        <div className="font-semibold text-lg mb-1">
                          Pavillon {key}: {pavillon.nom}
                        </div>
                        <div className="text-sm text-gray-600">
                          Capacité: {pavillon.capacite} stands
                          {pavillon.superficie && ` • ${pavillon.superficie} m²`}
                        </div>
                        {pavillon.description && (
                          <div className="text-xs text-gray-500 mt-2">
                            {pavillon.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormDescription>
                  Sélectionnez votre pavillon préféré (optionnel)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Numéro de stand */}
        <FormField
          control={form.control}
          name="booth_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Numéro de stand *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: A-12, B-05"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormDescription>
                Le numéro de votre stand (sera vérifié par l'organisateur)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Emplacement */}
        <FormField
          control={form.control}
          name="booth_location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Emplacement détaillé
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Zone A, Allée principale"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormDescription>
                Informations complémentaires sur l'emplacement (optionnel)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

