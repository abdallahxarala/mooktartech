"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  featured?: boolean;
}

interface TemplateSelectorProps {
  templates: Template[];
  value: string;
  onChange: (templateId: string) => void;
  className?: string;
}

export function TemplateSelector({
  templates,
  value,
  onChange,
  className,
}: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div className={cn("grid grid-cols-3 gap-4", className)}>
      {templates.map((template) => (
        <div
          key={template.id}
          onMouseEnter={() => setHoveredTemplate(template.id)}
          onMouseLeave={() => setHoveredTemplate(null)}
        >
          <Card
            className={cn(
              "overflow-hidden cursor-pointer transition-all",
              value === template.id && "ring-2 ring-primary-orange"
            )}
            onClick={() => onChange(template.id)}
          >
            <div className="relative aspect-[1.586/1] animate-fade-in-up">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover animate-fade-in-up"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent animate-fade-in-up" />

              {template.featured && (
                <Badge className="absolute top-2 right-2 bg-primary-orange animate-fade-in-up">
                  Recommandé
                </Badge>
              )}

              {value === template.id && (
                <div className="absolute inset-0 bg-primary-orange/20 flex items-center justify-center animate-fade-in-up">
                  <Check className="h-12 w-12 text-white animate-fade-in-up" />
                </div>
              )}

              <div className="absolute bottom-4 left-4 text-white animate-fade-in-up">
                <h3 className="text-lg font-semibold animate-fade-in-up">{template.name}</h3>
                <p className="text-sm opacity-80 animate-fade-in-up">{template.description}</p>
              </div>
            </div>

            {hoveredTemplate === template.id && (
              <div
                className="p-4 bg-white border-t animate-fade-in-up"
              >
                <p className="text-sm text-gray-600 animate-fade-in-up">
                  {template.description}
                </p>
              </div>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
}
