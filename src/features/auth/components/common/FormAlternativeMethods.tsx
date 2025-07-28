import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Button, HStack, Separator, Text } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

function FormAlternativeMethods() {
  return (
    <>
      <Divider />
      <SignInWithGoogle />
    </>
  );
}

export default FormAlternativeMethods;

// GOOGLE
function SignInWithGoogle() {
  const { t } = useTranslations('auth', 'alternativeMethods');

  async function onClick() {
    await signIn('google', { callbackUrl: '/dashboard' });
  }

  return (
    <>
      <Button w='full' onClick={onClick} variant='outline' fontWeight='bold'>
        <FaGoogle /> {t('Continue with Google', 'google')}
      </Button>
    </>
  );
}

function Divider() {
  return (
    <HStack w='full' alignItems='center' mt='2'>
      <Separator flex='1' />
      <Text fontSize='xs' flexShrink='0'>
        Or
      </Text>
      <Separator flex='1' />
    </HStack>
  );
}
