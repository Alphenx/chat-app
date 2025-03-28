import { getSession } from '@/features/auth/actions/auth.actions';
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
