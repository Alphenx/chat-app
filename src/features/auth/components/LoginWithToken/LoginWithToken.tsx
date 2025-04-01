'use client';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { LoginForm } from '../LoginForm';

type LoginWithTokenProps = {
  token: string;
};

function LoginWithToken({ token }: LoginWithTokenProps) {
  useEffect(() => {
    const login = async () => {
      await signIn('credentials', { token, callbackUrl: '/dashboard' });
    };
    login();
  }, [token]);

  return <LoginForm />;
}

export default LoginWithToken;
