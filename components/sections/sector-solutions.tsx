"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, GraduationCap, Landmark, PartyPopper } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const sectors = [
  {
    id: "business",
    title: "Entreprises",
    description: "Solutions d'identification professionnelles pour vos employés et visiteurs",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80",
    href: "/solutions/business",
  },
  {
    id: "education",
    title: "Éducation",
    description: "Cartes étudiantes et systèmes de contrôle d'accès pour établissements",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80",
    href: "/solutions/education",
  },
  {
    id: "government",
    title: "Gouvernement",
    description: "Solutions sécurisées pour les documents officiels et l'identification",
    icon: Landmark,
    image: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80",
    href: "/solutions/government",
  },
  {
    id: "events",
    title: "Événementiel",
    description: "Badges et accréditations pour vos événements professionnels",
    icon: PartyPopper,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80",
    href: "/solutions/events",
  },
];

export function SectorSolutions() {
  const { locale } = useParams();

  return (
    <section className="py-16 bg-gray-50 animate-fade-in-up">
      <div className="container mx-auto px-4 animate-fade-in-up">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
            Solutions par secteur
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
            Des solutions d'identification adaptées à chaque secteur d'activité
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
          {sectors.map((sector, index) => (
            <div key={sector.id}>
              <Link href={`/${locale}${sector.href}`}>
                <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow animate-fade-in-up">
                  <div className="aspect-video relative overflow-hidden animate-fade-in-up">
                    <img
                      src={sector.image}
                      alt={sector.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 animate-fade-in-up"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent animate-fade-in-up" />
                    <div className="absolute bottom-4 left-4 text-white animate-fade-in-up">
                      <sector.icon className="h-8 w-8 mb-2 animate-fade-in-up" />
                      <h3 className="text-lg font-semibold animate-fade-in-up">{sector.title}</h3>
                    </div>
                  </div>
                  <div className="p-4 animate-fade-in-up">
                    <p className="text-gray-600 text-sm mb-4 animate-fade-in-up">{sector.description}</p>
                    <Button variant="link" className="text-primary-orange p-0 animate-fade-in-up">
                      En savoir plus
                    </Button>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
