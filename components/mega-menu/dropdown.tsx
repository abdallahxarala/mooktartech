"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { 
  Nfc, 
  BadgeCheck, 
  QrCode, 
  Printer, 
  CreditCard, 
  Tag,
  ArrowRight,
  Sparkles,
  Zap,
  Palette,
  FileText,
  Calendar,
  Users
} from "lucide-react";

interface MegaMenuDropdownProps {
  type: "nfc" | "badges" | "products";
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenuDropdown({ type, isOpen, onClose }: MegaMenuDropdownProps) {
  const params = useParams();
  const pathname = usePathname();
  
  // Détecter le contexte multitenant
  const locale = (params?.locale as string) || 'fr';
  const slug = params?.slug as string | undefined;
  const isMultitenant = pathname?.includes('/org/') && slug;
  const basePath = isMultitenant ? `/${locale}/org/${slug}` : `/${locale}`;
  
  if (!isOpen) return null;

  const content = {
    nfc: {
      title: "Cartes NFC",
      items: [
        {
          title: "Créer ma carte NFC",
          href: `${basePath}/nfc-editor`,
          description: "Wizard interactif en 5 minutes",
          icon: <Sparkles className="w-6 h-6" />,
          gradient: "from-orange-500 to-pink-500",
          badge: "Gratuit",
          features: ["Wizard gamifié", "QR Code inclus", "Analytics"]
        },
        {
          title: "Mes cartes",
          href: `${basePath}/dashboard/cards`,
          description: "Gérer mes cartes créées",
          icon: <FileText className="w-6 h-6" />,
          gradient: "from-blue-500 to-purple-500",
          features: ["Vue d'ensemble", "Statistiques", "Modifier"]
        },
        {
          title: "Générateur QR",
          href: `${basePath}/qr-generator`,
          description: "QR codes personnalisés",
          icon: <QrCode className="w-6 h-6" />,
          gradient: "from-green-500 to-teal-500",
          features: ["Personnalisation", "Export HD", "Logos"]
        }
      ]
    },
    badges: {
      title: "Badges Pro",
      items: [
        {
          title: "Design de Badges",
          href: `${basePath}/badge-editor/pro`,
          description: "Canvas de design professionnel",
          icon: <Palette className="w-6 h-6" />,
          gradient: "from-blue-500 to-purple-500",
          badge: "Pro",
          features: ["Canvas avancé", "Templates", "Variables dynamiques"]
        },
        {
          title: "Gestion d'Événements",
          href: `${basePath}/badge-editor/events`,
          description: "Organiser vos événements",
          icon: <Calendar className="w-6 h-6" />,
          gradient: "from-purple-500 to-pink-500",
          features: ["Créer événement", "Participants", "Check-in"]
        },
        {
          title: "Import CSV",
          href: `${basePath}/badge-editor/import`,
          description: "Importer participants en masse",
          icon: <Users className="w-6 h-6" />,
          gradient: "from-green-500 to-emerald-500",
          features: ["Upload CSV", "Mapping", "Preview"]
        },
        {
          title: "Impression",
          href: `${basePath}/badge-editor/print`,
          description: "File d'impression batch",
          icon: <Printer className="w-6 h-6" />,
          gradient: "from-gray-700 to-gray-900",
          features: ["Queue", "Preview", "Export PDF"]
        }
      ]
    },
    products: {
      title: "Produits",
      categories: [
        {
          title: "Cartes & Badges",
          items: [
            {
              title: "Cartes PVC",
              href: `${basePath}/shop?category=cartes-pvc`,
              description: "Cartes plastiques personnalisées",
              icon: <CreditCard className="w-6 h-6" />,
              gradient: "from-purple-500 to-indigo-500"
            },
            {
              title: "Badges Événements",
              href: `${basePath}/shop?category=badges`,
              description: "Badges professionnels",
              icon: <BadgeCheck className="w-6 h-6" />,
              gradient: "from-red-500 to-orange-500"
            },
            {
              title: "Tags NFC",
              href: `${basePath}/shop?category=tags-nfc`,
              description: "Tags et stickers NFC",
              icon: <Tag className="w-6 h-6" />,
              gradient: "from-cyan-500 to-blue-500"
            }
          ]
        },
        {
          title: "Équipements",
          items: [
            {
              title: "Imprimantes",
              href: `${basePath}/shop?category=imprimantes`,
              description: "Imprimantes professionnelles",
              icon: <Printer className="w-6 h-6" />,
              gradient: "from-gray-700 to-gray-900",
              badge: "Pro"
            },
            {
              title: "Accessoires",
              href: `${basePath}/shop?category=accessoires`,
              description: "Ribbons, cartouches, etc.",
              icon: <Tag className="w-6 h-6" />,
              gradient: "from-blue-500 to-teal-500"
            }
          ]
        }
      ]
    }
  };

  const menuContent = content[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 mt-2 w-full bg-white shadow-2xl border-t border-gray-200 rounded-b-2xl overflow-hidden z-50"
          onMouseLeave={onClose}
        >
          <div className="container mx-auto px-6 py-8">
            {type === "products" ? (
              // Mega Menu Grid pour Produits
              <div className="grid grid-cols-2 gap-8">
                {menuContent.categories?.map((category, catIdx) => (
                  <div key={catIdx}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      {category.title}
                    </h3>
                    <div className="space-y-3">
                      {category.items.map((item, itemIdx) => (
                        <motion.div
                          key={itemIdx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (catIdx * category.items.length + itemIdx) * 0.05 }}
                        >
                          <Link href={item.href} onClick={onClose}>
                            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-200">
                              {item.badge && (
                                <span className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                  {item.badge}
                                </span>
                              )}
                              <div className="flex items-start gap-4">
                                <div className={`w-16 h-16 flex-shrink-0 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.gradient} group-hover:scale-110 transition-transform duration-200`}>
                                  <div className="text-white">
                                    {item.icon}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors mb-1 flex items-center gap-2">
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
            ) : (
              // Dropdown Simple pour NFC et Badges
              <div className="grid grid-cols-3 gap-6">
                {menuContent.items?.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link href={item.href} onClick={onClose}>
                      <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-orange-500 hover:shadow-xl transition-all duration-200">
                        {/* Badge */}
                        {item.badge && (
                          <span className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {item.badge}
                          </span>
                        )}

                        <div className="flex flex-col items-center text-center mb-4">
                          {/* Icon Placeholder */}
                          <div className={`w-20 h-20 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.gradient} group-hover:scale-110 transition-transform duration-200 mb-4`}>
                            <div className="text-white">
                              {item.icon}
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors mb-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {item.description}
                          </p>

                          {/* Features */}
                          {item.features && (
                            <ul className="space-y-2 w-full">
                              {item.features.map((feature, fIdx) => (
                                <li
                                  key={fIdx}
                                  className="flex items-center gap-2 text-xs text-gray-700"
                                >
                                  <ArrowRight className="w-3 h-3 text-orange-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Footer Quick Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Besoin d'aide ?
                  <Link href={`${basePath}/contact`} className="text-orange-500 hover:underline ml-1" onClick={onClose}>
                    Contactez-nous
                  </Link>
                </p>
                <Link href={type === "products" ? `${basePath}/shop` : type === "nfc" ? `${basePath}/nfc-editor` : `${basePath}/badge-editor/pro`}>
                  <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium" onClick={onClose}>
                    Voir tout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
