import { Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface FormTitleProps {
  children: ReactNode;
}

function FormTitle({ children }: FormTitleProps) {
  return (
    <Text fontSize='lg' fontWeight='semibold'>
      {children}
    </Text>
  );
}

export default FormTitle;
