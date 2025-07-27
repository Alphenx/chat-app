import { passwordRequirements } from '@/features/auth/components/common/FormPasswordRequirements';
import { validateForm } from '@/features/common/utils';
import { ResetPasswordFormValues } from './ResetPasswordForm';

// RESET PASSWORD FORM VALIDATION
type TranslatorFn = TranslatorOf<'auth', ['forgotPassword', 'reset']>;

const rules: ValidationRule<ResetPasswordFormValues, TranslatorFn>[] = [
  {
    field: 'password',
    label: (t) => t('Password is required', 'form.errors.password.required'),
    test: ({ password }) => !!password,
  },
  {
    field: 'password',
    label: (t) => t('Password does not meet requirements', 'form.errors.password.requirements'),
    test: ({ password }) => passwordRequirements.every((req) => req.test(password)),
  },
  {
    field: 'confirmPassword',
    label: (t) => t('Passwords do not match', 'form.errors.password.mismatch'),
    test: ({ password, confirmPassword }) => !!confirmPassword && password === confirmPassword,
  },
];

export function validateResetPasswordForm(form: ResetPasswordFormValues, t: TranslatorFn) {
  return validateForm(form, rules, t);
}
