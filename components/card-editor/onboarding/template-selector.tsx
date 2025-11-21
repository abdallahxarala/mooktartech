"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/lib/utils/next-intl-fallback";
import { cardTemplates } from "../templates";
import { Check } from "lucide-react";

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const t = useTranslations("cards");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    onSelect(templateId);
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in-up">
      <div
        className="text-center mb-12 animate-fade-in-up"
      >
        <h2 className="text-3xl font-bold mb-4 animate-fade-in-up">{t("templates.title")}</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
          {t("templates.description")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
        {cardTemplates.map((template, index) => (
          <div
            key={template.id}
          >
            <Card
              className={`overflow-hidden cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? "ring-2 ring-primary-orange"
                  : "hover:shadow-lg"
              }`}
              onClick={() => handleSelect(template.id)}
            >
              <div className="aspect-[1.586/1] relative animate-fade-in-up">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover animate-fade-in-up"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent animate-fade-in-up" />
                {selectedTemplate === template.id && (
                  <div className="absolute inset-0 bg-primary-orange/20 flex items-center justify-center animate-fade-in-up">
                    <Check className="h-12 w-12 text-white animate-fade-in-up" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 text-white animate-fade-in-up">
                  <h3 className="text-lg font-semibold animate-fade-in-up">{template.name}</h3>
                  <p className="text-sm opacity-80 animate-fade-in-up">{template.description}</p>
                </div>
                {index === 0 && (
                  <Badge className="absolute top-4 right-4 bg-primary-orange animate-fade-in-up">
                    {t("templates.recommended")}
                  </Badge>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
