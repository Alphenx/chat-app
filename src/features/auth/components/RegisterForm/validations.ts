import { passwordRequirements } from '@/features/auth/components/common/FormPasswordRequirements';
import { validateForm } from '@/features/common/utils';
import { RegisterFormValues } from './RegisterForm';

// REGISTER FORM VALIDATION
type TranslatorFn = TranslatorOf<'auth', ['register']>;

const rules: ValidationRule<RegisterFormValues, TranslatorFn>[] = [
  {
    field: 'name',
    label: (t) => t('Name is required', 'form.errors.name.required'),
    test: ({ name }) => !!name,
  },
  {
    field: 'email',
    label: (t) => t('Email is required', 'form.errors.email.required'),
    test: ({ email }) => !!email,
  },
  {
    field: 'email',
    label: (t) => t('Invalid email format', 'form.errors.email.invalid'),
    test: ({ email }) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  },
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

export function validateRegisterForm(form: RegisterFormValues, t: TranslatorFn) {
  return validateForm(form, rules, t);
}
