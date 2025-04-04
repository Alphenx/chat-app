import CloseButton from '@/components/CloseButton/CloseButton';
import { AlertRootProps, Box, Alert as ChakraAlert } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface AlertProps extends AlertRootProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  hideIcon?: boolean;
  onClose?: () => void;
}

function Alert({
  title,
  description,
  status,
  variant,
  icon,
  hideIcon,
  onClose,
  ...props
}: AlertProps) {
  return (
    <ChakraAlert.Root status={status} variant={variant} {...props}>
      {!hideIcon && <ChakraAlert.Indicator>{icon}</ChakraAlert.Indicator>}
      <ChakraAlert.Title>{title}</ChakraAlert.Title>
      <ChakraAlert.Content>
        <ChakraAlert.Description>{description}</ChakraAlert.Description>
      </ChakraAlert.Content>
      {onClose && (
        <Box position='absolute' top={1.5} right={2}>
          <CloseButton onClick={onClose} />
        </Box>
      )}
    </ChakraAlert.Root>
  );
}

export default Alert;
