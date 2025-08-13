/**
 * Translation modules for the application.
 * Contains type definitions for translation modules used in the application.
 * Each namespace corresponds to a feature or section of the application.
 * DEV MODE
 */

export type TranslationModules = {
  auth: typeof import('@/features/auth/i18n');
  account: typeof import('@/features/account/i18n');
  common: typeof import('@/features/common/i18n');
  email: typeof import('@/features/common/services/email/i18n');
  verificationEmail: typeof import('@/features/common/services/email/templates/verification/i18n');
  resetPasswordEmail: typeof import('@/features/common/services/email/templates/reset-password/i18n');
};
