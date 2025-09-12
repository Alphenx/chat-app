import { Box, Flex, Separator, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  title: ReactNode;
  children?: ReactNode;
}

function PageHeader({ title, children }: Props) {
  return (
    <Box as='header' mb='4'>
      <Flex justifyContent='space-between' alignItems='center'>
        <Text as='h1' fontSize={{ base: '2xl', smDown: 'xl' }} fontWeight='bold'>
          {title}
        </Text>
        {children ? children : null}
      </Flex>
      <Separator size='md' mt={4} />
    </Box>
  );
}

export default PageHeader;
