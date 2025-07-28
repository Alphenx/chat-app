import { getTranslations } from '@/features/i18n/utils';
import { Body, Button, Container, Heading, Link, Section, Text } from '@react-email/components';

interface VerificationEmailProps {
  verificationLink: string;
  username: string;
}

async function VerificationEmail({ verificationLink, username }: VerificationEmailProps) {
  const { t } = await getTranslations('verificationEmail');

  return {
    head: {
      from: t('ChatApp Support <support@chatapp.com>', 'head.from'),
      subject: t('Verify your email', 'head.subject'),
    },
    body: (
      <Body
        style={{
          backgroundColor: '#121212',
          padding: '2rem 0',
          fontFamily: "'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif",
        }}
      >
        <Container
          style={{
            margin: '0 auto',
            maxWidth: '600px',
            backgroundColor: '#1e1e1e',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            textAlign: 'center',
          }}
        >
          <Section style={{ margin: '1rem 0' }}>
            <Heading style={{ fontSize: '24px', color: '#ffffff', margin: '20px 0' }}>
              {t('Verify Your Email Address', 'body.title')}
            </Heading>

            <Text style={{ fontSize: '16px', color: '#b0b0b0', margin: '10px 0' }}>
              {t(
                `Hello, ${username}. Please verify your email address to continue.`,
                'body.content',
                { username }
              )}
            </Text>

            <Button
              href={verificationLink}
              style={{
                backgroundColor: '#007aff',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'inline-block',
                margin: '20px 0',
              }}
            >
              {t('Verify Email', 'body.button')}
            </Button>

            <Text style={{ fontSize: '14px', color: '#888888', marginTop: '10px' }}>
              {t(
                "If you didn't create an account, you can safely ignore this email.",
                'body.footer'
              )}
            </Text>
          </Section>

          <Section
            style={{
              borderTop: '1px solid #333',
              marginTop: '20px',
              paddingTop: '15px',
              textAlign: 'center',
            }}
          >
            <Text style={{ fontSize: '12px', color: '#666' }}>
              Made with ❤️ by{' '}
              <Link
                href='https://github.com/alphenx'
                style={{ color: '#007aff', textDecoration: 'none', fontWeight: 'bold' }}
              >
                Alphenx
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    ),
  };
}

export default VerificationEmail;
