import { Field as ChakraField } from '@chakra-ui/react';
import { ReactNode, Ref } from 'react';

interface FieldProps extends Omit<ChakraField.RootProps, 'label'> {
  label?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  optionalText?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function Field({ label, children, helperText, errorText, optionalText, ref, ...rest }: FieldProps) {
  return (
    <ChakraField.Root ref={ref} {...rest}>
      {label && (
        <ChakraField.Label>
          {label}
          <ChakraField.RequiredIndicator fallback={optionalText} />
        </ChakraField.Label>
      )}
      {children}
      {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
      {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
    </ChakraField.Root>
  );
}

export default Field;
