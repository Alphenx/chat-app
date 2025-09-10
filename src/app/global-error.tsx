'use client';

import PageContainer from '@/components/layout/PageContainer';
import { AppRoute } from '@/features/common/constants/routes';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import Link from 'next/link';

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  const { t } = useTranslations('common', 'globalError');

  return (
    <PageContainer>
      <Flex h='100%' direction='column' gap={6} justify='center' align='center' mt='5rem'>
        <Box width={{ base: '160px', smDown: '120px' }} height={{ base: '160px', smDown: '120px' }}>
          <NextImage
            src='/assets/logo.svg'
            alt='Logo'
            width={200}
            height={200}
            objectFit='contain'
          />
        </Box>

        <Heading
          as='h1'
          size={{ base: '4xl', smDown: '2xl' }}
          color='red.500'
          fontWeight='bold'
          letterSpacing='wider'
        >
          {t('Something went wrong', 'title')}
        </Heading>

        <Text fontSize='md' color='fg.muted' lineHeight='tall' textAlign='center'>
          {t('An unexpected error occurred. Please try again later.', 'message')}
        </Text>

        <Flex gap={4}>
          <Button onClick={reset} size='lg' variant='subtle'>
            {t('Try Again', 'retry')}
          </Button>
          <Button size='lg' variant='subtle' asChild>
            <Link href={AppRoute.HOME}>{t('Go to Home', 'button')}</Link>
          </Button>
        </Flex>
      </Flex>
    </PageContainer>
  );
}
