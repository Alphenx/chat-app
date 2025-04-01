'use client';
import { Box, Button, Container, Heading, Text } from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

function Dashboard() {
  const session = useSession();
  const { user } = session.data || {};

  return (
    <Container
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      minHeight='80vh'
      textAlign='center'
    >
      <Heading as='h1' size='2xl' mb={4}>
        Welcome to ChatApp, {user?.name}!
      </Heading>
      <Text mb={2}>
        We are currently working on this page. Soon there will be new features available!
      </Text>
      <Box mt={4}>
        {user?.image && (
          <Image
            src={user.image}
            alt='User Profile Picture'
            width={100}
            height={100}
            style={{ borderRadius: '50%' }}
          />
        )}
      </Box>
      <Box mt={4}>
        <Text fontSize='md'>
          <strong>Name:</strong> {user?.name || 'N/A'}
        </Text>
        <Text fontSize='md'>
          <strong>Email:</strong> {user?.email || 'N/A'}
        </Text>
      </Box>

      {/* Sign Out Button */}
      <Box mt={4}>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </Box>
    </Container>
  );
}

export default Dashboard;
