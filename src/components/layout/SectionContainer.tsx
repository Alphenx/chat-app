import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function SectionContainer({ children }: Props) {
  return <Box mb={4}>{children}</Box>;
}

export default SectionContainer;
