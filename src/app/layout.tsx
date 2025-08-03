import { getSession } from '@/features/auth/actions/auth.actions';
import { INITIAL_NAMESPACES } from '@/features/i18n/config';
import { detectLocaleServer, initTranslations } from '@/features/i18n/utils';
import Providers from '@/providers/providers';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chat App',
  description:
    'Modern and efficient live chat application, where users can chat with each other in real-time.',
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Readonly<Props>) {
  const locale = await detectLocaleServer();
  const translations = await initTranslations(locale, INITIAL_NAMESPACES);
  const session = await getSession();

  return (
    <html lang={locale}>
      <body>
        <Providers session={session} locale={locale} translations={translations}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
