import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rediriger la racine vers Foire Dakar (page principale)
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL('/fr/foire-dakar-2025', request.url)
    );
  }
  
  // Rediriger /fr vers la page principale aussi
  if (pathname === '/fr' || pathname === '/fr/') {
    return NextResponse.redirect(
      new URL('/fr/foire-dakar-2025', request.url)
    );
  }
  
  // Rediriger anciennes URLs /org/[slug] vers nouvelles routes fixes
  if (pathname.includes('/org/foire-dakar-2025')) {
    return NextResponse.redirect(
      new URL(pathname.replace('/org/foire-dakar-2025', '/foire-dakar-2025'), request.url)
    );
  }
  
  if (pathname.includes('/org/mooktartech-com')) {
    return NextResponse.redirect(
      new URL(pathname.replace('/org/mooktartech-com', '/mooktartech-com'), request.url)
    );
  }
  
  if (pathname.includes('/org/xarala-solutions')) {
    return NextResponse.redirect(
      new URL(pathname.replace('/org/xarala-solutions', '/xarala-solutions'), request.url)
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)' 
  ]
};
