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
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};

export default authOptions;
