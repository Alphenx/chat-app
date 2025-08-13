import 'next-auth';

declare module 'next-auth/jwt' {
  // Extenfing JWT interface to include user id

  interface JWT {
    id: UserId;
  }
}

declare module 'next-auth' {
  // Overriding User type to include id

  interface Session {
    user: BaseUser & { id: UserId };
  }
}
