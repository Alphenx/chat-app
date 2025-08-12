/**
 * Translation modules for the application.
 * Contains type definitions for translation modules used in the application.
 * Each namespace corresponds to a feature or section of the application.
 * DEV MODE
 */

export type TranslationModules = {
  auth: typeof import('@/features/auth/i18n');
};
