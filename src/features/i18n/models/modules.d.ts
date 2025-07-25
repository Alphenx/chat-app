/**
 * Translation modules for the application.
 * Contains type definitions for translation modules used in the application.
 * Each namespace corresponds to a feature or section of the application.
 * DEV MODE
 */

import type * as authTranslations from '@/features/auth/i18n';

export type TranslationModules = {
  auth: typeof authTranslations;
} & TranslationObject;
