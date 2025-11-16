"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './cart';

export interface VirtualCard {
  id: string;
  name: string;
  design: string;
  color: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UnifiedProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  cards: VirtualCard[];
  orders: Order[];
  preferences: {
    language: string;
    currency: string;
    notifications: boolean;
  };
}

export interface Order {
  id: string;
  items: CartItem[];
  virtualCards?: VirtualCard[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  createdAt: string;
}

interface UnifiedStore {
  profile: UnifiedProfile | null;
  recentCards: VirtualCard[];
  recommendedProducts: CartItem[];
  setProfile: (profile: UnifiedProfile) => void;
  addCard: (card: VirtualCard) => void;
  updateCard: (id: string, updates: Partial<VirtualCard>) => void;
  addOrder: (order: Order) => void;
  updateRecommendations: () => void;
}

export const useUnifiedStore = create<UnifiedStore>()(
  persist(
    (set, get) => ({
      profile: null,
      recentCards: [],
      recommendedProducts: [],

      setProfile: (profile) => set({ profile }),

      addCard: (card) => {
        const profile = get().profile;
        if (!profile) return;

        set({
          profile: {
            ...profile,
            cards: [card, ...profile.cards],
          },
          recentCards: [card, ...get().recentCards].slice(0, 5),
        });

        // Mettre à jour les recommandations
        get().updateRecommendations();
      },

      updateCard: (id, updates) => {
        const profile = get().profile;
        if (!profile) return;

        const updatedCards = profile.cards.map(card =>
          card.id === id ? { ...card, ...updates } : card
        );

        set({
          profile: {
            ...profile,
            cards: updatedCards,
          },
        });
      },

      addOrder: (order) => {
        const profile = get().profile;
        if (!profile) return;

        set({
          profile: {
            ...profile,
            orders: [order, ...profile.orders],
          },
        });

        // Mettre à jour les recommandations
        get().updateRecommendations();
      },

      updateRecommendations: () => {
        const profile = get().profile;
        if (!profile) return;

        // Logique de recommandation basée sur:
        // 1. Les cartes récemment créées
        // 2. Les achats précédents
        // 3. Les préférences utilisateur
        const recommendations = generateRecommendations(profile);
        set({ recommendedProducts: recommendations });
      },
    }),
    {
      name: 'unified-storage',
    }
  )
);

// Fonction utilitaire pour générer des recommandations
function generateRecommendations(profile: UnifiedProfile): CartItem[] {
  const recommendations: CartItem[] = [];

  // Exemple de logique de recommandation
  const recentCardTypes = profile.cards
    .slice(0, 3)
    .map(card => card.design);

  // Recommander des produits similaires
  recentCardTypes.forEach(type => {
    recommendations.push({
      id: Math.random(),
      name: `Carte NFC ${type} Premium`,
      price: 29990, // 29,990 FCFA
      quantity: 1,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
    });
  });

  // Recommander des bundles si l'utilisateur a plusieurs cartes
  if (profile.cards.length > 2) {
    recommendations.push({
      id: Math.random(),
      name: "Pack Pro 3 Cartes NFC",
      price: 79990, // 79,990 FCFA
      quantity: 1,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
    });
  }

  return recommendations;
}