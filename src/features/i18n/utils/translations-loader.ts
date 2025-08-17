import { NAMESPACES } from '@/features/i18n/config';
import I18nError from '@/features/i18n/errors/i18n.error';

function DEFAULT_LOADER<N extends Namespace>(
  namespace: N,
  locale: Locale
): Promise<TranslationsOf<N, Locale>> {
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

const CUSTOM_LOADERS: Partial<Record<Namespace, Loader>> = {
  verificationEmail: (locale: Locale): ReturnType<Loader> =>
    safeImport<TranslationsOf<'verificationEmail', Locale>>(
      () =>
        import(
          /* webpackInclude: /\/i18n\/[a-z]{2}\.ts$/ */
          /* webpackChunkName: "i18n-[request]" */
          `@/features/common/services/email/templates/verification/i18n/${locale}`
        ),
      { namespace: 'verificationEmail', locale }
    ),
  resetPasswordEmail: (locale: Locale): ReturnType<Loader> =>
    safeImport<TranslationsOf<'resetPasswordEmail', Locale>>(
      () =>
        import(
          /* webpackInclude: /\/i18n\/[a-z]{2}\.ts$/ */
          /* webpackChunkName: "i18n-[request]" */
          `@/features/common/services/email/templates/reset-password/i18n/${locale}`
        ),
      { namespace: 'resetPasswordEmail', locale }
    ),
  email: (locale: Locale): ReturnType<Loader> =>
    safeImport<TranslationsOf<'email', Locale>>(
      () =>
        import(
          /* webpackInclude: /\/i18n\/[a-z]{2}\.ts$/ */
          /* webpackChunkName: "i18n-[request]" */
          `@/features/common/services/email/i18n/${locale}`
        ),
      { namespace: 'email', locale }
    ),
};

export const translationsLoader = NAMESPACES.reduce(
  (acc, ns) => {
    acc[ns] = CUSTOM_LOADERS[ns] ?? ((locale: Locale) => DEFAULT_LOADER(ns, locale));
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
  } catch {
    throw I18nError.moduleNotFound(params);
  }
}
