import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rediriger la racine vers Foire Dakar (page principale)
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL('/fr/org/foire-dakar-2025', request.url)
    );
  }
  
  // Rediriger /fr vers la page principale aussi
  if (pathname === '/fr' || pathname === '/fr/') {
    return NextResponse.redirect(
      new URL('/fr/org/foire-dakar-2025', request.url)
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)' 
  ]
};
