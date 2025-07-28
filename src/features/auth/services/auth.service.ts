import { AuthError } from '@/features/auth/errors/auth.error';
import AuthRepository from '@/features/auth/repositories/auth.repository';
import { hashPassword } from '@/features/auth/utils/encryption';
import type EmailService from '@/features/common/services/email/email.service';
import ResetPasswordEmail from '@/features/common/services/email/templates/reset-password/reset-password';
import VerificationEmail from '@/features/common/services/email/templates/verification/email-verification';
import { CatchAll, extractText } from '@/features/common/utils';

@CatchAll(async () => await AuthError.defaultError())
export class AuthService {
  constructor(
    private store: AuthRepository,
    private emailService?: EmailService
  ) {}

  async login(email: string, password: string): Promise<PublicUser> {
    const user = await this.store.findByEmail(email);
    if (!user) throw await AuthError.invalidCredentials();

    const isPasswordValid = await this.store.checkPassword(user.id, password);
    if (!isPasswordValid) throw await AuthError.invalidCredentials();

    const emailVerified = await this.store.checkEmailVerified(user.id);
    if (!emailVerified) throw await AuthError.emailNotValidated();

    return user;
  }

  async loginWithToken(token: string): Promise<PublicUser> {
    const decodedToken = await this.store.getDecodedToken(token);
    if (!decodedToken) throw await AuthError.invalidToken();

    await this.validateAccountById(decodedToken.id);

    const user = await this.store.findById(decodedToken.id);
    if (!user) throw await AuthError.userNotFound();

    return user;
  }

  async register(userData: CreateUserDTO): Promise<PublicUser> {
    if (await this.store.emailExists(userData.email)) throw await AuthError.userAlreadyExists();
    const internalUser = userData as CreateInternalUserDTO;

    if (internalUser.password) {
      const encryptedPassword = await hashPassword(internalUser.password);
      if (!encryptedPassword) throw await AuthError.defaultError();
      internalUser.password = encryptedPassword;
    }

    const user = await this.store.create(userData);
    if (!user) throw await AuthError.defaultError();

    const token = await this.store.generateVerificationToken(user.id, user.email);
    if (!token) {
      await this.store.deleteAccount(user.id);
      throw await AuthError.defaultError();
    }

    await this.sendVerificationEmail(user.name, user.email, token);
    return user;
  }

  async changePassword(id: UserId, newPassword: string): Promise<void> {
    if (!(await this.store.userExists(id))) throw await AuthError.userNotFound();

    const password = await hashPassword(newPassword);
    if (!(await this.store.update(id, { password } as UpdateUserDTO))) {
      throw await AuthError.defaultError();
    }
  }

  async resetPasswordWithToken(token: string, newPassword: string): Promise<void> {
    const decodedToken = await this.store.getDecodedResetToken(token);
    if (!decodedToken) throw await AuthError.invalidToken();

    const { id } = decodedToken;

    await this.changePassword(id, newPassword);
    await this.store.removeResetToken(id);
  }

  async validateAccountById(id: UserId): Promise<void> {
    if (!(await this.store.userExists(id))) throw await AuthError.userNotFound();

    if (!(await this.store.update(id, { emailVerified: true }))) {
      throw await AuthError.defaultError();
    }

    await this.store.removeVerificationToken(id);
  }

  async sendVerificationEmail(name: string, email: string, token: string): Promise<void> {
    if (!this.emailService) throw await AuthError.defaultError();

    const component = await VerificationEmail({
      verificationLink: `${process.env.NEXT_PUBLIC_VERCEL_URL}/login?token=${token}`,
      username: name,
    });

    await this.emailService.sendMail({
      body: component.body,
      from: extractText(component.head.from),
      subject: extractText(component.head.subject),
      to: email,
    });
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    if (!this.emailService) throw await AuthError.defaultError();

    const user = await this.store.findByEmail(email);
    if (!user) throw await AuthError.userNotFound();

    const token = await this.store.generateResetToken(user.id, user.email);
    if (!token) throw await AuthError.defaultError();

    const component = await ResetPasswordEmail({
      resetLink: `${process.env.NEXT_PUBLIC_VERCEL_URL}/forgot-password?token=${token}`,
      username: user.name,
    });

    await this.emailService.sendMail({
      body: component.body,
      from: extractText(component.head.from),
      subject: extractText(component.head.subject),
      to: email,
    });
  }
}

export default AuthService;
