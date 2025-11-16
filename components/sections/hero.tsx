"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, CreditCard } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export function Hero() {
  const { locale } = useParams();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="relative min-h-[600px] bg-gradient-to-r from-primary to-primary-orange overflow-hidden animate-fade-in-up">
      <div className="absolute inset-0 bg-grid-white/10 animate-fade-in-up" />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative animate-fade-in-up">
        <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in-up">
          <div ref={ref}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
              Solutions d'identification{" "}
              <span className="text-primary-orange-light animate-fade-in-up">innovantes</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed animate-fade-in-up">
              Cartes virtuelles NFC et technologies d'identification pour les entreprises et organisations modernes en Afrique de l'Ouest
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up">
              <Link href={`/${locale}/products`}>
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 transform transition-transform hover:scale-105 animate-fade-in-up"
                >
                  <ShoppingBag className="w-5 h-5 mr-2 animate-fade-in-up" />
                  Nos produits
                </Button>
              </Link>
              <Link href={`/${locale}/card-editor`}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 transform transition-transform hover:scale-105 animate-fade-in-up"
                >
                  <CreditCard className="w-5 h-5 mr-2 animate-fade-in-up" />
                  Créer ma carte
                </Button>
              </Link>
            </div>
          </div>

          <div
            style={{ y }}
            className="relative animate-fade-in-up"
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
              <Image
                src="https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a?auto=format&fit=crop&q=80"
                alt="Entrepreneurs sénégalais en réunion"
                width={600}
                height={600}
                className="w-full h-full object-cover animate-fade-in-up"
                priority
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent animate-fade-in-up" />
            </div>

            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-lg max-w-xs animate-fade-in-up">
              <div className="flex items-center gap-4 mb-4 animate-fade-in-up">
                <div className="h-12 w-12 bg-primary-orange/10 rounded-full flex items-center justify-center animate-fade-in-up">
                  <CreditCard className="h-6 w-6 text-primary-orange animate-fade-in-up" />
                </div>
                <div>
                  <h3 className="font-semibold animate-fade-in-up">Cartes NFC</h3>
                  <p className="text-sm text-gray-600 animate-fade-in-up">Compatible tous smartphones</p>
                </div>
              </div>
              <div className="flex gap-2 animate-fade-in-up">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-orange animate-fade-in-up"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
