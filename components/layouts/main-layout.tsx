"use client";

import React, { Suspense } from 'react';
import { ReactNode } from 'react';
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import { usePathname } from "next/navigation";
import { Loading } from "./loading";
import { RouteDebugger } from "@/components/debug/route-debugger";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  // Only show theme-dependent content after mounting
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Détecter les problèmes potentiels avec la route actuelle
  const routeIssues = [];
  
  // Vérifier si la route contient des paramètres dynamiques
  if (pathname.includes("[") && pathname.includes("]")) {
    const params = pathname.match(/\[(.*?)\]/g);
    if (params) {
      params.forEach(param => {
        if (!param.includes("locale")) {
          routeIssues.push(`Dynamic parameter ${param} found - ensure generateStaticParams is implemented`);
        }
      });
    }
  }

  // Vérifier si la route est compatible avec le mode export
  if (pathname.startsWith("/api/")) {
    routeIssues.push("API routes are not supported in export mode");
  }

  return (
    <div className="flex min-h-screen flex-col animate-fade-in-up" suppressHydrationWarning>
      <header className="sticky top-0 z-50 animate-fade-in-up">
        {mounted && <Navbar />}
      </header>
      
      <main
        key={pathname}
        className="flex-1 animate-fade-in-up"
      >
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </main>

      {mounted && <Footer />}

      {/* Afficher le débogueur de route en développement */}
      {mounted && <RouteDebugger issues={routeIssues} />}
    </div>
  );
}
