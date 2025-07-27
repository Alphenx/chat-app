'use client';

import { Field, Link } from '@/components';
import { resetPassword } from '@/features/auth/actions/auth.actions';
import {
  Feedback,
  FormContainer,
  FormFeedback,
  FormPasswordRequirements,
  FormTitle,
} from '@/features/auth/components/common';
import { useForm } from '@/features/common/hooks';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Box, Button, Input } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { validateResetPasswordForm } from './validations';

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

function ResetPasswordForm({ token }: { token: string }) {
  const { t } = useTranslations('auth', 'forgotPassword', 'reset');
  const [showRequirements, setShowRequirements] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const { values, errors, loading, handleChange, handleSubmit, resetForm } =
    useForm<ResetPasswordFormValues>({
      initialValues: { password: '', confirmPassword: '' },
      onSubmit,
      validate: (values) => validateResetPasswordForm(values, t),
    });

  async function onSubmit(values: ResetPasswordFormValues) {
    const { password } = values;

    try {
      resetPassword(token, password).then(() => setTimeout(() => redirect('/login'), 2000));
      resetForm();
      setFeedback({
        message: t('Your password has been reset successfully.', 'feedback.passwordReset'),
        status: 'success',
      });
    } catch (error) {
      setFeedback({ message: (error as Error).message, status: 'error' });
    }
  }

  return (
    <FormContainer>
      <FormTitle>{t('Reset your password', 'form.title')}</FormTitle>

      <FormFeedback feedback={feedback} onClose={() => setFeedback(null)} />

      {/* PASSWORD */}
      <Box w='full'>
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
          type='password'
          name='confirmPassword'
          value={values.confirmPassword}
          onChange={handleChange}
        />
      </Field>

      <Button w='full' onClick={handleSubmit} loading={loading} fontWeight='bold' mt='5'>
        {t('Cambiar contraseña', 'form.submit')}
      </Button>

      <Link color='blue.500' href='/login' fontSize='sm' mt='3'>
        {t('Back to login', 'linkToLogin')}
      </Link>
    </FormContainer>
  );
}

export default ResetPasswordForm;
