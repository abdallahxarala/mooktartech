"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cardTemplates, type CardTemplate } from "@/components/card-editor/templates";
import { EditorWorkspace } from "@/components/card-editor/editor-workspace";
import { useTranslations } from "@/lib/utils/next-intl-fallback";

interface CardEditorClientProps {
  locale: string;
  translations: any;
}

export function CardEditorClient({ locale, translations }: CardEditorClientProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const t = useTranslations("cards");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    console.log("[CardEditorClient] Component mounted", { locale, translations });
    return () => {
      console.log("[CardEditorClient] Component unmounted");
    };
  }, [locale, translations]);

  useEffect(() => {
    if (selectedTemplate) {
      console.log("[CardEditorClient] Template selected:", selectedTemplate.id);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    console.log("[CardEditorClient] Component visibility changed:", { inView });
  }, [inView]);

  return (
    <div ref={ref}>
      {!selectedTemplate ? (
        <div className="container mx-auto px-4 py-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold mb-8 animate-fade-in-up">{t("create")}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {cardTemplates.map((template: any, index) => (
              <div
                key={template.id}
              >
                <Card
                  className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-orange transition-all animate-fade-in-up"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="aspect-[1.586/1] relative animate-fade-in-up">
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-full object-cover animate-fade-in-up"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent animate-fade-in-up" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white animate-fade-in-up">
                      <h3 className="text-lg font-semibold animate-fade-in-up">{template.name}</h3>
                      <p className="text-sm opacity-80 animate-fade-in-up">{template.description}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 animate-fade-in-up">
          <div className="h-screen flex flex-col animate-fade-in-up">
            <header className="bg-white border-b px-6 py-4 animate-fade-in-up">
              <div className="flex items-center justify-between animate-fade-in-up">
                <div className="flex items-center gap-4 animate-fade-in-up">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    ← Retour
                  </Button>
                  <h1 className="text-xl font-semibold animate-fade-in-up">
                    {selectedTemplate.name}
                  </h1>
                </div>
                <Button className="bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up">
                  Sauvegarder
                </Button>
              </div>
            </header>

            <main className="flex-1 p-6 overflow-hidden animate-fade-in-up">
              <EditorWorkspace
                template={selectedTemplate}
                onSave={() => {
                  console.log("[CardEditorClient] Saving template:", selectedTemplate.id);
                }}
              />
            </main>
          </div>
        </div>
      )}
    </div>
  );
}