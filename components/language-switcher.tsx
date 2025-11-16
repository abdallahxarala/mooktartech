"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, localeNames, localeFlags } from "@/lib/config/i18n";
import Cookies from "js-cookie";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = pathname.split('/')[1];

  const handleLanguageChange = (locale: string) => {
    // Save preference in cookie
    Cookies.set("NEXT_LOCALE", locale, { expires: 365 });

    // Redirect to new URL
    const newPathname = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2 animate-fade-in-up">
          <span className="mr-2 animate-fade-in-up">{localeFlags[currentLocale]}</span>
          <span className="hidden md:inline animate-fade-in-up">{localeNames[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      
        {isOpen && (
          <DropdownMenuContent
            align="end"
            className="w-[160px] animate-fade-in-up"
            asChild
            forceMount
          >
            <div>
              {locales.map((locale) => (
                <DropdownMenuItem
                  key={locale}
                  className="cursor-pointer animate-fade-in-up"
                  onClick={() => handleLanguageChange(locale)}
                >
                  <span className="mr-2 animate-fade-in-up">{localeFlags[locale]}</span>
                  {localeNames[locale]}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        )}
      
    </DropdownMenu>
  );
}
