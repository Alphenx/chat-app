import { LoginForm } from '@/features/auth/components/LoginForm';

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function Login({ searchParams }: PageProps) {
  const { token } = await searchParams;

  return <LoginForm token={token} />;
}
