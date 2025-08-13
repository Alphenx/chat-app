'use client';

import { Box, BoxProps, useBreakpointValue } from '@chakra-ui/react';
import NextImage from 'next/image';

interface LogoProps extends BoxProps {
  showName?: boolean;
}

type ResponsiveValue<T> = { [breakpoint: string]: T };

export default function Logo({ showName = false, ...boxProps }: LogoProps) {
  const defaultSize = 150;
  const responsiveHeight = useBreakpointValue(
    (boxProps.height ?? boxProps.boxSize ?? defaultSize) as ResponsiveValue<string | number>
  );

  const size = responsiveHeight ? parseInt(responsiveHeight.toString()) : defaultSize;
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
          src='/assets/logo.svg'
          alt='Logo'
          width={logoSize}
          height={logoSize}
          style={{ objectFit: 'contain' }}
        />
      </Box>

      {showName && (
        <Box width={`${size}px`} height={`${appNameHeight}px`}>
          <NextImage
            src='/assets/app-name.svg'
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
