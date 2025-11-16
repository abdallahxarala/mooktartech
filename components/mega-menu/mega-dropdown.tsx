"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Nfc, 
  BadgeCheck, 
  QrCode,
  CreditCard,
  Printer,
  Tag,
  Calendar,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Image from "next/image";

interface MenuItem {
  title: string;
  href: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  image?: string;
  badge?: string;
  hot?: boolean;
}

interface MegaDropdownProps {
  section: "nfc" | "badges" | "produits" | null;
  items: MenuItem[];
  onClose: () => void;
}

export const menuConfig: Record<string, MenuItem[]> = {
  nfc: [
    {
      title: "Cartes NFC",
      href: "/fr/nfc-editor",
      description: "Carte de visite digitale instantanée",
      icon: <Nfc className="w-8 h-8" />,
      gradient: "from-orange-500 to-pink-500",
      image: "/images/menu/nfc-card.svg",
      badge: "Gratuit",
      hot: true
    },
    {
      title: "Générateur QR",
      href: "/fr/qr-generator",
      description: "QR codes personnalisés",
      icon: <QrCode className="w-8 h-8" />,
      gradient: "from-green-500 to-teal-500",
      image: "/images/menu/qr-code.svg"
    }
  ],
  
  badges: [
    {
      title: "Badge Designer Pro",
      href: "/fr/badge-editor/pro",
      description: "Design, événements & impression",
      icon: <BadgeCheck className="w-8 h-8" />,
      gradient: "from-blue-500 to-purple-500",
      image: "/images/menu/badge-designer.svg",
      badge: "Nouveau",
      hot: true
    },
    {
      title: "Gestion Événements",
      href: "/fr/badge-editor/events",
      description: "Créer et gérer vos événements",
      icon: <Calendar className="w-8 h-8" />,
      gradient: "from-purple-500 to-pink-500"
    }
  ],
  
  produits: [
    {
      title: "Cartes PVC",
      href: "/fr/products?category=cartes-pvc",
      description: "Cartes plastiques personnalisées",
      icon: <CreditCard className="w-8 h-8" />,
      gradient: "from-purple-500 to-indigo-500",
      image: "/images/menu/pvc-cards.svg"
    },
    {
      title: "Badges Événements",
      href: "/fr/products?category=badges",
      description: "Badges professionnels",
      icon: <BadgeCheck className="w-8 h-8" />,
      gradient: "from-red-500 to-orange-500",
      image: "/images/menu/event-badges.svg"
    },
    {
      title: "Tags NFC",
      href: "/fr/products?category=tags-nfc",
      description: "Tags et stickers NFC",
      icon: <Tag className="w-8 h-8" />,
      gradient: "from-cyan-500 to-blue-500",
      image: "/images/menu/nfc-tags.svg"
    },
    {
      title: "Imprimantes",
      href: "/fr/products?category=imprimantes",
      description: "Imprimantes professionnelles",
      icon: <Printer className="w-8 h-8" />,
      gradient: "from-gray-700 to-gray-900",
      image: "/images/menu/printers.svg",
      badge: "Pro"
    }
  ]
};

export function MegaDropdown({ section, items, onClose }: MegaDropdownProps) {
  if (!section || !items || items.length === 0) return null;
  
  const isWide = items.length > 2;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={section}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 pt-2 z-50"
        onMouseLeave={onClose}
      >
        <div className={`bg-white rounded-xl shadow-2xl border border-gray-200 p-6 ${
          isWide ? 'w-[600px]' : 'w-[400px]'
        }`}>
          <div className={`grid gap-4 ${
            isWide ? 'grid-cols-2' : 'grid-cols-1'
          }`}>
            {items.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={item.href} onClick={onClose}>
                  <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-200">
                    {/* Hot Badge */}
                    {item.hot && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        HOT
                      </div>
                    )}

                    {/* Regular Badge */}
                    {item.badge && !item.hot && (
                      <span className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {item.badge}
                      </span>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon/Image */}
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden relative group-hover:scale-110 transition-transform duration-200 shadow-md">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${item.gradient}`}>
                            <div className="text-white">
                              {item.icon}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors mb-1 flex items-center gap-2">
                          {item.title}
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </h3>
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

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link 
              href={section === "produits" ? "/fr/products" : section === "nfc" ? "/fr/nfc-editor" : "/fr/badge-editor/pro"}
              className="text-sm text-orange-500 hover:underline flex items-center gap-1"
              onClick={onClose}
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
