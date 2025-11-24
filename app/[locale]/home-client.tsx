"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Hero } from "@/components/sections/hero";
import { PopularProducts } from "@/components/sections/popular-products";
import { VirtualCard } from "@/components/sections/virtual-card";
import { SectorSolutions } from "@/components/sections/sector-solutions";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import FinalCTA from "@/components/sections/final-cta";
import { Footer } from "@/components/footer";
import { useSafeState } from "@/lib/hooks/use-safe-state";
import { logComponentMount, logComponentUnmount, logStateChange } from "@/lib/utils/error-logger";
import { inspectValue } from "@/lib/utils/symbol-inspector";
import { ErrorBoundary } from "@/components/error-boundary";
import { SafeMotionDiv } from "@/components/safe-motion";

interface HomeClientProps {
  locale: string;
  translations: any;
}

export function HomeClient({ locale, translations }: HomeClientProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const mainRef = useRef<HTMLElement>(null);

  // Use safe state for any state that might contain Symbols
  const [state, setState] = useSafeState<any>({});

  // Inspect props for Symbol values
  useEffect(() => {
    console.group("[HomeClient] Props inspection");
    inspectValue({ locale, translations });
    console.groupEnd();
  }, [locale, translations]);

  // Component lifecycle logging
  useEffect(() => {
    logComponentMount("HomeClient", { locale, translations });
    return () => logComponentUnmount("HomeClient");
  }, [locale, translations]);

  // State change logging
  useEffect(() => {
    logStateChange("HomeClient", "inView", inView);
  }, [inView]);

  return (
    <ErrorBoundary componentName="HomeClient">
      <SafeMotionDiv
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <main ref={mainRef} className="min-h-screen">
          <Hero />
          <PopularProducts />
          <VirtualCard />
          <SectorSolutions />
          <WhyChooseUs />
          <FinalCTA />
          <Footer />
        </main>
      </SafeMotionDiv>
    </ErrorBoundary>
  );
}