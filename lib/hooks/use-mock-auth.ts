"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { useToast } from '@/components/ui/use-toast';

// Simulated user database
const mockUsers = [
  {
    id: '1',
    email: 'demo@xarala.co',
    password: 'password123',
    full_name: 'Demo User',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
    phone: '+221 77 000 00 00',
    company: 'Xarala Solutions',
    role: 'customer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useMockAuth() {
  const [loading, setLoading] = useState(false);
  const { setUser, clearUser } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Remove password before storing user data
      const { password: _, ...userData } = user;
      setUser(userData);

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace personnel",
      });

      router.push('/dashboard');
      return { data: userData, error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, phone: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      if (mockUsers.some((u) => u.email === email)) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Create new user
      const newUser = {
        id: String(mockUsers.length + 1),
        email,
        password,
        phone,
        full_name: null,
        avatar_url: null,
        company: null,
        role: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockUsers.push(newUser);

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });

      return { data: newUser, error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur lors de l'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      clearUser();
      router.push('/');

      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur lors de la déconnexion",
        description: "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = mockUsers.find((u) => u.email === email);
      if (!user) {
        throw new Error('Aucun compte associé à cet email');
      }

      toast({
        title: "Email envoyé",
        description: "Les instructions de réinitialisation ont été envoyées",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}