import { Link } from '@/components';
import { Center, Text } from '@chakra-ui/react';

function AuthorFooter() {
  return (
    <Center py='1.5' mt='10' bgColor='gray.900' borderRadius='md'>
      <Text fontSize='xs' color='gray.500'>
        Made with ❤️ by <Link href='https://github.com/alphenx'>Alphenx</Link>
      </Text>
    </Center>
  );
}

export default AuthorFooter;
