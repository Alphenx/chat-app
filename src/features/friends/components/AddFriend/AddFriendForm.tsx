'use client';

import { Field } from '@/components';
import { Feedback } from '@/features/auth/components/common/FormFeedback';
import { useForm } from '@/features/common/hooks';
import { extractText } from '@/features/common/utils/string/extract-text-from-node';
import { Button, Input, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';

type FormValues = { email: string };

type TranslatorFn = { t: TranslatorOf<'friends', ['friendsRequestList', 'actions', 'sendFriendRequest']> };

type AddFriendFormProps = TranslatorFn & {
  onConfirm: (email: string) => Promise<void>;
};

function AddFriendForm({ onConfirm, t }: AddFriendFormProps) {
  const [feedback, setFeedback] = useState<Feedback>(null);

  const { values, errors, loading, handleChange, handleSubmit } = useForm<FormValues>({
    initialValues: { email: '' },
    validate: (values) => validateEmail(values, { t }),
    onSubmit,
  });

  async function onSubmit(values: FormValues) {
    setFeedback(null);
    await onConfirm(values.email)
      .then(() => {
        setFeedback({
          message: t('Friend request has been sent successfully.', 'feedback.success'),
          status: 'success',
        });
      })
      .catch((error) => {
        setFeedback({ status: 'error', message: error.message });
      });
  }

  return (
    <Stack as='form' onSubmit={handleSubmit} gap='4'>
      <Field label={t('Email', 'form.label')} errorText={errors.email} invalid={!!errors.email}>
        <Input
          name='email'
          autoComplete='email'
          value={values.email}
          onChange={handleChange}
          placeholder={extractText(t('Enter the email of the user you want to add', 'form.placeholder'))}
        />
      </Field>
      {feedback && (
        <Text color={feedback.status === 'success' ? 'green.500' : 'red.500'} fontSize='sm'>
          {feedback.message}
        </Text>
      )}
      <Button type='submit' loading={loading} w='full'>
        {t('Send Request', 'form.btnLabel')}
      </Button>
    </Stack>
  );
}

export default AddFriendForm;

function validateEmail({ email }: FormValues, { t }: TranslatorFn) {
  if (!email?.trim()) return { email: t('Email is required', 'form.errors.email.required') };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { email: t('Invalid email format', 'form.errors.email.invalid') };
  }
  return {};
}
