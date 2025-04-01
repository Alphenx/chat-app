import translations from '@/features/auth/i18n';
import { passwordRequirements } from '../common/FormPasswordRequirements';
import { ResetPasswordFormValues } from './ResetPasswordForm';

// RESET PASSWORD FORM VALIDATION
type ResetPasswordKeys = ScopedKey<typeof translations, ['auth', 'forgotPassword', 'reset']>;

type ValidationRule<T, KeysScope> = {
  field: keyof T;
  text: string;
  key: TranslationKey<KeysScope>;
  test: (values: T) => boolean;
};

const rules: ValidationRule<ResetPasswordFormValues, ResetPasswordKeys>[] = [
  {
    field: 'password',
    text: 'Password is required',
    key: 'form.errors.password.required',
    test: ({ password }) => !!password,
  },
  {
    field: 'password',
    text: 'Password does not meet requirements',
    key: 'form.errors.password.requirements',
    test: ({ password }) => passwordRequirements.every((req) => req.test(password)),
  },
  {
    field: 'confirmPassword',
    text: 'Passwords do not match',
    key: 'form.errors.password.mismatch',
    test: ({ password, confirmPassword }) => !!confirmPassword && password === confirmPassword,
  },
];

export function validateResetPasswordForm(
  form: ResetPasswordFormValues,
  t: Translator<ResetPasswordKeys>
) {
  type Errors = Partial<Record<keyof ResetPasswordFormValues, string>>;

  return rules.reduce<Errors>((errors, { field, text, key, test }) => {
    if (!test(form)) {
      errors[field] = t(text, key);
    }
    return errors;
  }, {});
}
