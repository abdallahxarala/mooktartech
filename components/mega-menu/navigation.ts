"use client";

import {
  CreditCard,
  Printer,
  Scan,
  Package,
  Building2,
  GraduationCap,
  PartyPopper,
  Landmark,
  BookOpen,
  Phone,
  Settings,
  HelpCircle,
  Badge,
  Sparkles,
} from "lucide-react";
import type { NavItem } from "./types";

export const navigation: NavItem[] = [
  {
    label: "Produits",
    href: "/products",
    icon: Package,
    children: [
      {
        label: "Imprimantes de cartes",
        href: "/products/printers",
        icon: Printer,
        description: "Imprimantes professionnelles pour tous vos besoins",
        featured: true,
      },
      {
        label: "Cartes PVC",
        href: "/products/pvc-cards",
        icon: CreditCard,
        description: "Cartes de qualité pour une durabilité maximale",
      },
      {
        label: "Cartes NFC",
        href: "/products/nfc-cards",
        icon: CreditCard,
        description: "Solutions NFC innovantes et sécurisées",
        featured: true,
      },
      {
        label: "Lecteurs et scanners",
        href: "/products/readers",
        icon: Scan,
        description: "Équipements de lecture haute performance",
      },
      {
        label: "Accessoires",
        href: "/products/accessories",
        icon: Package,
        description: "Tous les accessoires pour vos équipements",
      },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    icon: Building2,
    children: [
      {
        label: "Entreprises",
        href: "/solutions/business",
        icon: Building2,
        description: "Solutions professionnelles sur mesure",
        featured: true,
      },
      {
        label: "Éducation",
        href: "/solutions/education",
        icon: GraduationCap,
        description: "Solutions pour établissements scolaires",
      },
      {
        label: "Événementiel",
        href: "/solutions/events",
        icon: PartyPopper,
        description: "Gestion d'accès et identification",
      },
      {
        label: "Gouvernement",
        href: "/solutions/government",
        icon: Landmark,
        description: "Solutions sécurisées pour institutions",
        featured: true,
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    icon: Settings,
    children: [
      {
        label: "Cartes NFC Virtuelles",
        href: "/nfc-editor",
        icon: Sparkles,
        description: "Créez votre carte de visite digitale NFC gratuitement",
        featured: true,
      },
      {
        label: "Éditeur de Badges",
        href: "/badge-editor/pro",
        icon: Badge,
        description: "Concevez et imprimez vos badges en série (clients)",
        featured: true,
      },
    ],
  },
  {
    label: "Blog",
    href: "/blog",
    icon: BookOpen,
  },
  {
    label: "Support",
    href: "/support",
    icon: HelpCircle,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Phone,
  },
];