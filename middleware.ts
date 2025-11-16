import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n.config';

/**
 * Middleware Next.js 14 pour Xarala Solutions
 * Gère l'internationalisation et l'authentification
 */

// Configuration du middleware d'internationalisation
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  // Détection automatique de la langue basée sur Accept-Language
  localeDetection: true,
});

// Routes protégées nécessitant une authentification
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/profile',
  '/settings',
  '/orders',
  '/analytics',
  '/contacts',
  '/payments'
];

// Routes de redirection
const redirectRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
];

// Routes API protégées
const protectedApiRoutes = [
  '/api/cards',
  '/api/orders',
  '/api/analytics',
  '/api/webhooks'
];

/**
 * Vérifie si une route est protégée
 */
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

/**
 * Vérifie si une route API est protégée
 */
function isProtectedApiRoute(pathname: string): boolean {
  return protectedApiRoutes.some(route => pathname.startsWith(route));
}

/**
 * Vérifie si une route doit être redirigée
 */
function shouldRedirect(pathname: string): boolean {
  return redirectRoutes.some(route => pathname.startsWith(route));
}

/**
 * Extrait la locale du chemin
 */
function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/');
  const locale = segments[1];
  return locales.includes(locale as any) ? locale : null;
}

/**
 * Vérifie si une route est une route admin
 */
function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Autoriser explicitement les routes API publiques (pas d'auth)
  if (pathname.startsWith('/api/orders') || pathname.startsWith('/api/payment') || pathname.startsWith('/api/contact')) {
    return NextResponse.next();
  }

  // 1. Redirection de la racine vers la locale par défaut
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // 2. Gestion des routes publiques non localisées
  if (!getLocaleFromPath(pathname) && !pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    // Rediriger vers la version localisée
    const locale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || defaultLocale;
    const validLocale = locales.includes(locale as any) ? locale : defaultLocale;
    return NextResponse.redirect(new URL(`/${validLocale}${pathname}`, request.url));
  }

  // 3. Gestion des routes API protégées
  if (isProtectedApiRoute(pathname)) {
    try {
      const response = NextResponse.next();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              response.cookies.set({
                name,
                value,
                ...options,
              });
            },
            remove(name: string, options: any) {
              response.cookies.set({
                name,
                value: '',
                ...options,
              });
            },
          },
        }
      );

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      return response;
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }

  // 4. Gestion des routes protégées
  if (isProtectedRoute(pathname)) {
    try {
      const response = NextResponse.next();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              response.cookies.set({
                name,
                value,
                ...options,
              });
            },
            remove(name: string, options: any) {
              response.cookies.set({
                name,
                value: '',
                ...options,
              });
            },
          },
        }
      );

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        const locale = getLocaleFromPath(pathname) || defaultLocale;
        const loginUrl = new URL(`/${locale}/auth/login`, request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Vérification du rôle admin pour les routes admin
      if (isAdminRoute(pathname)) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!profile || profile.role !== 'admin') {
          const locale = getLocaleFromPath(pathname) || defaultLocale;
          return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
        }
      }

      return response;
    } catch (error) {
      console.error('Middleware error:', error);
      const locale = getLocaleFromPath(pathname) || defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
    }
  }

  // 5. Gestion des routes de redirection
  if (shouldRedirect(pathname)) {
    const locale = getLocaleFromPath(pathname) || defaultLocale;
    const targetUrl = new URL(`/${locale}/auth/login`, request.url);
    return NextResponse.redirect(targetUrl);
  }

  // 6. Application du middleware d'internationalisation
  const response = intlMiddleware(request);

  // 7. Ajout des headers de sécurité
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // 8. Gestion du cache pour les assets statiques
  if (pathname.startsWith('/_next/static/') || pathname.startsWith('/favicon.ico')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

export const config = {
  matcher: [
    // Correspond à tous les chemins sauf les fichiers statiques
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Inclut les routes API spécifiques
    '/api/cards/:path*',
    '/api/orders/:path*',
    '/api/analytics/:path*',
    '/api/webhooks/:path*'
  ]
};