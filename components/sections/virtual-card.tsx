"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useScroll, useTransform } from "framer-motion";

const features = [
  "Personnalisation complète du design",
  "Paiement sans contact sécurisé",
  "Compatible avec tous les smartphones",
  "Statistiques d'utilisation en temps réel",
  "Support technique 24/7",
  "Mises à jour gratuites",
];

export function VirtualCard() {
  const { locale } = useParams();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-16 bg-white animate-fade-in-up">
      <div className="container mx-auto px-4 animate-fade-in-up">
        <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in-up">
          <div
            ref={ref}
            style={{ y }}
            className="relative animate-fade-in-up"
          >
            <div className="w-full aspect-[4/3] bg-primary rounded-2xl overflow-hidden relative animate-fade-in-up">
              <div className="absolute inset-0 opacity-30 animate-fade-in-up">
                <svg className="w-full h-full animate-fade-in-up" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M0,0 C40,20 60,80 100,100 L100,0 Z"
                    fill="#FF7A00"
                  />
                </svg>
              </div>
              <div className="relative p-8 text-white animate-fade-in-up">
                <h3 className="text-2xl font-bold mb-2 animate-fade-in-up">Carte Virtuelle NFC</h3>
                <p className="opacity-80 animate-fade-in-up">Votre identité numérique sécurisée</p>
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-lg animate-fade-in-up">
              <div className="flex items-center gap-4 animate-fade-in-up">
                <div className="h-12 w-12 bg-primary-orange/10 rounded-full flex items-center justify-center animate-fade-in-up">
                  <Check className="h-6 w-6 text-primary-orange animate-fade-in-up" />
                </div>
                <p className="text-sm font-medium animate-fade-in-up">
                  Compatible avec<br />tous les smartphones
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in-up">
              Cartes Virtuelles NFC
            </h2>
            <p className="text-gray-600 mb-8 animate-fade-in-up">
              Découvrez nos solutions de cartes virtuelles NFC innovantes pour une expérience utilisateur optimale et sécurisée.
            </p>
            <ul className="space-y-4 mb-8 animate-fade-in-up">
              {features.map((feature, index) => (
                <li
                  key={feature}
                  className="flex items-center animate-fade-in-up"
                >
                  <Check className="w-5 h-5 text-primary-orange mr-3 animate-fade-in-up" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href={`/${locale}/nfc-editor`}>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 transform transition-all hover:scale-105 animate-fade-in-up"
              >
                Essayer gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
