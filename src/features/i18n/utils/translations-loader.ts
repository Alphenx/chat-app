import { NAMESPACES } from '@/features/i18n/config';
import I18nError from '@/features/i18n/errors/i18n.error';
import { log } from '@/log/logger';

function DEFAULT_LOADER<N extends Namespace>(namespace: N, locale: Locale): Promise<TranslationsOf<N, Locale>> {
  return safeImport<TranslationsOf<N, Locale>>(
    () =>
      import(
        /* webpackInclude: /\/i18n\/[a-z]{2}\.ts$/ */
        /* webpackChunkName: "i18n-[request]" */
        `@/features/${namespace}/i18n/${locale}`
      ),
    { namespace, locale }
  );
}

type TOf<N extends Namespace> = TranslationsOf<N, Locale>;

const CUSTOM_LOADERS: Partial<Record<Namespace, Loader>> = {
  verificationEmail: (locale: Locale) =>
    safeImport<TOf<'verificationEmail'>>(
      () =>
        import(
          /* webpackInclude: /\/i18n\/[a-z]{2}\.ts$/ */
          /* webpackChunkName: "i18n-[request]" */
          `@/features/common/services/email/templates/verification/i18n/${locale}`
        ),
      { namespace: 'verificationEmail', locale }
    ),
  resetPasswordEmail: (locale: Locale) =>
    safeImport<TOf<'resetPasswordEmail'>>(
      () =>
        import(
          /* webpackInclude: /\/i18n\/[a-z]{2}\.ts$/ */
          /* webpackChunkName: "i18n-[request]" */
          `@/features/common/services/email/templates/reset-password/i18n/${locale}`
        ),
      { namespace: 'resetPasswordEmail', locale }
    ),
  email: (locale: Locale) =>
    safeImport<TOf<'email'>>(
      () =>
        import(
          /* webpackInclude: /\/i18n\/[a-z]{2}\.ts$/ */
          /* webpackChunkName: "i18n-[request]" */
          `@/features/common/services/email/i18n/${locale}`
        ),
      { namespace: 'email', locale }
    ),
  realtime: (locale: Locale) =>
    safeImport<TOf<'realtime'>>(
      () =>
        import(
          /* webpackInclude: /\/i18n\/[a-z]{2}\.ts$/ */
          /* webpackChunkName: "i18n-[request]" */
          `@/features/common/services/realtime/i18n/${locale}`
        ),
      { namespace: 'realtime', locale }
    ),
};

export const translationsLoader = NAMESPACES.reduce(
  (acc, ns) => {
    const fallback: Loader = (locale) => DEFAULT_LOADER(ns, locale);
    acc[ns] = CUSTOM_LOADERS[ns] ?? fallback;
    return acc;
  },
  {} as Record<Namespace, Loader>
);

async function safeImport<T>(
  importer: () => Promise<{ default: T }>,
  params: { namespace: Namespace; locale: Locale }
): Promise<T> {
  try {
    return (await importer()).default;
  } catch (error) {
    log.error(`Error loading translations for ${params.namespace} (${params.locale}):`, error);
    throw I18nError.moduleNotFound(params);
  }
}
