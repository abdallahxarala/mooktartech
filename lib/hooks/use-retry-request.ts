"use client";

import { useState, useCallback } from 'react';

interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: any) => boolean;
}

export function useRetryRequest(options: RetryOptions = {}) {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = () => true,
  } = options;

  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const executeRequest = useCallback(
    async <T>(request: () => Promise<T>): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const response = await request();
        setAttempt(0);
        return response;
      } catch (err) {
        if (
          attempt < maxAttempts &&
          retryCondition(err)
        ) {
          // Calculer le délai avec backoff exponentiel
          const delay = Math.min(
            initialDelay * Math.pow(backoffFactor, attempt),
            maxDelay
          );

          // Attendre avant de réessayer
          await new Promise(resolve => setTimeout(resolve, delay));

          setAttempt(prev => prev + 1);
          return executeRequest(request);
        }

        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [attempt, maxAttempts, initialDelay, maxDelay, backoffFactor, retryCondition]
  );

  return {
    executeRequest,
    attempt,
    error,
    loading,
    reset: () => {
      setAttempt(0);
      setError(null);
      setLoading(false);
    },
  };
}