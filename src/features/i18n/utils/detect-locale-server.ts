'use server';

import { FALLBACK_LOCALE, LOCALES } from '@/features/i18n/config';
import { cookies, headers } from 'next/headers';

export async function detectLocaleServer(): Promise<Locale> {
  // 1) Cookie “locale”
  const cookieLocale = (await cookies()).get('locale')?.value as Locale;
  if (cookieLocale && LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2) Header Accept-Language
  const accept = (await headers()).get('accept-language') || '';
  for (const part of accept.split(',')) {
    const lang = part.trim().split(';')[0].split('-')[0] as Locale;
    if (LOCALES.includes(lang)) {
      return lang;
    }
  }

  return FALLBACK_LOCALE;
}
