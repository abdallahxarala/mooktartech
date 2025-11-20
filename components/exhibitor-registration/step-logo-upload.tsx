/**
 * Étape 4: Upload logo
 */

'use client'

import { useFormContext } from 'react-hook-form'
// Temporarily disabled due to build error
// import { ImageUpload } from '@/components/ui/image-upload'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { ImageIcon } from 'lucide-react'
import type { ExhibitorRegistrationFormData } from '@/lib/schemas/exhibitor-registration.schema'

interface StepLogoUploadProps {
  onUpload: (file: File) => Promise<string | null>
  isUploading: boolean
}

export function StepLogoUpload({ onUpload, isUploading }: StepLogoUploadProps) {
  const form = useFormContext<ExhibitorRegistrationFormData>()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Logo de l'entreprise</h2>
        <p className="text-gray-600">Téléchargez le logo de votre entreprise</p>
      </div>

      <FormField
        control={form.control}
        name="logo_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5" />
              Logo *
            </FormLabel>
            <div className="max-w-md mx-auto">
              {/* Temporarily disabled due to build error */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    // TODO: Implement file upload
                    console.log('File selected:', file.name)
                  }
                }}
                disabled={isUploading}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg"
              />
            </div>
            <FormDescription className="text-center mt-4">
              Format recommandé: PNG ou JPG, carré, minimum 400x400px
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

