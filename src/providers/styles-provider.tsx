'use client';

import { ColorModeProvider, ColorModeProviderProps } from '@/components/ColorMode';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

export function StylesProvider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
