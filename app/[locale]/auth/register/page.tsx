import { Metadata } from 'next'
import { getTranslations } from '@/lib/utils/next-intl-server-fallback'
import RegisterForm from '@/components/auth/register-form'

/**
 * Métadonnées SEO pour la page d'inscription
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.register')
  
  return {
    title: t('title'),
    description: t('metaDescription'),
    robots: {
      index: false, // Ne pas indexer les pages d'authentification
      follow: false,
    },
  }
}

/**
 * Page d'inscription pour Xarala Solutions
 * Affiche le formulaire d'inscription avec design moderne et animations
 */
export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Pattern de fond subtil */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="register-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="20"
                cy="20"
                r="1"
                fill="currentColor"
                className="text-primary-200"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#register-pattern)" />
        </svg>
      </div>

      {/* Formes géométriques décoratives */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent-100 rounded-full blur-2xl opacity-40" />
      <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-primary-200 rounded-full blur-xl opacity-30" />

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
