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

const CUSTOM_LOADERS: Partial<Record<Namespace, Loader>> = {};

export const translationsLoader = NAMESPACES.reduce(
  (acc, ns) => {
    acc[ns] = CUSTOM_LOADERS[ns] ?? ((locale: Locale) => DEFAULT_LOADER(ns, locale));
    return acc;
  },
  {} as Record<Namespace, Loader>
);
