"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslations } from "@/lib/utils/next-intl-fallback";
import { CreditCard, Smartphone, Zap } from "lucide-react";

interface WelcomeProps {
  onStart: () => void;
}

export function Welcome({ onStart }: WelcomeProps) {
  const t = useTranslations("cards");
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: CreditCard,
      title: t("features.design.title"),
      description: t("features.design.description"),
    },
    {
      icon: Smartphone,
      title: t("features.compatibility.title"),
      description: t("features.compatibility.description"),
    },
    {
      icon: Zap,
      title: t("features.instant.title"),
      description: t("features.instant.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-orange py-12 animate-fade-in-up">
      <div className="container mx-auto px-4 animate-fade-in-up">
        <div
          className="max-w-4xl mx-auto text-center text-white mb-12 animate-fade-in-up"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            {t("welcome.title")}
          </h1>
          <p className="text-xl opacity-90 animate-fade-in-up">
            {t("welcome.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up">
          {features.map((feature, index) => (
            <div
              key={feature.title}
            >
              <Card className="p-6 text-center h-full bg-white/10 backdrop-blur-sm border-white/20 animate-fade-in-up">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-white animate-fade-in-up" />
                <h3 className="text-lg font-semibold text-white mb-2 animate-fade-in-up">
                  {feature.title}
                </h3>
                <p className="text-white/80 animate-fade-in-up">{feature.description}</p>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center animate-fade-in-up">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 transform transition-all animate-fade-in-up"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onStart}
          >
            <span>
              {t("welcome.start")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
