"use client";

import { useState, useEffect } from "react";
import { Contact } from "@/lib/types";

// Données de démonstration
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    title: "Directeur Marketing",
    company: "Xarala Solutions",
    email: "john@xarala.co",
    phone: "+221 77 000 00 00",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
    tags: ["Marketing", "Tech"],
    cardName: "Carte Pro",
    createdAt: "2024-03-15T10:00:00Z",
    history: [
      {
        date: "2024-03-15T10:00:00Z",
        description: "Contact ajouté via la carte NFC",
      },
      {
        date: "2024-03-16T14:30:00Z",
        description: "Email de bienvenue envoyé",
      },
    ],
    notes: [
      {
        date: "2024-03-15T11:00:00Z",
        content: "Rencontré lors du salon Tech 2024",
      },
    ],
  },
  // Ajoutez plus de contacts de démonstration ici
];

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement asynchrone
    const loadContacts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setContacts(mockContacts);
      setIsLoading(false);
    };

    loadContacts();
  }, []);

  return { contacts, isLoading };
}