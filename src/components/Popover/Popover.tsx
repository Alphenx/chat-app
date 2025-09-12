import { Popover as ChakraPopover, PopoverRootProps, Portal } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface PopoverProps extends PopoverRootProps {
  trigger: ReactNode;
  autoFocus?: boolean;
  sameWidth?: boolean;
}

function Popover({
  trigger,
  autoFocus = false,
  sameWidth = true,
  children,
  ...rest
}: PopoverProps) {
  return (
    <ChakraPopover.Root autoFocus={autoFocus} positioning={{ sameWidth }} {...rest}>
      <ChakraPopover.Trigger asChild>{trigger}</ChakraPopover.Trigger>
      <Portal>
        <ChakraPopover.Positioner>
          <ChakraPopover.Content>{children}</ChakraPopover.Content>
        </ChakraPopover.Positioner>
      </Portal>
    </ChakraPopover.Root>
  );
}

export default Popover;

Popover.Header = ChakraPopover.Header;
Popover.Body = ChakraPopover.Body;
Popover.Footer = ChakraPopover.Footer;
Popover.Arrow = ChakraPopover.Arrow;
