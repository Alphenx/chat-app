import { LoginForm } from '@/features/auth/components/LoginForm';
import { LoginWithToken } from '@/features/auth/components/LoginWithToken';

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function Login({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (token) {
    return <LoginWithToken token={token} />;
  }

  return <LoginForm />;
}
