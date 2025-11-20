"use client";

import { useState, useEffect, useCallback } from 'react';

export type NFCStatus = 'unavailable' | 'available' | 'enabled' | 'disabled';
export type NFCMode = 'read' | 'write';
export type NFCFormat = 'text' | 'url' | 'vcard' | 'custom';

interface NFCOptions {
  mode?: NFCMode;
  onReading?: (message: NDEFMessage) => void;
  onWriting?: (status: 'success' | 'error', error?: Error) => void;
  onStateChange?: (status: NFCStatus) => void;
}

interface NFCData {
  format: NFCFormat;
  data: any;
  timestamp: number;
}

export function useNFC({
  mode = 'read',
  onReading,
  onWriting,
  onStateChange,
}: NFCOptions = {}) {
  const [status, setStatus] = useState<NFCStatus>('unavailable');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [history, setHistory] = useState<NFCData[]>([]);

  // Vérifier la disponibilité du NFC
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        if ('NDEFReader' in window) {
          const permissionStatus = await navigator.permissions.query({ name: 'nfc' as PermissionName });
          setStatus(permissionStatus.state === 'granted' ? 'enabled' : 'available');
          onStateChange?.(permissionStatus.state === 'granted' ? 'enabled' : 'available');
        } else {
          setStatus('unavailable');
          onStateChange?.('unavailable');
        }
      } catch (err) {
        setStatus('unavailable');
        onStateChange?.('unavailable');
        console.error('Erreur lors de la vérification NFC:', err);
      }
    };

    checkAvailability();
  }, [onStateChange]);

  // Démarrer la lecture NFC
  const startScanning = useCallback(async () => {
    if (!('NDEFReader' in window)) {
      setError(new Error('NFC non disponible sur cet appareil'));
      return;
    }

    try {
      setIsScanning(true);
      setError(null);
      const ndef = new (window as any).NDEFReader();
      
      await ndef.scan();
      
      ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
        // Analyser le format et les données
        const nfcData: NFCData = {
          format: detectFormat(message),
          data: parseNDEFMessage(message),
          timestamp: Date.now(),
        };

        setHistory(prev => [nfcData, ...prev].slice(0, 10));
        onReading?.(message);
      });

    } catch (err) {
      setError(err as Error);
      setIsScanning(false);
    }
  }, [onReading]);

  const compareNDEFMessages = (a: NDEFMessage, b: NDEFMessage): boolean => {
    if (a.records.length !== b.records.length) return false;
    return a.records.every((record, i) => 
      record.recordType === b.records[i].recordType &&
      record.data.toString() === b.records[i].data.toString()
    );
  };

  // Vérification post-écriture
  const verifyWriteCallback = useCallback(async (ndef: any, message: NDEFMessage): Promise<boolean> => {
    // Vérification post-écriture
    try {
      const readMessage = await new Promise<NDEFMessage>((resolve) => {
        ndef.addEventListener("reading", ({ message }: any) => resolve(message), { once: true });
      });

      // Comparer les messages
      return compareNDEFMessages(message, readMessage);
    } catch {
      return false;
    }
  }, []);

  // Écrire des données NFC
  const writeData = useCallback(async (data: any, options: { format?: NFCFormat } = {}) => {
    if (!('NDEFReader' in window)) {
      throw new Error('NFC non disponible sur cet appareil');
    }

    try {
      const ndef = new (window as any).NDEFReader();
      const message = createNDEFMessage(data, options.format);
      
      await ndef.write(message);
      onWriting?.('success');

      // Vérification post-écriture
      const verificationResult = await verifyWriteCallback(ndef, message);
      if (!verificationResult) {
        throw new Error('Échec de la vérification post-écriture');
      }

    } catch (err) {
      onWriting?.('error', err as Error);
      throw err;
    }
  }, [onWriting, verifyWriteCallback]);

  // Utilitaires
  const detectFormat = (message: NDEFMessage): NFCFormat => {
    // Logique de détection du format basée sur le contenu
    const record = message.records[0];
    if (record.recordType === "url") return "url";
    if (record.recordType === "text") return "text";
    if (record.recordType.includes("vcard")) return "vcard";
    return "custom";
  };

  const parseNDEFMessage = (message: NDEFMessage): any => {
    // Parser les données selon le format
    const record = message.records[0];
    switch (record.recordType) {
      case "url":
        return new TextDecoder().decode(record.data);
      case "text":
        return new TextDecoder().decode(record.data);
      default:
        return record.data;
    }
  };

  const createNDEFMessage = (data: any, format: NFCFormat = 'text'): NDEFMessage => {
    // Créer un message NDEF selon le format
    let records: NDEFRecord[] = [];

    switch (format) {
      case "url":
        records = [{
          recordType: "url",
          data: new TextEncoder().encode(data),
        }];
        break;
      case "text":
        records = [{
          recordType: "text",
          data: new TextEncoder().encode(data),
        }];
        break;
      // Ajouter d'autres formats au besoin
    }

    return { records } as NDEFMessage;
  };


  return {
    status,
    isScanning,
    error,
    history,
    startScanning,
    writeData,
  };
}