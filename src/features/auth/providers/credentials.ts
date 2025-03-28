import { login, loginWithToken } from '@/features/auth/actions/auth.actions';
import { AuthError } from '@/features/auth/errors/auth.error';
import CredentialsProvider from 'next-auth/providers/credentials';

export default CredentialsProvider({
  id: 'credentials',
  name: 'credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
    token: { label: 'Token', type: 'text' },
  },
  async authorize(credentials) {
    if (!credentials) {
      throw AuthError.invalidCredentials();
    }

    if (credentials.token) {
      return await loginWithToken(credentials.token);
    }

    return await login(credentials.email, credentials.password);
  },
});
