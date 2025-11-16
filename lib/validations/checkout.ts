import { z } from 'zod'
import { PAYMENT_METHODS } from '@/types/payment'

export const senegalPhoneRegex = /^\+221(7[05678]|3[03])\d{7}$/

export const checkoutFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: 'Prénom requis' })
      .max(80, { message: 'Prénom trop long' }),
    lastName: z
      .string()
      .min(1, { message: 'Nom requis' })
      .max(80, { message: 'Nom trop long' }),
    email: z.string().email({ message: 'Adresse email invalide' }),
    phone: z
      .string()
      .min(8, { message: 'Téléphone requis' })
      .refine(
        (value) => senegalPhoneRegex.test(value.replace(/\s+/g, '')),
        { message: 'Numéro sénégalais invalide (+221 XX XXX XX XX)' }
      ),
    address: z
      .string()
      .min(5, { message: 'Adresse requise' })
      .max(160, { message: 'Adresse trop longue' }),
    city: z
      .string()
      .min(2, { message: 'Ville requise' })
      .max(80, { message: 'Ville trop longue' }),
    deliveryMethod: z.enum(['pickup', 'delivery'], {
      required_error: 'Méthode de livraison requise'
    }),
    deliveryAddress: z.string().optional(),
    paymentMethod: z.enum(PAYMENT_METHODS, {
      required_error: 'Méthode de paiement requise'
    }),
    notes: z.string().max(200).optional()
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === 'delivery') {
      if (!data.deliveryAddress || data.deliveryAddress.trim().length < 5) {
        ctx.addIssue({
          path: ['deliveryAddress'],
          code: z.ZodIssueCode.custom,
          message: 'Adresse de livraison requise'
        })
      }
    }
  })

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>

