import { Flex, Spinner } from '@chakra-ui/react';

function Loading() {
  return (
    <Flex width='100vw' height='100vh' align='center' justify='center'>
      <Spinner size='xl' color='blue.500' borderWidth='4px' />
    </Flex>
  );
}

export default Loading;
