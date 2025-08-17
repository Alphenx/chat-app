import { getSession } from '@/features/auth/utils/get-session';
import { redirect } from 'next/navigation';

async function RootPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}

export default RootPage;
