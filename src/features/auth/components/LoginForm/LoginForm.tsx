'use client';

import { Checkbox, Field, Link } from '@/components';
import {
  FormAlternativeMethods,
  FormContainer,
  FormFeedback,
  FormTitle,
} from '@/features/auth/components/common';
import useLogin from '@/features/auth/hooks/useLogin';
import useRememberEmail from '@/features/auth/hooks/useRememberEmail';
import { AppRoute } from '@/features/common/constants/routes';
import { useForm } from '@/features/common/hooks';
import { extractText } from '@/features/common/utils';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Button, HStack, Input } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm({ token }: { token?: string }) {
  const { t } = useTranslations('auth');
  const { handleSignInResult, feedback, setFeedback } = useLogin(token);
  const { email, isRemembered, toggleRemember, handleRemember } = useRememberEmail();

  const { values, errors, loading, handleChange, handleSubmit } = useForm<LoginFormValues>({
    initialValues: { email, password: '' },
    onSubmit,
  });

  async function onSubmit(values: LoginFormValues) {
    const { email, password } = values;

    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: AppRoute.DASHBOARD,
      redirect: false,
    });

    const success = await handleSignInResult(result);

    if (success) {
      handleRemember(email);
      redirect(AppRoute.DASHBOARD);
    }
  }

  return (
    <FormContainer>
      <FormTitle>{t('Sign Up', 'login.form.title')}</FormTitle>

      <FormFeedback feedback={feedback} onClose={() => setFeedback(null)} />

      {/* EMAIL */}
      <Field
        label={t('Email', 'login.form.fields.email.label')}
        errorText={errors.email}
        invalid={!!errors.email}
      >
        <Input
          name='email'
          value={values.email}
          onChange={handleChange}
          placeholder={extractText(t('you@example.com', 'login.form.fields.email.placeholder'))}
          autoComplete='email'
        />
      </Field>

      {/* PASSWORD */}
      <Field
        label={t('Password', 'login.form.fields.password.label')}
        errorText={errors.password}
        invalid={!!errors.password}
      >
        <Input
          type='password'
          name='password'
          value={values.password}
          onChange={handleChange}
          autoComplete='current-password'
        />
      </Field>

      <HStack w='full' justifyContent='space-between' mt='1'>
        <Checkbox checked={isRemembered} onCheckedChange={toggleRemember} size='sm' fontSize='xs'>
          {t('Remember me', 'login.rememberMeLabel')}
        </Checkbox>
        <Link color='blue.500' href='/forgot-password' fontSize='sm'>
          {t('Forgot your password?', 'login.linkToForgotPassword')}
        </Link>
      </HStack>

      <Button w='full' onClick={handleSubmit} loading={loading} fontWeight='bold' mt='5'>
        {t('Sign In', 'login.form.submit')}
      </Button>

      <Link color='blue.500' href='/register' fontSize='sm'>
        {t("Don't have an account? Sign up", 'login.linkToRegister')}
      </Link>

      <FormAlternativeMethods />
    </FormContainer>
  );
}
