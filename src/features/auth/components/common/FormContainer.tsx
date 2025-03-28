import { Container, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
}

function FormContainer({ children }: FormContainerProps) {
  return (
    <Container centerContent mb={5}>
      <VStack gap={2} maxW={{ base: '100%', sm: '400px' }} w='full' as='form'>
        {children}
      </VStack>
    </Container>
  );
}

export default FormContainer;
