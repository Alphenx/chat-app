import { RESET_PASSWORD_TTL, VERIFICATION_TOKEN_TTL } from '@/features/auth/utils/constants';
import { decryptToken, encryptToken, verifyPassword } from '@/features/auth/utils/encryption';
import UserRepository from '@/features/user/repositories/user.repository';

class AuthRepository extends UserRepository<PrivateUser> {
  constructor(db: Database) {
    super(db);
    this.key = {
      ...this.key,
      verificationToken: (id: UserId) => `verification_token:${id}`,
      resetToken: (id: UserId) => `reset_token:${id}`,
    };
  }

  async checkPassword(id: UserId, password: string): Promise<boolean> {
    const user = await this.getValue<PrivateUser>(this.key.user(id));
    return user ? ((await verifyPassword(password, user.password)) ?? false) : false;
  }

  async checkEmailVerified(id: UserId): Promise<boolean> {
    const user = await this.getValue<PrivateUser>(this.key.user(id));
    return user?.emailVerified ?? false;
  }

  private async generateToken(
    id: UserId,
    email: string,
    ttl: number,
    keyFn: (id: UserId) => string
  ): Promise<string | null> {
    const expiration = Math.floor(Date.now() / 1000) + ttl;
    const encryptedToken = encryptToken(id, email, expiration);

    if (!encryptedToken) return null;

    return (await this.setValue(keyFn(id), encryptedToken, expiration)) ? encryptedToken : null;
  }

  async generateVerificationToken(id: UserId, email: string): Promise<string | null> {
    return this.generateToken(id, email, VERIFICATION_TOKEN_TTL, this.key.verificationToken);
  }

  async generateResetToken(id: UserId, email: string): Promise<string | null> {
    return this.generateToken(id, email, RESET_PASSWORD_TTL, this.key.resetToken);
  }

  private async decodeAndValidateToken(
    token: string,
    keyFn: (id: UserId) => string
  ): Promise<Token | null> {
    if (!token) return null;
    const decryptedToken = decryptToken(token);
    if (!decryptedToken) return null;

    const { id, email, exp } = decryptedToken;
    if (exp < Math.floor(Date.now() / 1000)) return null;

    const [userExists, tokenExists] = await Promise.all([
      this.userExists(id),
      this.exists(keyFn(id)),
    ]);

    return userExists && tokenExists ? { id, email, exp } : null;
  }

  async getDecodedToken(token: string): Promise<Token | null> {
    return this.decodeAndValidateToken(token, this.key.verificationToken);
  }

  async getDecodedResetToken(token: string): Promise<Token | null> {
    return this.decodeAndValidateToken(token, this.key.resetToken);
  }

  async removeVerificationToken(id: UserId): Promise<boolean> {
    return this.delete(this.key.verificationToken(id));
  }

  async removeResetToken(id: UserId): Promise<boolean> {
    return this.delete(this.key.resetToken(id));
  }
}

export default AuthRepository;
