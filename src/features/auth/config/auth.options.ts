import CredentialsProvider from '@/features/auth/providers/credentials';
import GoogleProvider from '@/features/auth/providers/google';
import { db } from '@/lib/db/connection';
import { NextAuthOptions } from 'next-auth';
import CustomRedisAdapter from './adapter';

const authOptions: NextAuthOptions = {
  adapter: CustomRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [GoogleProvider, CredentialsProvider],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        Object.assign(token, {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.image,
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        Object.assign(session.user, {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
        });
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};

export default authOptions;
