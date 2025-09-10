import AppContainer from '@/components/layout/AppContainer';
import { getSession } from '@/features/auth/utils/get-session';
import { AppRoute } from '@/features/common/constants/routes';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface PrivateLayoutProps {
  children: ReactNode;
  params: Promise<{ chatId: string }>;
}

async function PrivateLayout({ children }: PrivateLayoutProps) {
  const session = await getSession();

  if (!session) {
    redirect(AppRoute.LOGIN);
  }

  return <AppContainer>{children}</AppContainer>;
}

export default PrivateLayout;
