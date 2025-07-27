import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { List } from '@chakra-ui/react';
import { LuCircleCheck, LuCircleDashed } from 'react-icons/lu';

type TranslatorFn = TranslatorOf<'auth', ['passwordRequirements']>;

type RequirementRule = Omit<ValidationRule<string, TranslatorFn>, 'field'> & {
  field: 'length' | 'case' | 'number' | 'special';
};

// PASSWORD REQUIREMENTS
export const passwordRequirements: RequirementRule[] = [
  {
    field: 'length',
    label: (t) => t('At least 8 characters', 'length'),
    test: (password: string) => password.length >= 8,
  },
  {
    field: 'case',
    label: (t) => t('At least one lowercase and one uppercase letter', 'case'),
    test: (password: string) => /[a-z]/.test(password) && /[A-Z]/.test(password),
  },
  {
    field: 'number',
    label: (t) => t('At least one number', 'number'),
    test: (password: string) => /\d/.test(password),
  },
  {
    field: 'special',
    label: (t) => t('At least one special character', 'special'),
    test: (password: string) => /[!@#$%^&*.]/.test(password),
  },
];

interface PasswordRequirementsProps {
  show: boolean;
  password: string;
}

function FormPasswordRequirements({ show, password }: PasswordRequirementsProps) {
  const { t } = useTranslations('auth', 'passwordRequirements');

  return (
    <List.Root
      gap='1'
      maxHeight={show ? '150px' : '0'}
      opacity={show ? 1 : 0}
      px='3'
      transition='opacity 0.3s ease-out, max-height 0.3s ease-out'
      variant='plain'
    >
      {passwordRequirements.map((req, index) => {
        const isValid = req.test(password);
        return (
          <List.Item
            color={isValid ? 'green.500' : 'red.500'}
            key={req.field}
            mt={index === 0 ? '2' : '0'}
            fontSize='smaller'
          >
            <List.Indicator asChild>
              {isValid ? <LuCircleCheck /> : <LuCircleDashed />}
            </List.Indicator>
            {req.label(t)}
          </List.Item>
        );
      })}
    </List.Root>
  );
}

export default FormPasswordRequirements;
