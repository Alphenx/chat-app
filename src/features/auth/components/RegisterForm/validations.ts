import { passwordRequirements } from '@/features/auth/components/common/FormPasswordRequirements';
import translations from '@/features/auth/i18n';
import { RegisterFormValues } from './RegisterForm';

// REGISTER FORM VALIDATION
type RegisterKeys = ScopedKey<typeof translations, ['auth', 'register']>;

type ValidationRule<T, KeysScope> = {
  field: keyof T;
  text: string;
  key: TranslationKey<KeysScope>;
  test: (values: T) => boolean;
};

const rules: ValidationRule<RegisterFormValues, RegisterKeys>[] = [
  {
    field: 'name',
    text: 'Name is required',
    key: 'form.errors.name.required',
    test: ({ name }) => !!name,
  },
  {
    field: 'email',
    text: 'Email is required',
    key: 'form.errors.email.required',
    test: ({ email }) => !!email,
  },
  {
    field: 'email',
    text: 'Invalid email format',
    key: 'form.errors.email.invalid',
    test: ({ email }) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  },
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

export function validateRegisterForm(form: RegisterFormValues, t: Translator<RegisterKeys>) {
  type Errors = Partial<Record<keyof RegisterFormValues, string>>;

  return rules.reduce<Errors>((errors, { field, text, key, test }) => {
    if (!test(form)) {
      errors[field] = t(text, key);
    }
    return errors;
  }, {});
}
