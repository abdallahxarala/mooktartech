"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ProductCatalog } from "@/components/products/catalog";
import { ProductFilters } from "@/components/products/filters";
import { ProductsHeader } from "@/components/products/header";
import { Breadcrumb } from "@/components/navigation/breadcrumb";

interface ProductsClientProps {
  locale: string;
  translations: any;
}

export function ProductsClient({ locale, translations }: ProductsClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    console.log("[ProductsClient] Component mounted", { locale, translations });
    return () => {
      console.log("[ProductsClient] Component unmounted");
    };
  }, [locale, translations]);

  useEffect(() => {
    console.log("[ProductsClient] View mode changed:", viewMode);
  }, [viewMode]);

  useEffect(() => {
    console.log("[ProductsClient] Sort option changed:", sortBy);
  }, [sortBy]);

  useEffect(() => {
    console.log("[ProductsClient] Component visibility changed:", { inView });
  }, [inView]);

  return (
    <div
      ref={ref}
    >
      <main className="min-h-screen bg-gray-50 animate-fade-in-up">
        <ProductsHeader />
        
        <div className="container mx-auto px-4 py-8 animate-fade-in-up">
          <div className="mb-8 animate-fade-in-up">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Produits" },
              ]}
            />
          </div>

          <h1 className="text-4xl font-bold text-center mb-12 animate-fade-in-up">Nos Produits</h1>
          
          <div className="flex flex-col lg:flex-row gap-8 animate-fade-in-up">
            <aside className="w-full lg:w-64 flex-shrink-0 animate-fade-in-up">
              <ProductFilters />
            </aside>
            
            <div className="flex-1 animate-fade-in-up">
              <ProductCatalog 
                viewMode={viewMode} 
                sortBy={sortBy} 
                onViewModeChange={setViewMode} 
                onSortChange={setSortBy}
                translations={translations}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}