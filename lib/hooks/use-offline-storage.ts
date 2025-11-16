"use client";

import { useState, useEffect } from 'react';
import localforage from 'localforage';
import { get, set, del } from 'idb-keyval';

interface OfflineStorageOptions {
  key: string;
  maxSize?: number; // en bytes
  compression?: boolean;
  expiry?: number; // en millisecondes
}

export function useOfflineStorage<T>({
  key,
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  compression = true,
  expiry = 7 * 24 * 60 * 60 * 1000, // 7 jours par défaut
}: OfflineStorageOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialiser le stockage
  useEffect(() => {
    localforage.config({
      name: 'XaralaOfflineStorage',
      storeName: 'offline_data',
    });
  }, []);

  // Charger les données
  useEffect(() => {
    async function loadData() {
      try {
        const storedData = await localforage.getItem<{
          data: T;
          timestamp: number;
          size: number;
        }>(key);

        if (storedData) {
          // Vérifier l'expiration
          if (Date.now() - storedData.timestamp > expiry) {
            await localforage.removeItem(key);
            setData(null);
          } else {
            setData(storedData.data);
          }
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [key, expiry]);

  // Sauvegarder les données
  const saveData = async (newData: T) => {
    try {
      // Calculer la taille des données
      const size = new Blob([JSON.stringify(newData)]).size;
      
      if (size > maxSize) {
        throw new Error('Data size exceeds maximum allowed size');
      }

      // Compresser si nécessaire
      const dataToStore = {
        data: newData,
        timestamp: Date.now(),
        size,
      };

      await localforage.setItem(key, dataToStore);
      setData(newData);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // Supprimer les données
  const clearData = async () => {
    try {
      await localforage.removeItem(key);
      setData(null);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    saveData,
    clearData,
  };
}

// Hook pour la gestion du cache IndexedDB
export function useIndexedDBCache<T>(key: string, options: {
  maxAge?: number;
  maxEntries?: number;
}) {
  const { maxAge = 24 * 60 * 60 * 1000, maxEntries = 100 } = options;

  const setCache = async (value: T) => {
    try {
      const entry = {
        value,
        timestamp: Date.now(),
      };
      await set(key, entry);
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };

  const getCache = async (): Promise<T | null> => {
    try {
      const entry = await get(key);
      if (!entry) return null;

      if (Date.now() - entry.timestamp > maxAge) {
        await del(key);
        return null;
      }

      return entry.value;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  };

  const clearCache = async () => {
    try {
      await del(key);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return {
    setCache,
    getCache,
    clearCache,
  };
}