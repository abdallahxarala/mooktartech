"use client";

/**
 * Hook temporaire de compatibilité
 * TODO: À remplacer par une implémentation complète si nécessaire
 */

import { useState } from 'react';
import { RoleProgressionStatus } from '@/lib/types/auth-roles';

export function useAuthProgressive() {
  const [buyerProgress] = useState<RoleProgressionStatus | null>(null);
  const [creatorProgress] = useState<RoleProgressionStatus | null>(null);

  return {
    loading: false,
    buyerProgress,
    creatorProgress,
    activateBuyerRole: async () => ({ success: true }),
    activateCreatorRole: async () => ({ success: true }),
    trackActivity: async () => ({ success: true }),
    checkBuyerProgression: async (): Promise<RoleProgressionStatus | null> => null,
    checkCreatorProgression: async (): Promise<RoleProgressionStatus | null> => null,
    loadBuyerProfile: async () => null,
    loadCreatorProfile: async () => null,
    refreshUser: async () => {},
  };
}

