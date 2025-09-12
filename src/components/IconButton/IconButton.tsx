import Tooltip, { TooltipProps } from '@/components/Tooltip/Tooltip';
import { extractText } from '@/features/common/utils/string/extract-text-from-node';
import { IconButton as ChakraIconButton, IconButtonProps as ChakraIconButtonProps } from '@chakra-ui/react';
import NextLink from 'next/link';
import { ReactNode } from 'react';

interface IconButtonComponentProps extends ChakraIconButtonProps {
  icon: ReactNode;
  label: ReactNode;
  href?: string;
  tooltipProps?: Omit<TooltipProps, 'content' | 'children'>;
}

function IconButton({ icon, label, tooltipProps, href, ...rest }: IconButtonComponentProps) {
  const labelText = typeof label === 'string' ? label : extractText(label);

  return (
    <Tooltip content={labelText} aria-label={labelText} {...tooltipProps}>
      <ChakraIconButton aria-label={labelText} asChild={!!href} {...rest}>
        {href ? <NextLink href={href}>{icon}</NextLink> : icon}
      </ChakraIconButton>
    </Tooltip>
  );
}

export default IconButton;
