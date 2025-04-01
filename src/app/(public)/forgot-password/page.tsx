import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ForgotPassword({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (token) {
    return <ResetPasswordForm token={token} />;
  }

  return <ForgotPasswordForm />;
}
