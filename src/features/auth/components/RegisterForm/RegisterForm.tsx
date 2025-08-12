'use client';

import { Field, Link } from '@/components';
import { register } from '@/features/auth/actions/auth.actions';
import {
  Feedback,
  FormAlternativeMethods,
  FormContainer,
  FormFeedback,
  FormPasswordRequirements,
  FormTitle,
} from '@/features/auth/components/common';
import { useForm } from '@/features/common/hooks';
import { extractText } from '@/features/common/utils/string/extract-text-from-node';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Box, Button, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { validateRegisterForm } from './validations';

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const { t } = useTranslations('auth', 'register');
  const [showRequirements, setShowRequirements] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const { values, errors, loading, handleChange, handleSubmit, resetForm } =
    useForm<RegisterFormValues>({
      initialValues: { name: '', email: '', password: '', confirmPassword: '' },
      validate: (values) => validateRegisterForm(values, t),
      onSubmit,
    });

  async function onSubmit(values: RegisterFormValues) {
    const { name, email, password } = values;
    try {
      await register({ name, email, password });
      resetForm();

      setFeedback({
        message: t('Check your email to verify your account.', 'feedback.emailVerification'),
        status: 'success',
      });
    } catch (error) {
      setFeedback({ message: (error as Error).message, status: 'error' });
    }
  }

  return (
    <FormContainer>
      <FormTitle>{t('Sign Up', 'form.title')}</FormTitle>

      <FormFeedback feedback={feedback} onClose={() => setFeedback(null)} />

      {/* NAME */}
      <Field
        label={t('Name', 'form.fields.name.label')}
        errorText={errors.name}
        invalid={!!errors.name}
      >
        <Input
          size='sm'
          name='name'
          value={values.name}
          onChange={handleChange}
          placeholder={extractText(t('Your name', 'form.fields.name.placeholder'))}
        />
      </Field>

      {/* EMAIL */}
      <Field
        label={t('Email', 'form.fields.email.label')}
        errorText={errors.email}
        invalid={!!errors.email}
      >
        <Input
          size='sm'
          name='email'
          value={values.email}
          onChange={handleChange}
          placeholder={extractText(t('you@example.com', 'form.fields.email.placeholder'))}
        />
      </Field>

      {/* PASSWORD */}
      <Box w='full'>
        <Field
          label={t('Password', 'form.fields.password.label')}
          errorText={errors.password}
          invalid={!!errors.password}
        >
          <Input
            size='sm'
            type='password'
            name='password'
            value={values.password}
            onChange={handleChange}
            onFocus={() => setShowRequirements(true)}
            onBlur={() => setShowRequirements(false)}
          />
        </Field>
        <FormPasswordRequirements show={showRequirements} password={values.password} />
      </Box>

      {/* CONFIRM PASSWORD */}
      <Field
        label={t('Confirm Password', 'form.fields.confirmPassword.label')}
        errorText={errors.confirmPassword}
        invalid={!!errors.confirmPassword}
      >
        <Input
          size='sm'
          type='password'
          name='confirmPassword'
          value={values.confirmPassword}
          onChange={handleChange}
        />
      </Field>

      <Button w='full' onClick={handleSubmit} loading={loading} fontWeight='bold' mt='3'>
        {t('Sign Up', 'form.submit')}
      </Button>

      <Link color='blue.500' href='/login' fontSize='sm'>
        {t('You already have an account?', 'linkToLogin')}
      </Link>

      <FormAlternativeMethods />
    </FormContainer>
  );
}
