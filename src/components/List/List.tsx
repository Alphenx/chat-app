import { Box, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface ListProps<T extends { id: string }> {
  items: T[];
  render: (item: T, index: number, items: T[]) => ReactNode;
}

function List<T>({ items, render }: ListProps<T & { id: string }>) {
  return (
    <Stack as='ul' width='100%' gap={0}>
      {items.map((item, index, items) => (
        <Box as='li' key={item.id}>
          {render(item, index, items)}
        </Box>
      ))}
    </Stack>
  );
}

export default List;
