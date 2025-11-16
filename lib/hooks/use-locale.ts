"use client";

import { useParams } from 'next/navigation';
import { type Locale, defaultLocale } from '@/i18n.config';

export function useLocale(): Locale {
  const params = useParams();
  const locale = params?.locale as Locale;
  return locale ?? defaultLocale;
}