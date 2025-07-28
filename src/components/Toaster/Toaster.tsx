import {
  Toast as ChakraToast,
  Toaster as ChakraToaster,
  createToaster,
  Portal,
  Spinner,
  Stack,
} from '@chakra-ui/react';

interface ToasterProps {
  toaster: ReturnType<typeof createToaster>;
}

function Toaster({ toaster }: ToasterProps) {
  return (
    <Portal>
      <ChakraToaster toaster={toaster}>
        {(toast) => (
          <ChakraToast.Root width={{ md: 'sm' }}>
            {toast.type === 'loading' ? (
              <Spinner size='sm' color='blue.solid' />
            ) : (
              <ChakraToast.Indicator />
            )}
            <Stack gap='1' flex='1' maxWidth='100%'>
              {toast.title && <ChakraToast.Title>{toast.title}</ChakraToast.Title>}
              {toast.description && (
                <ChakraToast.Description>{toast.description}</ChakraToast.Description>
              )}
            </Stack>
            {toast.action && (
              <ChakraToast.ActionTrigger>{toast.action.label}</ChakraToast.ActionTrigger>
            )}
            <ChakraToast.CloseTrigger />
          </ChakraToast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
}

export default Toaster;
