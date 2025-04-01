'use client';
import useClient from '@/features/common/hooks/useClient';
import { SessionProvider } from 'next-auth/react';
import { memo, ReactNode } from 'react';
import { StylesProvider } from './styles-provider';
import { TranslationsProvider } from './translations-provider';

type Props = {
  children: ReactNode;
};

function Providers({ children }: Readonly<Props>) {
  const isClient = useClient();

  if (!isClient) {
    return null;
  }

  return (
    <StylesProvider>
      <TranslationsProvider>
        <SessionProvider>{children}</SessionProvider>
      </TranslationsProvider>
    </StylesProvider>
  );
}

export default memo(Providers);
