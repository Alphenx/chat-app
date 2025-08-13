/**
 *
 * Internationalization configuration for the application.
 * Defines supported locales, fallback locale, and namespaces for translations.
 *
 */
export const FALLBACK_LOCALE = 'en';
export const LOCALES = ['en', 'es'] as const;

export const NAMESPACES = [
  'auth',
  'common',
  'account',
  'email',
  'resetPasswordEmail',
  'verificationEmail',
] as const;

export const INITIAL_NAMESPACES: Namespace[] = ['auth', 'common'] as const;
