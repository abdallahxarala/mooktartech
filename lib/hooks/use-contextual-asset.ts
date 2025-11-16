"use client";

import { useState, useEffect } from 'react';
import { contextualAssets, fallbackAssets, type AssetContext, type AssetMetadata } from '@/lib/config/assets';

interface UseContextualAssetOptions {
  category: string;
  context?: Partial<AssetContext>;
  fallback?: string;
}

export function useContextualAsset({
  category,
  context = { region: 'west-africa', country: 'senegal' },
  fallback = 'default-hero',
}: UseContextualAssetOptions): AssetMetadata {
  const [asset, setAsset] = useState<AssetMetadata>(fallbackAssets[fallback]);

  useEffect(() => {
    const assets = contextualAssets[category];
    if (!assets?.length) return;

    // Système de scoring pour trouver l'image la plus pertinente
    const scored = assets.map(asset => {
      let score = 0;

      // Score basé sur la région
      if (asset.context.region === context.region) score += 3;
      if (asset.context.country === context.country) score += 2;
      if (asset.context.industry === context.industry) score += 2;

      // Score basé sur les tags
      if (context.tags && asset.context.tags) {
        const matchingTags = context.tags.filter(tag => 
          asset.context.tags?.includes(tag)
        ).length;
        score += matchingTags;
      }

      return { asset, score };
    });

    // Trier par score et sélectionner la meilleure correspondance
    const bestMatch = scored.sort((a, b) => b.score - a.score)[0];
    if (bestMatch) {
      setAsset(bestMatch.asset);
    }
  }, [category, context]);

  return asset;
}