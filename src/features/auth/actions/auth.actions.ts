'use server';

import { AuthError } from '@/features/auth/errors/auth.error';
import AuthRepository from '@/features/auth/repositories/auth.repository';
import AuthService from '@/features/auth/services/auth.service';
import { tryCatch } from '@/features/common/errors/try-catch';
import { EmailService } from '@/features/common/services/email';
import { db } from '@/lib/db/connection';

// AUTH SERVER ACTIONS
const authService = new AuthService(new AuthRepository(db), EmailService.getInstance());

export async function register(credentials: CreateUserDTO): ResultAsync<PublicUser, AuthError> {
  return await tryCatch(authService.register(credentials));
}

export async function login(email: string, password: string): ResultAsync<PublicUser, AuthError> {
  return await tryCatch(authService.login(email, password));
}

export async function loginWithToken(token: string): ResultAsync<PublicUser, AuthError> {
  return await tryCatch(authService.loginWithToken(token));
}

export async function validateEmail(token: string): ResultAsync<void, AuthError> {
  return await tryCatch(authService.validateEmailWithToken(token));
}

export async function resetPassword(
  token: string,
  newPassword: string
): ResultAsync<void, AuthError> {
  return await tryCatch(authService.resetPasswordWithToken(token, newPassword));
}

export async function sendResetPasswordEmail(email: string): ResultAsync<void, AuthError> {
  return await tryCatch(authService.sendResetPasswordEmail(email));
}
