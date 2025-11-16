/**
 * Schéma Zod pour la validation du formulaire d'inscription exposant
 */

import { z } from 'zod'

// Catégories d'activité avec icônes
export const ACTIVITY_CATEGORIES = [
  { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { value: 'industrie', label: 'Industrie', icon: '🏭' },
  { value: 'services', label: 'Services', icon: '💼' },
  { value: 'technologie', label: 'Technologie', icon: '💻' },
  { value: 'commerce', label: 'Commerce', icon: '🛒' },
  { value: 'artisanat', label: 'Artisanat', icon: '🎨' },
  { value: 'tourisme', label: 'Tourisme', icon: '✈️' },
  { value: 'sante', label: 'Santé', icon: '🏥' },
  { value: 'education', label: 'Éducation', icon: '📚' },
  { value: 'immobilier', label: 'Immobilier', icon: '🏠' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'autre', label: 'Autre', icon: '📦' },
] as const

export type ActivityCategory = typeof ACTIVITY_CATEGORIES[number]['value']

// Étape 1: Informations entreprise
export const companyInfoSchema = z.object({
  company_name: z
    .string()
    .min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères')
    .max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères'),
  contact_name: z
    .string()
    .min(2, 'Le nom du contact doit contenir au moins 2 caractères')
    .max(100, 'Le nom du contact ne peut pas dépasser 100 caractères'),
  contact_email: z
    .string()
    .email('Email invalide')
    .min(5, 'L\'email doit contenir au moins 5 caractères'),
  contact_phone: z
    .string()
    .regex(/^\+?[0-9]{9,15}$/, 'Numéro de téléphone invalide')
    .min(9, 'Le numéro de téléphone doit contenir au moins 9 chiffres'),
  website: z
    .string()
    .url('URL invalide')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional(),
})

// Étape 2: Activité
export const activitySchema = z.object({
  category: z.enum([
    'agriculture',
    'industrie',
    'services',
    'technologie',
    'commerce',
    'artisanat',
    'tourisme',
    'sante',
    'education',
    'immobilier',
    'finance',
    'autre',
  ] as const),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags autorisés').optional(),
})

// Étape 3: Choix stand
export const boothSchema = z.object({
  booth_number: z
    .string()
    .min(1, 'Le numéro de stand est requis')
    .max(20, 'Le numéro de stand ne peut pas dépasser 20 caractères'),
  booth_location: z
    .string()
    .max(100, 'L\'emplacement ne peut pas dépasser 100 caractères')
    .optional(),
  preferred_pavillon: z.string().optional(),
})

// Étape 4: Upload logo
export const logoSchema = z.object({
  logo_url: z.string().url('URL invalide').optional().or(z.literal('')),
})

// Étape 5: Paiement
export const paymentSchema = z.object({
  payment_method: z.enum(['wave', 'orange-money', 'free-money', 'bank-transfer']),
  payment_amount: z.number().positive('Le montant doit être positif'),
  currency: z.enum(['XOF', 'EUR', 'USD']).default('XOF'),
  payment_confirmed: z.boolean().refine((val) => val === true, {
    message: 'Vous devez confirmer le paiement',
  }),
})

// Schéma complet du formulaire
export const exhibitorRegistrationSchema = z.object({
  // Étape 1
  company_name: companyInfoSchema.shape.company_name,
  contact_name: companyInfoSchema.shape.contact_name,
  contact_email: companyInfoSchema.shape.contact_email,
  contact_phone: companyInfoSchema.shape.contact_phone,
  website: companyInfoSchema.shape.website,
  description: companyInfoSchema.shape.description,

  // Étape 2
  category: activitySchema.shape.category,
  tags: activitySchema.shape.tags,

  // Étape 3
  booth_number: boothSchema.shape.booth_number,
  booth_location: boothSchema.shape.booth_location,
  preferred_pavillon: boothSchema.shape.preferred_pavillon,

  // Étape 4
  logo_url: logoSchema.shape.logo_url,

  // Étape 5
  payment_method: paymentSchema.shape.payment_method,
  payment_amount: paymentSchema.shape.payment_amount,
  currency: paymentSchema.shape.currency,
  payment_confirmed: paymentSchema.shape.payment_confirmed,
})

export type ExhibitorRegistrationFormData = z.infer<typeof exhibitorRegistrationSchema>

// Schémas par étape pour validation progressive
export const stepSchemas = {
  1: companyInfoSchema,
  2: activitySchema,
  3: boothSchema,
  4: logoSchema,
  5: paymentSchema,
} as const

