import translations from '@/features/auth/i18n';
import useTranslations from '@/features/common/hooks/useTranslations';
import { List } from '@chakra-ui/react';
import { LuCircleCheck, LuCircleDashed } from 'react-icons/lu';

interface PasswordRequirementsProps {
  show: boolean;
  password: string;
}

const scope = ['auth', 'passwordRequirements'];
export type RequirementKey = NestedValue<typeof translations, typeof scope>;

// PASSWORD REQUIREMENTS
export const passwordRequirements = [
  {
    text: 'At least 8 characters',
    key: 'length',
    test: (pw: string) => pw.length >= 8,
  },
  {
    text: 'At least one lowercase and one uppercase letter',
    key: 'case',
    test: (pw: string) => /[a-z]/.test(pw) && /[A-Z]/.test(pw),
  },
  {
    text: 'At least one number',
    key: 'number',
    test: (pw: string) => /\d/.test(pw),
  },
  {
    text: 'At least one special character',
    key: 'special',
    test: (pw: string) => /[!@#$%^&*.]/.test(pw),
  },
];

function FormPasswordRequirements({ show, password }: PasswordRequirementsProps) {
  const { t } = useTranslations(translations, ...scope);

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
            key={index}
            mt={index === 0 ? '2' : '0'}
            fontSize='smaller'
          >
            <List.Indicator asChild>
              {isValid ? <LuCircleCheck /> : <LuCircleDashed />}
            </List.Indicator>
            {t(req.text, req.key as RequirementKey)}
          </List.Item>
        );
      })}
    </List.Root>
  );
}

export default FormPasswordRequirements;
