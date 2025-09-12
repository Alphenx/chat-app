import type { BoxProps, InputElementProps } from '@chakra-ui/react';
import { Group, InputElement } from '@chakra-ui/react';
import { Children, ReactElement, ReactNode, Ref, cloneElement } from 'react';

export interface InputGroupProps extends BoxProps {
  startElementProps?: InputElementProps;
  endElementProps?: InputElementProps;
  startElement?: ReactNode;
  endElement?: ReactNode;
  children: ReactElement<InputElementProps>;
  startOffset?: InputElementProps['paddingStart'];
  endOffset?: InputElementProps['paddingEnd'];
  ref?: Ref<HTMLDivElement>;
}

function InputGroup({
  ref,
  startElement,
  startElementProps,
  endElement,
  endElementProps,
  children,
  startOffset = '6px',
  endOffset = '6px',
  ...rest
}: InputGroupProps) {
  const child = Children.only<ReactElement<InputElementProps>>(children);

  return (
    <Group ref={ref} {...rest}>
      {startElement && (
        <InputElement pointerEvents='none' {...startElementProps}>
          {startElement}
        </InputElement>
      )}
      {cloneElement(child, {
        ...(startElement && {
          ps: `calc(var(--input-height) - ${startOffset})`,
        }),
        ...(endElement && { pe: `calc(var(--input-height) - ${endOffset})` }),
        ...children.props,
      })}
      {endElement && (
        <InputElement placement='end' {...endElementProps}>
          {endElement}
        </InputElement>
      )}
    </Group>
  );
}

export default InputGroup;
