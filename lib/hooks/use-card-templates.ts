"use client";

import { useState, useCallback } from 'react';
import { CardTemplate, CardThemePreset } from '@/lib/types/card-template';
import { baseTemplates, africanTemplates, industryTemplates, themePresets } from '@/lib/config/card-templates';
import { useLocalStorage } from './use-local-storage';

interface UseCardTemplatesOptions {
  onTemplateChange?: (template: CardTemplate) => void;
  onThemeChange?: (theme: CardThemePreset) => void;
}

export function useCardTemplates(options: UseCardTemplatesOptions = {}) {
  const [favoriteTemplates, setFavoriteTemplates] = useLocalStorage<string[]>("favorite-templates", []);
  const [customTemplates, setCustomTemplates] = useLocalStorage<CardTemplate[]>("custom-templates", []);
  const [customThemes, setCustomThemes] = useLocalStorage<CardThemePreset[]>("custom-themes", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  // Filtrer les templates
  const filteredTemplates = useCallback(() => {
    let templates = [...baseTemplates, ...africanTemplates, ...industryTemplates, ...customTemplates];

    if (searchQuery) {
      templates = templates.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      templates = templates.filter(template => template.category === selectedCategory);
    }

    if (selectedIndustry) {
      templates = templates.filter(template => template.industry === selectedIndustry);
    }

    return templates;
  }, [searchQuery, selectedCategory, selectedIndustry, customTemplates]);

  // Ajouter un template aux favoris
  const addToFavorites = useCallback((templateId: string) => {
    setFavoriteTemplates(prev => [...prev, templateId]);
  }, [setFavoriteTemplates]);

  // Retirer un template des favoris
  const removeFromFavorites = useCallback((templateId: string) => {
    setFavoriteTemplates(prev => prev.filter(id => id !== templateId));
  }, [setFavoriteTemplates]);

  // Sauvegarder un template personnalisé
  const saveCustomTemplate = useCallback((template: CardTemplate) => {
    setCustomTemplates(prev => [...prev, template]);
  }, [setCustomTemplates]);

  // Sauvegarder un thème personnalisé
  const saveCustomTheme = useCallback((theme: CardThemePreset) => {
    setCustomThemes(prev => [...prev, theme]);
  }, [setCustomThemes]);

  // Obtenir les suggestions de templates
  const getSuggestedTemplates = useCallback((industry?: string) => {
    let templates = filteredTemplates();
    
    if (industry) {
      templates = templates.filter(t => t.industry === industry);
    }

    return templates.filter(t => t.featured).slice(0, 3);
  }, [filteredTemplates]);

  return {
    templates: filteredTemplates(),
    favoriteTemplates,
    customTemplates,
    themePresets: [...themePresets, ...customThemes],
    searchQuery,
    selectedCategory,
    selectedIndustry,
    setSearchQuery,
    setSelectedCategory,
    setSelectedIndustry,
    addToFavorites,
    removeFromFavorites,
    saveCustomTemplate,
    saveCustomTheme,
    getSuggestedTemplates,
  };
}