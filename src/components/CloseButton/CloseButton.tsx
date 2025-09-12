import { ButtonProps as ChakraButtonProps, IconButton as ChakraIconButton } from '@chakra-ui/react';
import { LuX } from 'react-icons/lu';

interface CloseButtonProps extends ChakraButtonProps {
  ref?: React.Ref<HTMLButtonElement>;
}

function CloseButton({ ref, ...props }: CloseButtonProps) {
  return (
    <ChakraIconButton variant='ghost' aria-label='Close' ref={ref} {...props}>
      {props.children ?? <LuX />}
    </ChakraIconButton>
  );
}

export default CloseButton;
