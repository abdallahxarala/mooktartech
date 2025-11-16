"use client";

import { useState, useCallback } from 'react';
import { WaveStyle } from '@/lib/types/card-template';

interface WavePoint {
  x: number;
  y: number;
}

interface WaveOptions {
  style: WaveStyle;
  amplitude: number;
  frequency: number;
  opacity: number;
  position: { x: number; y: number };
}

export function useWaveGenerator() {
  const [waveOptions, setWaveOptions] = useState<WaveOptions>({
    style: "classic",
    amplitude: 30,
    frequency: 2,
    opacity: 0.3,
    position: { x: 0, y: 0.5 },
  });

  // Générer les points de la vague
  const generateWavePoints = useCallback((width: number, height: number): WavePoint[] => {
    const points: WavePoint[] = [];
    const steps = 100;

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      let y = 0;

      switch (waveOptions.style) {
        case "classic":
          y = Math.sin((i / steps) * Math.PI * waveOptions.frequency) * waveOptions.amplitude;
          break;
        case "dynamic":
          y = Math.sin((i / steps) * Math.PI * waveOptions.frequency) * waveOptions.amplitude +
              Math.cos((i / steps) * Math.PI * waveOptions.frequency * 2) * (waveOptions.amplitude / 2);
          break;
        case "minimal":
          y = Math.sin((i / steps) * Math.PI * waveOptions.frequency) * (waveOptions.amplitude / 2);
          break;
        case "double":
          y = Math.sin((i / steps) * Math.PI * waveOptions.frequency) * waveOptions.amplitude +
              Math.sin((i / steps) * Math.PI * waveOptions.frequency * 2) * (waveOptions.amplitude / 3);
          break;
        case "custom":
          // Points personnalisés
          break;
      }

      y = height * waveOptions.position.y + y;
      points.push({ x, y });
    }

    return points;
  }, [waveOptions]);

  // Générer le chemin SVG
  const generateWavePath = useCallback((width: number, height: number): string => {
    const points = generateWavePoints(width, height);
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const { x, y } = points[i];
      path += ` L ${x} ${y}`;
    }

    path += ` L ${width} ${height} L 0 ${height} Z`;
    return path;
  }, [generateWavePoints]);

  // Mettre à jour les options de la vague
  const updateWaveOptions = useCallback((options: Partial<WaveOptions>) => {
    setWaveOptions(prev => ({ ...prev, ...options }));
  }, []);

  return {
    waveOptions,
    updateWaveOptions,
    generateWavePath,
    generateWavePoints,
  };
}