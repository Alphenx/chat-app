import { NAMESPACES } from '@/features/i18n/config';

const DEFAULT_LOADER = async (namespace: Namespace, locale: Locale) => {
  return (
    await import(
      /* webpackInclude: /\/i18n\/[a-z]{2}\.ts$/ */
      /* webpackChunkName: "i18n-[request]" */
      `@/features/${namespace}/i18n/${locale}`
    )
  ).default;
};

const CUSTOM_LOADERS: Partial<Record<Namespace, Loader>> = {
  verificationEmail: async (locale: Locale) => {
    return (
      await import(
        /* webpackInclude: /\/i18n\/[a-z]{2}\.ts$/ */
        /* webpackChunkName: "i18n-[request]" */
        `@/features/common/services/email/templates/verification/i18n/${locale}`
      )
    ).default;
  },
  resetPasswordEmail: async (locale: Locale) => {
    return (
      await import(
        /* webpackInclude: /\/i18n\/[a-z]{2}\.ts$/ */
        /* webpackChunkName: "i18n-[request]" */
        `@/features/common/services/email/templates/reset-password/i18n/${locale}`
      )
    ).default;
  },
  email: async (locale: Locale) => {
    return (
      await import(
        /* webpackInclude: /\/i18n\/[a-z]{2}\.ts$/ */
        /* webpackChunkName: "i18n-[request]" */
        `@/features/common/services/email/i18n/${locale}`
      )
    ).default;
  },
};

export const translationsLoader = NAMESPACES.reduce(
  (acc, ns) => {
    acc[ns] = CUSTOM_LOADERS[ns] ?? ((locale: Locale) => DEFAULT_LOADER(ns, locale));
    return acc;
  },
  {} as Record<Namespace, Loader>
);
