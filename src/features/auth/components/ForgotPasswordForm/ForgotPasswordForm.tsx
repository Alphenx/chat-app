'use client';

import { Field, Link } from '@/components';
import { sendResetPasswordEmail } from '@/features/auth/actions/auth.actions';
import { FormContainer, FormFeedback, FormTitle } from '@/features/auth/components/common';
import { Feedback } from '@/features/auth/components/common/FormFeedback';
import { useForm } from '@/features/common/hooks';
import { extractText } from '@/features/common/utils';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Button, Input } from '@chakra-ui/react';
import { useState } from 'react';

interface ForgotPasswordFormValues {
  email: string;
}

function ForgotPasswordForm() {
  const { t } = useTranslations('auth', 'forgotPassword', 'forgot');
  const [feedback, setFeedback] = useState<Feedback>(null);

  const { values, errors, loading, handleChange, handleSubmit } = useForm<ForgotPasswordFormValues>(
    { initialValues: { email: '' }, onSubmit }
  );

  async function onSubmit(values: ForgotPasswordFormValues) {
    const { email } = values;

    try {
      sendResetPasswordEmail(email);
      setFeedback({
        message: t('Check your email to reset your password.', 'feedback.emailVerification'),
        status: 'success',
      });
    } catch (error) {
      setFeedback({ message: (error as Error).message, status: 'error' });
    }
  }

  return (
    <FormContainer>
      <FormTitle>{t('Recover password', 'form.title')}</FormTitle>
      <FormFeedback feedback={feedback} onClose={() => setFeedback(null)} />

      <Field
        label={t('Email', 'form.fields.email.label')}
        errorText={errors.email}
        invalid={!!errors.email}
      >
        <Input
          name='email'
          value={values.email}
          onChange={handleChange}
          placeholder={extractText(t('your.email@example.com', 'form.fields.email.placeholder'))}
          autoComplete='email'
        />
      </Field>

      <Button w='full' onClick={handleSubmit} loading={loading} fontWeight='bold' mt='5'>
        {t('Send recovery link', 'form.submit')}
      </Button>

      <Link color='blue.500' href='/login' fontSize='sm' mt='3'>
        {t('Back to login', 'linkToLogin')}
      </Link>
    </FormContainer>
  );
}

export default ForgotPasswordForm;
