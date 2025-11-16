"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";
import { FeaturedContent } from "./featured-content";
import { MobileMenu } from "./mobile-menu";
import { navigation } from "./navigation";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  CreditCard,
} from "lucide-react";

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { locale } = useParams();
  const pathname = usePathname();
  const { items } = useCartStore();

  // Gestion du redimensionnement et du défilement
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleResize();
    handleScroll();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Fermeture avec Escape
      if (e.key === "Escape") {
        setIsOpen(false);
        setActiveMenu(null);
      }

      // Navigation avec les flèches
      if (e.key === "ArrowDown" && activeMenu) {
        e.preventDefault();
        const currentItem = navigation.find(item => item.label === activeMenu);
        if (currentItem?.children) {
          const firstChild = document.querySelector(`[data-menu-item="${currentItem.children[0].label}"]`);
          (firstChild as HTMLElement)?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeMenu]);

  // Gestion des clics à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-menu]") && !target.closest("[data-menu-trigger]")) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleNavigation = useCallback((href: string) => {
    router.push(`/${locale}${href}`);
    setIsOpen(false);
    setActiveMenu(null);
  }, [router, locale]);

  return (
    <header 
      className={cn(
        "bg-white border-b transition-all duration-300",
        isScrolled && "shadow-md"
      )}
    >
      <nav className="container mx-auto px-4 animate-fade-in-up">
        <div className="h-16 flex items-center justify-between animate-fade-in-up">
          {/* Logo */}
          <Link 
            href={`/${locale}`} 
            className="flex items-center space-x-2 transition-transform hover:scale-105 animate-fade-in-up"
          >
            <CreditCard className="h-8 w-8 text-primary-orange animate-fade-in-up" />
            <span className="text-xl font-bold animate-fade-in-up">Xarala</span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden lg:flex items-center space-x-8 animate-fade-in-up">
            {navigation.map((item) => (
              <div
                key={item.label}
                className="relative animate-fade-in-up"
                onMouseEnter={() => setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
                data-menu
              >
                {item.children ? (
                  <button
                    className={cn(
                      "flex items-center space-x-1 py-2 text-sm font-medium transition-colors",
                      activeMenu === item.label
                        ? "text-primary"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                    data-menu-trigger
                    aria-expanded={activeMenu === item.label}
                    aria-controls={`menu-${item.label}`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      activeMenu === item.label && "rotate-180"
                    )} />
                  </button>
                ) : (
                  <Link
                    href={`/${locale}${item.href}`}
                    className={cn(
                      "py-2 text-sm font-medium transition-colors",
                      pathname === `/${locale}${item.href}`
                        ? "text-primary"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {item.label}
                  </Link>
                )}

                
                  {activeMenu === item.label && item.children && (
                    <div
                      id={`menu-${item.label}`}
                      className="absolute top-full left-0 w-screen max-w-screen-lg bg-white shadow-lg rounded-lg border mt-2 p-6 animate-fade-in-up"
                      style={{ transform: "translateX(-50%)", left: "50%" }}
                      role="menu"
                    >
                      <div className="grid grid-cols-2 gap-8 animate-fade-in-up">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-6 animate-fade-in-up">
                          {item.children.map((child) => (
                            <div
                              key={child.label}
                              className={cn(
                                "group relative rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                                child.featured && "col-span-2"
                              )}
                              onClick={() => handleNavigation(child.href)}
                              data-menu-item={child.label}
                              tabIndex={0}
                              role="menuitem"
                            >
                              <div className="flex items-center space-x-3 animate-fade-in-up">
                                {child.icon && (
                                  <child.icon className="h-6 w-6 text-primary-orange animate-fade-in-up" />
                                )}
                                <div>
                                  <h3 className="font-medium text-gray-900 group-hover:text-primary animate-fade-in-up">
                                    {child.label}
                                  </h3>
                                  {child.description && (
                                    <p className="mt-1 text-sm text-gray-500 animate-fade-in-up">
                                      {child.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {child.featured && (
                                <Badge className="absolute top-2 right-2 bg-primary-orange animate-fade-in-up">
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="bg-gray-50 rounded-lg overflow-hidden animate-fade-in-up">
                          <FeaturedContent category={item.label.toLowerCase().replace(" ", "-") as any} />
                        </div>
                      </div>
                    </div>
                  )}
                
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 animate-fade-in-up">
            <div className="hidden md:flex items-center bg-gray-100 rounded-full animate-fade-in-up">
              <Input
                type="search"
                placeholder="Rechercher..."
                className="w-64 border-0 bg-transparent focus:ring-0 animate-fade-in-up"
              />
              <Button variant="ghost" size="icon" className="rounded-full animate-fade-in-up">
                <Search className="h-4 w-4 animate-fade-in-up" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="relative animate-fade-in-up"
              onClick={() => router.push(`/${locale}/cart`)}
            >
              <ShoppingCart className="h-5 w-5 animate-fade-in-up" />
              {items.length > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary-orange animate-fade-in-up"
                  variant="secondary"
                >
                  {items.length}
                </Badge>
              )}
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push(`/${locale}/dashboard`)}
            >
              <User className="h-5 w-5 animate-fade-in-up" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden animate-fade-in-up"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
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

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        navigation={navigation}
      />
    </header>
  );
}
