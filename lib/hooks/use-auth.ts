"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useAuthStore } from '@/lib/store/auth';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { setUser, clearUser } = useAuthStore();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Récupérer les données utilisateur complètes depuis la table users
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error && userData) {
          setUser(userData);
        }
      } else {
        clearUser();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, clearUser]);

  const signUp = async (email: string, password: string, phone: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        phone,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            phone,
          },
        },
      });

      if (error) throw error;

      // Créer l'entrée dans la table users
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              phone,
              role: 'customer',
            }
          ]);

        if (profileError) throw profileError;
      }

      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte",
      });

      return { data, error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur lors de l'inscription",
        description: (error as AuthError).message,
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace personnel",
      });

      router.push('/dashboard');
      return { data, error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: (error as AuthError).message,
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

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
        description: (error as AuthError).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte de réception",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: (error as AuthError).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', data.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };
}