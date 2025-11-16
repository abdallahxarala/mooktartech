"use client";

import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "./localized-link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MiniCart } from "@/components/cart/mini-cart";
import { useAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  CreditCard,
  ShoppingBag,
  User,
  ChevronDown,
} from "lucide-react";

const navigation = [
  {
    name: "Produits",
    href: "/products",
    children: [
      { name: "Imprimantes", href: "/products/printers" },
      { name: "Cartes PVC", href: "/products/pvc-cards" },
      { name: "Cartes NFC", href: "/products/nfc-cards" },
      { name: "Accessoires", href: "/products/accessories" },
    ],
  },
  {
    name: "Solutions",
    href: "/solutions",
    children: [
      { name: "Entreprises", href: "/solutions/business" },
      { name: "Éducation", href: "/solutions/education" },
      { name: "Événementiel", href: "/solutions/events" },
      { name: "Gouvernement", href: "/solutions/government" },
    ],
  },
  {
    name: "Services",
    href: "/services",
    children: [
      { name: "Cartes NFC Virtuelles", href: "/nfc-editor" },
      { name: "Éditeur de Badges", href: "/badge-editor/pro" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { locale } = useParams();
  const { isAuthenticated } = useAuthStore();

  const isActive = (href: string) => {
    return pathname === `/${locale}${href}` || pathname.startsWith(`/${locale}${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b animate-fade-in-up">
      <nav className="container mx-auto px-4 animate-fade-in-up">
        <div className="h-16 flex items-center justify-between animate-fade-in-up">
          <LocalizedLink href="/" className="flex items-center space-x-2 animate-fade-in-up">
            <CreditCard className="h-8 w-8 text-primary-orange animate-fade-in-up" />
            <span className="text-xl font-bold animate-fade-in-up">Xarala</span>
          </LocalizedLink>

          {/* Navigation desktop */}
          <div className="hidden lg:flex items-center space-x-8 animate-fade-in-up">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative animate-fade-in-up"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.children ? (
                  <button
                    className={cn(
                      "flex items-center space-x-1 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "text-primary"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <span>{item.name}</span>
                    <ChevronDown className="h-4 w-4 animate-fade-in-up" />
                  </button>
                ) : (
                  <LocalizedLink
                    href={item.href}
                    className={cn(
                      "py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "text-primary"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {item.name}
                  </LocalizedLink>
                )}

                {item.children && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 animate-fade-in-up">
                    {item.children.map((child) => (
                      <LocalizedLink
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "block px-4 py-2 text-sm transition-colors",
                          isActive(child.href)
                            ? "text-primary bg-primary/5"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        {child.name}
                      </LocalizedLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4 animate-fade-in-up">
            <LanguageSwitcher />
            <MiniCart />
            {isAuthenticated ? (
              <LocalizedLink href="/dashboard">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5 animate-fade-in-up" />
                </Button>
              </LocalizedLink>
            ) : (
              <LocalizedLink href="/auth">
                <Button className="bg-primary-orange hover:bg-primary-orange/90 animate-fade-in-up">
                  Connexion
                </Button>
              </LocalizedLink>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden animate-fade-in-up"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5 animate-fade-in-up" />
              ) : (
                <Menu className="h-5 w-5 animate-fade-in-up" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      {isOpen && (
        <div className="lg:hidden border-t bg-white animate-fade-in-up">
            <div className="container mx-auto px-4 py-4 animate-fade-in-up">
              <div className="space-y-4 animate-fade-in-up">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.children ? (
                      <>
                        <button
                          className={cn(
                            "flex items-center justify-between w-full py-2 text-base font-medium",
                            isActive(item.href)
                              ? "text-primary"
                              : "text-gray-600"
                          )}
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === item.name ? null : item.name
                            )
                          }
                        >
                          {item.name}
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              activeDropdown === item.name && "rotate-180"
                            )}
                          />
                        </button>
                        
                          {activeDropdown === item.name && (
                            <div className="pl-4 space-y-2 animate-fade-in-up">
                              {item.children.map((child) => (
                                <LocalizedLink
                                  key={child.name}
                                  href={child.href}
                                  className={cn(
                                    "block py-2 text-sm transition-colors",
                                    isActive(child.href)
                                      ? "text-primary"
                                      : "text-gray-600 hover:text-gray-900"
                                  )}
                                  onClick={() => setIsOpen(false)}
                                >
                                  {child.name}
                                </LocalizedLink>
                              ))}
                            </div>
                          )}
                        
                      </>
                    ) : (
                      <LocalizedLink
                        href={item.href}
                        className={cn(
                          "block py-2 text-base font-medium transition-colors",
                          isActive(item.href)
                            ? "text-primary"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </LocalizedLink>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      
    </header>
  );
}
