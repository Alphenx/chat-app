import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider, type ThemeProviderProps } from 'next-themes';

export function StylesProvider(props: ThemeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute='class' disableTransitionOnChange {...props} />
    </ChakraProvider>
  );
}
