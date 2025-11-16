"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ExtendedUser } from '@/lib/types/auth-roles';

interface AuthState {
  user: ExtendedUser | null;
  isAuthenticated: boolean;
  isBuyer: boolean;
  isCreator: boolean;
  isLoading: boolean;
  setUser: (user: ExtendedUser | null) => void;
  clearUser: () => void;
  updateUserRoles: (buyer: boolean, creator: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isBuyer: false,
      isCreator: false,
      isLoading: false,
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isBuyer: user?.buyer_role_activated || false,
        isCreator: user?.creator_role_activated || false,
      }),
      clearUser: () => set({ 
        user: null, 
        isAuthenticated: false,
        isBuyer: false,
        isCreator: false,
      }),
      updateUserRoles: (buyer, creator) => set((state) => ({
        user: state.user ? {
          ...state.user,
          buyer_role_activated: buyer,
          creator_role_activated: creator,
          buyer_activated_at: buyer ? state.user.buyer_activated_at || new Date().toISOString() : state.user.buyer_activated_at,
          creator_activated_at: creator ? state.user.creator_activated_at || new Date().toISOString() : state.user.creator_activated_at,
        } : null,
        isBuyer: buyer,
        isCreator: creator,
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);