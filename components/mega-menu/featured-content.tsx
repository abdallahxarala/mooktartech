"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface FeaturedContentProps {
  category: "products" | "solutions" | "virtual-cards";
}

export function FeaturedContent({ category }: FeaturedContentProps) {
  const { locale } = useParams();

  const content = {
    products: {
      title: "Nouvelle imprimante XS-2000",
      description: "Découvrez notre dernière imprimante de cartes professionnelle",
      image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80",
      link: "/products/printers/xs-2000",
      badge: "Nouveau",
    },
    solutions: {
      title: "Solution entreprise complète",
      description: "Gestion des accès et identification des employés",
      image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80",
      link: "/solutions/business",
      badge: "Populaire",
    },
    "virtual-cards": {
      title: "Créez votre carte virtuelle",
      description: "Design personnalisé et fonctionnalités NFC avancées",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
      link: "/card-editor",
      badge: "Recommandé",
    },
  };

  const item = content[category];

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="relative aspect-video">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge 
            className="absolute top-2 right-2 bg-primary-orange"
            variant="secondary"
          >
            {item.badge}
          </Badge>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
            <p className="text-sm opacity-90">{item.description}</p>
          </div>
        </div>
      </Card>

      <Link href={`/${locale}${item.link}`}>
        <Button className="w-full bg-primary-orange hover:bg-primary-orange/90">
          En savoir plus
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
