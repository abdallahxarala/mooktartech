"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MobileMenuProps } from "./types";

export function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { locale } = useParams();

  return (
    <>
      {isOpen && (
        <div className="lg:hidden border-t bg-white animate-fade-in-up">
          <div className="container mx-auto px-4 py-4 animate-fade-in-up">
            <div className="space-y-4 animate-fade-in-up">
              {navigation.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        className="flex items-center justify-between w-full py-2 text-left animate-fade-in-up"
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === item.label ? null : item.label
                          )
                        }
                      >
                        <div className="flex items-center gap-2 animate-fade-in-up">
                          {item.icon && (
                            <item.icon className="h-5 w-5 text-primary-orange animate-fade-in-up" />
                          )}
                          <span className="font-medium animate-fade-in-up">{item.label}</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            activeMenu === item.label && "rotate-180"
                          )}
                        />
                      </button>

                      
                        {activeMenu === item.label && (
                          <div>
                            className="pl-4 space-y-2 animate-fade-in-up"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                href={`/${locale}${child.href}`}
                                onClick={() => {
                                  onClose();
                                  setActiveMenu(null);
                                }}
                              >
                                <div className="py-2 hover:bg-gray-50 rounded-lg px-3 animate-fade-in-up">
                                  <div className="flex items-center space-x-2 animate-fade-in-up">
                                    {child.icon && (
                                      <child.icon className="h-4 w-4 text-gray-500 animate-fade-in-up" />
                                    )}
                                    <span className="text-sm font-medium animate-fade-in-up">
                                      {child.label}
                                    </span>
                                  </div>
                                  {child.description && (
                                    <p className="mt-1 text-xs text-gray-500 pl-6 animate-fade-in-up">
                                      {child.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      
                    </>
                  ) : (
                    <Link
                      href={`/${locale}${item.href}`}
                      onClick={onClose}
                      className="flex items-center gap-2 py-2 text-gray-600 hover:text-gray-900 animate-fade-in-up"
                    >
                      {item.icon && <item.icon className="h-5 w-5 animate-fade-in-up" />}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
