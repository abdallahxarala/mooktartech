"use client";

import { useState, useEffect } from 'react';

interface NetworkStatus {
  online: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    online: true,
    connectionType: 'unknown',
    effectiveType: '4g',
    downlink: Infinity,
    rtt: 0,
    saveData: false,
  });

  useEffect(() => {
    // Vérifier si l'API Network Information est disponible
    const connection = (navigator as any).connection ||
                      (navigator as any).mozConnection ||
                      (navigator as any).webkitConnection;

    function updateNetworkStatus() {
      setStatus({
        online: navigator.onLine,
        connectionType: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || '4g',
        downlink: connection?.downlink || Infinity,
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false,
      });
    }

    // Écouter les changements de connexion
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    // État initial
    updateNetworkStatus();

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return status;
}