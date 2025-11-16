"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { type Locale, locales } from "@/i18n.config";
import { cn } from "@/lib/utils";

interface LocalizedLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  href: string;
  children: React.ReactNode;
  preserveLocale?: boolean;
  forceLocale?: Locale;
  className?: string;
  prefetch?: boolean;
  scroll?: boolean;
  replace?: boolean;
  isActive?: boolean;
}

/**
 * Composant Link avec support de l'internationalisation
 * 
 * @example
 * // Lien basique qui préserve la locale actuelle
 * <LocalizedLink href="/products">Produits</LocalizedLink>
 * 
 * @example
 * // Lien qui force une locale spécifique
 * <LocalizedLink href="/products" forceLocale="en">Products</LocalizedLink>
 * 
 * @example
 * // Lien externe (non modifié)
 * <LocalizedLink href="https://example.com">Externe</LocalizedLink>
 */
export function LocalizedLink({
  href,
  children,
  preserveLocale = true,
  forceLocale,
  className,
  prefetch = true,
  scroll = true,
  replace = false,
  isActive,
  ...props
}: LocalizedLinkProps) {
  const params = useParams();
  const currentLocale = params?.locale as Locale;

  // Si l'URL est externe, ne pas modifier
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <Link 
        href={href} 
        className={className}
        prefetch={prefetch}
        scroll={scroll}
        replace={replace}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // Déterminer la locale à utiliser
  const targetLocale = forceLocale && locales.includes(forceLocale) 
    ? forceLocale 
    : (preserveLocale ? currentLocale : undefined);

  // Construire l'URL localisée
  const localizedHref = getLocalizedHref(href, targetLocale);

  // Vérifier si le lien est actif
  const isLinkActive = isActive ?? (
    typeof window !== 'undefined' && 
    window.location.pathname === localizedHref
  );

  return (
    <Link
      href={localizedHref}
      className={cn(className, isLinkActive && "text-primary")}
      prefetch={prefetch}
      scroll={scroll}
      replace={replace}
      aria-current={isLinkActive ? 'page' : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Hook pour obtenir l'URL localisée
 * 
 * @example
 * const { getLocalizedHref } = useLocalizedLink();
 * const productsUrl = getLocalizedHref('/products');
 */
export function useLocalizedLink() {
  const params = useParams();
  const currentLocale = params?.locale as Locale;

  const getLocalizedHref = (href: string, targetLocale?: Locale) => {
    // Si l'URL est externe, retourner telle quelle
    if (href.startsWith('http')) return href;

    // Si l'URL commence déjà par une locale, la remplacer
    const localePattern = new RegExp(`^/(${locales.join('|')})`);
    if (localePattern.test(href)) {
      return href.replace(localePattern, `/${targetLocale || currentLocale}`);
    }

    // Sinon, ajouter la locale au début
    return `/${targetLocale || currentLocale}${href.startsWith('/') ? '' : '/'}${href}`;
  };

  return { getLocalizedHref };
}

/**
 * Fonction utilitaire pour obtenir une URL localisée
 */
function getLocalizedHref(href: string, locale?: Locale): string {
  // Si l'URL est externe, retourner telle quelle
  if (href.startsWith('http')) return href;

  // Si pas de locale spécifiée, retourner l'URL telle quelle
  if (!locale) return href;

  // Si l'URL commence déjà par une locale, la remplacer
  const localePattern = new RegExp(`^/(${locales.join('|')})`);
  if (localePattern.test(href)) {
    return href.replace(localePattern, `/${locale}`);
  }

  // Sinon, ajouter la locale au début
  return `/${locale}${href.startsWith('/') ? '' : '/'}${href}`;
}
