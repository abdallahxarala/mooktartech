import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/types/database.types'

/**
 * Middleware Supabase pour Xarala Solutions
 * Gestion de l'authentification et du refresh des sessions
 */

// Routes qui nécessitent une authentification
const protectedRoutes = [
  '/dashboard',
  '/card-editor',
  '/analytics',
  '/settings',
  '/admin',
  '/contacts',
  '/payments',
  '/boutique',
]

// Routes API qui nécessitent une authentification
const protectedApiRoutes = [
  '/api/cards',
  '/api/webhooks',
  '/api/analytics',
]

// Routes admin uniquement
const adminRoutes = [
  '/admin',
  '/api/admin',
]

// Fonction pour vérifier si une route est protégée
const isProtectedRoute = (pathname: string): boolean => {
  return protectedRoutes.some(route => 
    pathname.startsWith(`/${route}`) || pathname.startsWith(route)
  )
}

// Fonction pour vérifier si une route API est protégée
const isProtectedApiRoute = (pathname: string): boolean => {
  return protectedApiRoutes.some(route => pathname.startsWith(route))
}

// Fonction pour vérifier si une route est admin
const isAdminRoute = (pathname: string): boolean => {
  return adminRoutes.some(route => pathname.startsWith(route))
}

// Fonction pour extraire la locale d'une URL
const getLocaleFromPath = (pathname: string): string => {
  const segments = pathname.split('/')
  const possibleLocale = segments[1]
  const supportedLocales = ['fr', 'en', 'wo']
  
  return supportedLocales.includes(possibleLocale) ? possibleLocale : 'fr'
}

// Fonction pour vérifier les permissions admin
const checkAdminPermissions = async (supabase: any, userId: string): Promise<boolean> => {
  try {
    const { data: profile } = await supabase
      .from('users')
      .select('role, is_active')
      .eq('id', userId)
      .single()

    return profile?.role === 'admin' && profile?.is_active === true
  } catch (error) {
    console.error('Erreur lors de la vérification des permissions admin:', error)
    return false
  }
}

export async function supabaseMiddleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // Créer le client Supabase pour le middleware
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  try {
    // Rafraîchir la session si nécessaire
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Erreur de session Supabase:', sessionError)
    }

    // Vérifier l'authentification pour les routes protégées
    if (isProtectedRoute(pathname)) {
      if (!session) {
        const locale = getLocaleFromPath(pathname)
        const redirectUrl = new URL(`/${locale}/auth`, req.url)
        redirectUrl.searchParams.set('redirectTo', pathname)
        
        return NextResponse.redirect(redirectUrl)
      }

      // Vérifier les permissions admin pour les routes admin
      if (isAdminRoute(pathname)) {
        const isAdmin = await checkAdminPermissions(supabase, session.user.id)
        
        if (!isAdmin) {
          const locale = getLocaleFromPath(pathname)
          return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url))
        }
      }
    }

    // Vérifier l'authentification pour les routes API protégées
    if (isProtectedApiRoute(pathname)) {
      if (!session) {
        return NextResponse.json(
          { 
            error: 'Non autorisé',
            message: 'Authentification requise',
            code: 'UNAUTHORIZED'
          },
          { status: 401 }
        )
      }

      // Vérifier les permissions admin pour les routes API admin
      if (isAdminRoute(pathname)) {
        const isAdmin = await checkAdminPermissions(supabase, session.user.id)
        
        if (!isAdmin) {
          return NextResponse.json(
            { 
              error: 'Accès refusé',
              message: 'Permissions administrateur requises',
              code: 'FORBIDDEN'
            },
            { status: 403 }
          )
        }
      }
    }

    // Ajouter des headers de sécurité
    res.headers.set('X-Frame-Options', 'DENY')
    res.headers.set('X-Content-Type-Options', 'nosniff')
    res.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    // Headers de cache pour les assets statiques
    if (pathname.startsWith('/_next/static/') || pathname.startsWith('/images/')) {
      res.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }

    // Headers pour les pages dynamiques
    if (pathname.startsWith('/api/')) {
      res.headers.set('Cache-Control', 'no-store, max-age=0')
    }

    return res

  } catch (error) {
    console.error('Erreur dans le middleware Supabase:', error)
    
    // En cas d'erreur, rediriger vers la page d'erreur ou la page d'accueil
    const locale = getLocaleFromPath(pathname)
    return NextResponse.redirect(new URL(`/${locale}/error`, req.url))
  }
}

// Fonction utilitaire pour vérifier l'authentification dans les composants
export async function checkAuth(supabase: any): Promise<{
  isAuthenticated: boolean
  user: any | null
  error: string | null
}> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return {
        isAuthenticated: false,
        user: null,
        error: error.message
      }
    }

    return {
      isAuthenticated: !!user,
      user,
      error: null
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error)
    return {
      isAuthenticated: false,
      user: null,
      error: 'Erreur de vérification de l\'authentification'
    }
  }
}

// Fonction utilitaire pour vérifier les permissions admin
export async function checkAdminPermissions(supabase: any, userId: string): Promise<{
  isAdmin: boolean
  error: string | null
}> {
  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('role, is_active')
      .eq('id', userId)
      .single()

    if (error) {
      return {
        isAdmin: false,
        error: error.message
      }
    }

    const isAdmin = profile?.role === 'admin' && profile?.is_active === true

    return {
      isAdmin,
      error: null
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des permissions admin:', error)
    return {
      isAdmin: false,
      error: 'Erreur de vérification des permissions'
    }
  }
}

// Fonction utilitaire pour obtenir l'utilisateur actuel avec son profil
export async function getCurrentUserWithProfile(supabase: any): Promise<{
  user: any | null
  profile: any | null
  error: string | null
}> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return {
        user: null,
        profile: null,
        error: userError?.message || 'Utilisateur non trouvé'
      }
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return {
        user,
        profile: null,
        error: profileError.message
      }
    }

    return {
      user,
      profile,
      error: null
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur et du profil:', error)
    return {
      user: null,
      profile: null,
      error: 'Erreur de récupération des données utilisateur'
    }
  }
}

// Fonction utilitaire pour gérer les erreurs d'authentification
export function handleAuthError(error: any): string {
  if (error?.message?.includes('JWT')) {
    return 'Session expirée. Veuillez vous reconnecter.'
  }
  
  if (error?.message?.includes('RLS')) {
    return 'Accès non autorisé.'
  }
  
  if (error?.message?.includes('network')) {
    return 'Erreur de connexion. Vérifiez votre connexion internet.'
  }
  
  if (error?.message?.includes('rate limit')) {
    return 'Trop de tentatives. Veuillez patienter avant de réessayer.'
  }
  
  return 'Une erreur d\'authentification s\'est produite.'
}

// Export des constantes pour utilisation dans d'autres fichiers
export const SUPABASE_MIDDLEWARE_CONFIG = {
  protectedRoutes,
  protectedApiRoutes,
  adminRoutes,
} as const
