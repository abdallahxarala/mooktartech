"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ArrowRight, Sparkles } from "lucide-react";
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

interface MobileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  title: string;
}

export function MobileDropdown({ isOpen, onClose, items, title }: MobileDropdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="p-6 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href} onClick={onClose}>
                    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 active:scale-95 transition-transform">
                      {item.hot && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          HOT
                        </div>
                      )}

                      {item.badge && !item.hot && (
                        <span className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {item.badge}
                        </span>
                      )}

                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br ${item.gradient} flex items-center justify-center relative`}>
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="text-white absolute inset-0 flex items-center justify-center">
                              {item.icon}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            {item.title}
                            <ArrowRight className="w-4 h-4 text-orange-500" />
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

