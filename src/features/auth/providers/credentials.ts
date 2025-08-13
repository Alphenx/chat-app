import { login, loginWithToken } from '@/features/auth/actions/auth.actions';
import { AuthError } from '@/features/auth/errors/auth.error';
import { wrapError } from '@/features/common/errors/try-catch';
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
    try {
      if (!credentials) {
        throw AuthError.invalidCredentials();
      }

      if (credentials.token) {
        const [user, error] = await loginWithToken(credentials.token);
        if (error) throw new AuthError(error);
        return user;
      }

      const [user, error] = await login(credentials.email, credentials.password);
      if (error) throw new AuthError(error);

      return user;
    } catch (error) {
      if (error instanceof AuthError) {
        throw new Error(JSON.stringify(error.toPlain()));
      }
      throw new Error(JSON.stringify(wrapError(error)));
    }
  },
});
