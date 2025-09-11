import { Dialog as ChakraDialog, CloseButton, Portal } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface ModalProps extends Omit<ChakraDialog.RootProps, 'children'> {
  title?: ReactNode;
  trigger?: ReactNode;
  closeTrigger?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  disableClose?: boolean;
  children?: ReactNode;
}

function Modal({
  title,
  trigger,
  closeTrigger,
  body,
  disableClose = false,
  footer,
  unmountOnExit = true,
  ...rest
}: ModalProps) {
  return (
    <ChakraDialog.Root
      {...rest}
      closeOnEscape={!disableClose}
      closeOnInteractOutside={!disableClose}
      unmountOnExit={unmountOnExit}
    >
      {trigger && <ChakraDialog.Trigger asChild>{trigger}</ChakraDialog.Trigger>}
      <Portal>
        <ChakraDialog.Backdrop />

        <ChakraDialog.Positioner>
          <ChakraDialog.Content>
            <ChakraDialog.Header justifyContent='space-between' display='flex' alignItems='center'>
              <ChakraDialog.Title>{title}</ChakraDialog.Title>
            </ChakraDialog.Header>

            {body && <ChakraDialog.Body>{body}</ChakraDialog.Body>}

            {footer && <ChakraDialog.Footer>{footer}</ChakraDialog.Footer>}

            {!disableClose && (
              <ChakraDialog.CloseTrigger asChild>
                {closeTrigger ?? <CloseButton size='sm' />}
              </ChakraDialog.CloseTrigger>
            )}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    </ChakraDialog.Root>
  );
}

export default Modal;
