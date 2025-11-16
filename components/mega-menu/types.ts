"use client";

import { DivideIcon as LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  featured?: boolean;
  children?: NavItem[];
}

export interface MegaMenuProps {
  onNavigate?: () => void;
}

export interface FeaturedContentProps {
  category: "products" | "solutions" | "virtual-cards";
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavItem[];
}