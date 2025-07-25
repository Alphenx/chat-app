'use client';

import useClient from '@/features/common/hooks/useClient';
import { TranslationsProvider } from '@/features/i18n/contexts/translations.context';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { memo, ReactNode } from 'react';

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
  ];

  return <>{providers.reduceRight((acc, wrap) => wrap(acc), children)}</>;
}

export default memo(Providers);
