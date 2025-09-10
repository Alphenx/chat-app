'use client';

import PageContainer from '@/components/layout/PageContainer';
import { AppRoute } from '@/features/common/constants/routes';
import { useTranslations } from '@/features/i18n/hooks/useTranslations';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  const { t } = useTranslations('common', 'notFound');

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
          color='teal.500'
          fontWeight='bold'
          letterSpacing='wider'
        >
          {t('404 - Page Not Found', 'title')}
        </Heading>

        <Text fontSize='md' color='fg.muted' lineHeight='tall' textAlign='center'>
          {t('Sorry, the page you are looking for does not exist or has been moved.', 'message')}
        </Text>

        <Button size='lg' variant='subtle' asChild>
          <Link href={AppRoute.HOME}>{t('Go to Home', 'button')}</Link>
        </Button>
      </Flex>
    </PageContainer>
  );
}
