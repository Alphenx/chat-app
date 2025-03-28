'use client';

import { Box, BoxProps, useBreakpointValue } from '@chakra-ui/react';
import NextImage from 'next/image';

interface LogoProps extends BoxProps {
  showName?: boolean;
}

type ResponsiveValue<T> = { [breakpoint: string]: T };

export default function Logo({ showName = false, ...boxProps }: LogoProps) {
  const currentHeight = useBreakpointValue(boxProps.height as ResponsiveValue<string>);
  const size = currentHeight ? parseInt(currentHeight) : 150;
  const appNameAspectRatio = 4;
  const appNameHeight = size / appNameAspectRatio;
  const logoSize = size * 0.4;

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      gap={2}
      {...boxProps}
    >
      <Box width={`${logoSize}px`} height={`${logoSize}px`}>
        <NextImage
          src='/logo.svg'
          alt='Logo'
          width={logoSize}
          height={logoSize}
          style={{ objectFit: 'contain' }}
        />
      </Box>

      {showName && (
        <Box width={`${size}px`} height={`${appNameHeight}px`}>
          <NextImage
            src='/app-name.svg'
            alt='App Name'
            width={size}
            height={appNameHeight}
            style={{ objectFit: 'contain' }}
          />
        </Box>
      )}
    </Box>
  );
}
