'use client';

import useClient from '@/features/common/hooks/useClient';
import {
  TranslationsProvider,
  TranslationStore,
} from '@/features/i18n/contexts/translations.context';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { memo, ReactNode } from 'react';
import { ModalProvider } from './modal-provider';
import { StylesProvider } from './styles-provider';
import { ToasterProvider } from './toaster-provider';

type Props = {
  children: ReactNode;
  locale: Locale;
  translations?: TranslationStore;
  session: Session | null;
};

function Providers({ children, session, locale, translations }: Readonly<Props>) {
  const isClient = useClient();

  if (!isClient) return null;

  const providers: ((node: ReactNode) => ReactNode)[] = [
    (node) => (
      <TranslationsProvider initialLocale={locale} translations={translations}>
        {node}
      </TranslationsProvider>
    ),
    (node) => <SessionProvider session={session}>{node}</SessionProvider>,
    (node) => <StylesProvider>{node}</StylesProvider>,
    (node) => <ModalProvider>{node}</ModalProvider>,
    (node) => <ToasterProvider>{node}</ToasterProvider>,
  ];

  return <>{providers.reduceRight((acc, wrap) => wrap(acc), children)}</>;
}

export default memo(Providers);
