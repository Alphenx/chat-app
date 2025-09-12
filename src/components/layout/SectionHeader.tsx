import { Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  title: ReactNode;
}

function SectionHeader({ title }: Props) {
  return (
    <Text fontSize={{ base: 'lg', smDown: 'md' }} fontWeight='semibold' mb='2'>
      {title}
    </Text>
  );
}

export default SectionHeader;
