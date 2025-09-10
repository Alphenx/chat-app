'use client';

import useClient from '@/features/common/hooks/useClient';
import { TranslationsProvider } from '@/features/i18n/contexts/translations.context';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { memo, ReactNode } from 'react';
import { ModalProvider } from './modal-provider';
import { StylesProvider } from './styles-provider';
import { ToasterProvider } from './toaster-provider';

type Props = {
  children: ReactNode;
  locale: Locale;
  session: Session | null;
};

function Providers({ children, session, locale }: Readonly<Props>) {
  const isClient = useClient();

  if (!isClient) return null;

  const providers: ((node: ReactNode) => ReactNode)[] = [
    (node) => <TranslationsProvider initialLocale={locale}>{node}</TranslationsProvider>,
    (node) => <SessionProvider session={session}>{node}</SessionProvider>,
    (node) => <StylesProvider>{node}</StylesProvider>,
    (node) => <ModalProvider>{node}</ModalProvider>,
    (node) => <ToasterProvider>{node}</ToasterProvider>,
  ];

  return <>{providers.reduceRight((acc, wrap) => wrap(acc), children)}</>;
}

export default memo(Providers);
