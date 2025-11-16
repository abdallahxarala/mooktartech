"use client";

import { useState, useEffect } from 'react';
import { Module, moduleConfig } from '@/lib/types/modules';

export function useModules() {
  const [enabledModules, setEnabledModules] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger la configuration des modules
    const loadModules = async () => {
      try {
        // Dans une vraie implémentation, charger depuis l'API/base de données
        const enabled = Object.fromEntries(
          Object.entries(moduleConfig.modules).map(([id, module]) => [
            id,
            module.enabled,
          ])
        );
        setEnabledModules(enabled);
      } catch (error) {
        console.error('Error loading modules:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  const isModuleEnabled = (moduleId: string): boolean => {
    return enabledModules[moduleId] ?? false;
  };

  const getDependencies = (moduleId: string): string[] => {
    return moduleConfig.dependencies[moduleId] || [];
  };

  const getFeatures = (moduleId: string): string[] => {
    return moduleConfig.modules[moduleId]?.features || [];
  };

  const toggleModule = async (moduleId: string, enabled: boolean) => {
    try {
      // Vérifier les dépendances
      const dependencies = getDependencies(moduleId);
      if (enabled) {
        const missingDeps = dependencies.filter(dep => !isModuleEnabled(dep));
        if (missingDeps.length > 0) {
          throw new Error(`Missing required modules: ${missingDeps.join(', ')}`);
        }
      }

      // Dans une vraie implémentation, mettre à jour via l'API
      setEnabledModules(prev => ({
        ...prev,
        [moduleId]: enabled,
      }));

      // Désactiver les modules dépendants si on désactive un module
      if (!enabled) {
        const dependentModules = Object.entries(moduleConfig.dependencies)
          .filter(([_, deps]) => deps.includes(moduleId))
          .map(([id]) => id);

        setEnabledModules(prev => ({
          ...prev,
          ...Object.fromEntries(dependentModules.map(id => [id, false])),
        }));
      }
    } catch (error) {
      console.error('Error toggling module:', error);
      throw error;
    }
  };

  return {
    modules: moduleConfig.modules,
    enabledModules,
    loading,
    isModuleEnabled,
    getDependencies,
    getFeatures,
    toggleModule,
  };
}