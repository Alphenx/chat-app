'use client';

import { Checkbox, Field, Link } from '@/components';
import {
  FormAlternativeMethods,
  FormContainer,
  FormFeedback,
  FormTitle,
} from '@/features/auth/components/common';
import { Feedback } from '@/features/auth/components/common/FormFeedback';
import { useForm } from '@/features/common/hooks';
import { extractText } from '@/features/common/utils';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Button, HStack, Input } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { t } = useTranslations('auth', 'login');
  const [feedback, setFeedback] = useQueryErrorFeedback();
  const { email, isRemembered, toggleRemember, handleRemember } = useRememberEmail();

  const { values, errors, loading, handleChange, handleSubmit } = useForm<LoginFormValues>({
    initialValues: { email, password: '' },
    onSubmit,
  });

  async function onSubmit(values: LoginFormValues) {
    handleRemember(values.email);

    await signIn('credentials', {
      email: values.email,
      password: values.password,
      callbackUrl: '/dashboard',
    });
  }

  return (
    <FormContainer>
      <FormTitle>{t('Sign Up', 'form.title')}</FormTitle>

      <FormFeedback feedback={feedback} onClose={() => setFeedback(null)} />

      {/* EMAIL */}
      <Field
        label={t('Email', 'form.fields.email.label')}
        errorText={errors.email}
        invalid={!!errors.email}
      >
        <Input
          name='email'
          value={values.email}
          onChange={handleChange}
          placeholder={extractText(t('you@example.com', 'form.fields.email.placeholder'))}
          autoComplete='email'
        />
      </Field>

      {/* PASSWORD */}
      <Field
        label={t('Password', 'form.fields.password.label')}
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
          {t('Remember me', 'rememberMeLabel')}
        </Checkbox>
        <Link color='blue.500' href='/forgot-password' fontSize='sm'>
          {t('Forgot your password?', 'linkToForgotPassword')}
        </Link>
      </HStack>

      <Button w='full' onClick={handleSubmit} loading={loading} fontWeight='bold' mt='5'>
        {t('Sign In', 'form.submit')}
      </Button>

      <Link color='blue.500' href='/register' fontSize='sm'>
        {t("Don't have an account? Sign up", 'linkToRegister')}
      </Link>

      <FormAlternativeMethods />
    </FormContainer>
  );
}

function useRememberEmail() {
  const email = localStorage.getItem('email') || '';
  const [isRemembered, setIsRemembered] = useState<boolean>(!!email);

  const toggleRemember = () => setIsRemembered((prev) => !prev);

  const handleRemember = (emailToSave: string) => {
    if (isRemembered && emailToSave) {
      localStorage.setItem('email', emailToSave);
    } else if (email) {
      localStorage.removeItem('email');
    }
  };

  return { email, isRemembered, toggleRemember, handleRemember };
}

function useQueryErrorFeedback(): [
  Feedback | null,
  React.Dispatch<React.SetStateAction<Feedback | null>>,
] {
  const searchParams = useSearchParams();
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const queryError = searchParams.get('error');
    if (queryError) {
      setFeedback({ message: queryError, status: 'error' });
    }
  }, [searchParams]);

  return [feedback, setFeedback];
}
