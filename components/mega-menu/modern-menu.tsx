"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import { 
  Nfc, 
  BadgeCheck, 
  QrCode,
  Printer,
  Calendar,
  Users,
  ArrowRight
} from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  description: string;
  image?: string;
  icon: React.ReactNode;
  badge?: string;
  features?: string[];
}

export function ModernMegaMenu({ isOpen }: { isOpen: boolean }) {
  const t = useTranslations("menu");
  const params = useParams();
  const pathname = usePathname();
  
  // Détecter le contexte multitenant
  const locale = (params?.locale as string) || 'fr';
  const slug = params?.slug as string | undefined;
  const isMultitenant = pathname?.includes('/org/') && slug;
  const basePath = isMultitenant ? `/${locale}/org/${slug}` : `/${locale}`;
  
  const menuItems: MenuItem[] = [
    {
      title: "NFC",
      href: `${basePath}/nfc-editor`,
      description: "Carte de visite digitale instantanée",
      icon: <Nfc className="w-16 h-16" />,
      badge: "Gratuit",
      features: [
        "Wizard interactif",
        "QR Code inclus",
        "Analytics en temps réel"
      ]
    },
    {
      title: "Badges",
      href: `${basePath}/badge-editor/pro`,
      description: "Design, événements & impression pro",
      icon: <BadgeCheck className="w-16 h-16" />,
      badge: "Pro",
      features: [
        "Canvas de design avancé",
        "Gestion d'événements complète",
        "Import CSV & impression batch"
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full left-0 w-full bg-white shadow-2xl border-t"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href}>
                <motion.div
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-primary-orange hover:shadow-xl transition-all"
                >
                {/* Badge */}
                {item.badge && (
                  <span className="absolute top-4 right-4 bg-primary-orange text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {item.badge}
                  </span>
                )}

                <div className="flex gap-6">
                  {/* Image / Placeholder */}
                  <div className={`w-32 h-32 flex-shrink-0 rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform ${
                    item.title === "NFC" 
                      ? "bg-gradient-to-br from-orange-400 to-pink-500" 
                      : "bg-gradient-to-br from-blue-500 to-purple-600"
                  }`}>
                    <motion.div 
                      className="text-white"
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring" }}
                    >
                      {item.icon}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div 
                        className="text-primary-orange"
                        whileHover={{ rotate: 15 }}
                        transition={{ type: "spring" }}
                      >
                        {item.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-orange transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {item.description}
                    </p>

                    {/* Features */}
                    {item.features && (
                      <ul className="space-y-2">
                        {item.features.map((feature, idx) => (
                          <li 
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <ArrowRight className="w-4 h-4 text-primary-orange" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t grid grid-cols-4 gap-4">
          <QuickLink
            icon={<QrCode className="w-5 h-5" />}
            title="Générateur QR"
            href={`${basePath}/qr-generator`}
          />
          <QuickLink
            icon={<Printer className="w-5 h-5" />}
            title="Imprimantes"
            href={`${basePath}/shop?category=imprimantes`}
          />
          <QuickLink
            icon={<Calendar className="w-5 h-5" />}
            title="Événements"
            href={`${basePath}/badge-editor/events`}
          />
          <QuickLink
            icon={<Users className="w-5 h-5" />}
            title="Support"
            href={`${basePath}/contact`}
          />
        </div>
      </div>
    </motion.div>
  );
}

function QuickLink({ icon, title, href }: { icon: React.ReactNode; title: string; href: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
        <div className="text-gray-400 group-hover:text-primary-orange transition-colors">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-700 group-hover:text-primary-orange transition-colors">
          {title}
        </span>
      </div>
    </Link>
  );
}

