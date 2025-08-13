'use client';

import { Feedback } from '@/features/auth/components/common/FormFeedback';
import { AuthError } from '@/features/auth/errors/auth.error';
import { AppRoute } from '@/features/common/constants/routes';
import { tryCatch } from '@/features/common/errors/try-catch';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { signIn, SignInResponse } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

function useLogin(token?: string) {
  const { t } = useTranslations('auth');
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleSignInResult = useCallback(
    async (result?: SignInResponse) => {
      // No response was received (rare case)
      if (!result || (!result.ok && !result.error)) {
        setFeedback({
          message: t('Something went wrong. Please try again later.', 'errors.defaultError'),
          status: 'error',
        });
        return false;
      }

      // Error result (serialized by authorize)
      if (!result.ok && result.error) {
        const [expected, unknown] = await tryCatch<AuthError, AuthError>(JSON.parse(result.error!));
        const error = expected ?? unknown;
        setFeedback({ message: t(error.message, error.i18nKey), status: 'error' });
        return false;
      }

      setFeedback(null);
      return true;
    },
    [t]
  );

  const hasTriedTokenLogin = useRef(false);

  // If there is token, try to log in automatically
  useEffect(() => {
    if (!token || hasTriedTokenLogin.current) return;
    hasTriedTokenLogin.current = true;

    (async () => {
      const result = await signIn('credentials', {
        token,
        callbackUrl: AppRoute.DASHBOARD,
        redirect: false,
      });
      const success = await handleSignInResult(result);
      if (success) redirect(AppRoute.DASHBOARD);
    })();
  }, [handleSignInResult, token]);

  return { handleSignInResult, feedback, setFeedback };
}

export default useLogin;
