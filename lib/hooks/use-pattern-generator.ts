"use client";

import { useState, useCallback } from 'react';

interface PatternOptions {
  type: "dots" | "lines" | "waves" | "traditional";
  color: string;
  opacity: number;
  scale: number;
}

export function usePatternGenerator() {
  const [patternOptions, setPatternOptions] = useState<PatternOptions>({
    type: "dots",
    color: "#000000",
    opacity: 0.1,
    scale: 1,
  });

  // Générer un motif de points
  const generateDotPattern = useCallback((size: number): string => {
    const scale = patternOptions.scale * 10;
    return `
      <pattern id="dots" x="0" y="0" width="${scale}" height="${scale}" patternUnits="userSpaceOnUse">
        <circle cx="${scale/2}" cy="${scale/2}" r="2" fill="${patternOptions.color}" opacity="${patternOptions.opacity}"/>
      </pattern>
    `;
  }, [patternOptions]);

  // Générer un motif de lignes
  const generateLinePattern = useCallback((size: number): string => {
    const scale = patternOptions.scale * 10;
    return `
      <pattern id="lines" x="0" y="0" width="${scale}" height="${scale}" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="${scale}" y2="${scale}" stroke="${patternOptions.color}" stroke-width="1" opacity="${patternOptions.opacity}"/>
      </pattern>
    `;
  }, [patternOptions]);

  // Générer un motif de vagues
  const generateWavePattern = useCallback((size: number): string => {
    const scale = patternOptions.scale * 20;
    return `
      <pattern id="waves" x="0" y="0" width="${scale}" height="${scale}" patternUnits="userSpaceOnUse">
        <path d="M 0 ${scale/2} Q ${scale/4} 0 ${scale/2} ${scale/2} T ${scale} ${scale/2}"
              stroke="${patternOptions.color}" fill="none" opacity="${patternOptions.opacity}"/>
      </pattern>
    `;
  }, [patternOptions]);

  // Générer un motif traditionnel
  const generateTraditionalPattern = useCallback((size: number): string => {
    const scale = patternOptions.scale * 30;
    return `
      <pattern id="traditional" x="0" y="0" width="${scale}" height="${scale}" patternUnits="userSpaceOnUse">
        <path d="M 0 0 L ${scale} ${scale} M ${-scale/2} ${scale/2} L ${scale/2} ${-scale/2} M ${scale/2} ${scale*1.5} L ${scale*1.5} ${scale/2}"
              stroke="${patternOptions.color}" stroke-width="2" opacity="${patternOptions.opacity}"/>
      </pattern>
    `;
  }, [patternOptions]);

  // Générer le motif selon le type
  const generatePattern = useCallback((size: number): string => {
    switch (patternOptions.type) {
      case "dots":
        return generateDotPattern(size);
      case "lines":
        return generateLinePattern(size);
      case "waves":
        return generateWavePattern(size);
      case "traditional":
        return generateTraditionalPattern(size);
      default:
        return "";
    }
  }, [patternOptions, generateDotPattern, generateLinePattern, generateWavePattern, generateTraditionalPattern]);

  // Mettre à jour les options du motif
  const updatePatternOptions = useCallback((options: Partial<PatternOptions>) => {
    setPatternOptions(prev => ({ ...prev, ...options }));
  }, []);

  return {
    patternOptions,
    updatePatternOptions,
    generatePattern,
  };
}