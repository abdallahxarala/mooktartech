"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  Nfc,
  BadgeCheck,
  CreditCard,
  Printer,
  Tag,
  Building2,
  Calendar,
  ShoppingBag,
  BookOpen,
  HelpCircle,
  FileText,
  Users,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface MegaMenuItem {
  title: string;
  href: string;
  description: string;
  image?: string;
  placeholder?: {
    gradient: string;
    icon: React.ReactNode;
  };
  badge?: string;
  hot?: boolean;
}

interface MegaMenuSection {
  title: string;
  items: MegaMenuItem[];
}

const megaMenuConfig: Record<string, MegaMenuSection[]> = {
  services: [
    {
      title: "Solutions Digitales",
      items: [
        {
          title: "Cartes NFC",
          href: "/nfc-editor",
          description: "Carte de visite digitale instantanée",
          placeholder: {
            gradient: "from-orange-500 to-pink-500",
            icon: <Nfc className="w-12 h-12 text-white" />
          },
          badge: "Gratuit",
          hot: true
        },
        {
          title: "Badges Pro",
          href: "/badge-editor/pro",
          description: "Design, événements & impression",
          placeholder: {
            gradient: "from-blue-500 to-purple-500",
            icon: <BadgeCheck className="w-12 h-12 text-white" />
          },
          badge: "Nouveau",
          hot: true
        }
      ]
    },
    {
      title: "Outils Complémentaires",
      items: [
        {
          title: "Générateur QR",
          href: "/qr-generator",
          description: "QR codes personnalisés",
          placeholder: {
            gradient: "from-green-500 to-teal-500",
            icon: <Tag className="w-12 h-12 text-white" />
          }
        }
      ]
    }
  ],

  produits: [
    {
      title: "Cartes & Badges",
      items: [
        {
          title: "Cartes PVC",
          href: "/products/cartes-pvc",
          description: "Cartes plastiques personnalisées",
          placeholder: {
            gradient: "from-purple-500 to-indigo-500",
            icon: <CreditCard className="w-12 h-12 text-white" />
          }
        },
        {
          title: "Badges Événements",
          href: "/products/badges",
          description: "Badges professionnels pour événements",
          placeholder: {
            gradient: "from-red-500 to-orange-500",
            icon: <BadgeCheck className="w-12 h-12 text-white" />
          }
        },
        {
          title: "Tags NFC",
          href: "/products/tags-nfc",
          description: "Tags et stickers NFC",
          placeholder: {
            gradient: "from-cyan-500 to-blue-500",
            icon: <Tag className="w-12 h-12 text-white" />
          }
        }
      ]
    },
    {
      title: "Équipements",
      items: [
        {
          title: "Imprimantes",
          href: "/products/imprimantes",
          description: "Imprimantes de cartes professionnelles",
          placeholder: {
            gradient: "from-gray-700 to-gray-900",
            icon: <Printer className="w-12 h-12 text-white" />
          },
          badge: "Pro"
        }
      ]
    }
  ],

  solutions: [
    {
      title: "Par Secteur",
      items: [
        {
          title: "Entreprises",
          href: "/solutions/entreprises",
          description: "Solutions pour entreprises et PME",
          placeholder: {
            gradient: "from-blue-600 to-indigo-600",
            icon: <Building2 className="w-12 h-12 text-white" />
          }
        },
        {
          title: "Événements",
          href: "/solutions/evenements",
          description: "Gestion complète d'événements",
          placeholder: {
            gradient: "from-purple-600 to-pink-600",
            icon: <Calendar className="w-12 h-12 text-white" />
          },
          hot: true
        },
        {
          title: "Retail",
          href: "/solutions/retail",
          description: "Solutions pour commerces",
          placeholder: {
            gradient: "from-green-600 to-teal-600",
            icon: <ShoppingBag className="w-12 h-12 text-white" />
          }
        }
      ]
    }
  ],

  ressources: [
    {
      title: "Apprentissage",
      items: [
        {
          title: "Blog",
          href: "/blog",
          description: "Actualités et tendances NFC",
          placeholder: {
            gradient: "from-orange-500 to-red-500",
            icon: <BookOpen className="w-12 h-12 text-white" />
          }
        },
        {
          title: "Documentation",
          href: "/docs",
          description: "Guides et tutoriels",
          placeholder: {
            gradient: "from-blue-500 to-cyan-500",
            icon: <FileText className="w-12 h-12 text-white" />
          }
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          title: "Centre d'Aide",
          href: "/support",
          description: "FAQ et assistance",
          placeholder: {
            gradient: "from-purple-500 to-pink-500",
            icon: <HelpCircle className="w-12 h-12 text-white" />
          }
        },
        {
          title: "Contact",
          href: "/contact",
          description: "Contactez notre équipe",
          placeholder: {
            gradient: "from-green-500 to-emerald-500",
            icon: <Users className="w-12 h-12 text-white" />
          }
        }
      ]
    }
  ]
};

interface UniversalMegaMenuProps {
  section: "services" | "produits" | "solutions" | "ressources";
  isOpen: boolean;
  onClose: () => void;
}

export function UniversalMegaMenu({ section, isOpen, onClose }: UniversalMegaMenuProps) {
  const config = megaMenuConfig[section];
  
  if (!isOpen || !config) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 w-full bg-white shadow-2xl border-t z-50"
        onMouseLeave={onClose}
      >
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${config.length}, 1fr)` }}>
            {config.map((section, sectionIdx) => (
              <div key={section.title}>
                {/* Section Title */}
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  {section.title}
                </h3>

                {/* Items Grid */}
                <div className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIdx * section.items.length + itemIdx) * 0.05 }}
                    >
                      <Link href={item.href} onClick={onClose}>
                        <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:border-primary-orange hover:shadow-lg transition-all duration-200">
                          {/* Hot Badge */}
                          {item.hot && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                              <Sparkles className="w-3 h-3" />
                              HOT
                            </div>
                          )}

                          {/* Badge */}
                          {item.badge && !item.hot && (
                            <span className="absolute top-3 right-3 bg-primary-orange text-white px-2 py-1 rounded-full text-xs font-semibold">
                              {item.badge}
                            </span>
                          )}

                          <div className="flex items-start gap-4">
                            {/* Image/Placeholder */}
                            <div className={`w-20 h-20 flex-shrink-0 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.placeholder?.gradient} group-hover:scale-110 transition-transform duration-200`}>
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  width={80}
                                  height={80}
                                  className="object-cover rounded-lg"
                                />
                              ) : (
                                item.placeholder?.icon
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 group-hover:text-primary-orange transition-colors mb-1 flex items-center gap-2">
                                {item.title}
                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Besoin d'aide pour choisir ? 
                <Link href="/contact" className="text-primary-orange hover:underline ml-1">
                  Contactez-nous
                </Link>
              </p>
              <Link href="/products">
                <button className="px-6 py-2 bg-primary-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                  Voir tous les produits
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
