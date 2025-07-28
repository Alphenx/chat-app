'use server';

import { authOptions } from '@/features/auth/config';
import AuthRepository from '@/features/auth/repositories/auth.repository';
import AuthService from '@/features/auth/services/auth.service';
import { EmailService } from '@/features/common/services/email';
import { db } from '@/lib/db/connection';
import { getServerSession } from 'next-auth';
import nodemailer from 'nodemailer';

// AUTH SERVER ACTIONS
const authService = new AuthService(
  new AuthRepository(db),
  new EmailService(nodemailer.createTransport)
);

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function register(credentials: CreateUserDTO) {
  return await authService.register(credentials);
}

export async function login(email: string, password: string) {
  return await authService.login(email, password);
}

export async function loginWithToken(token: string) {
  return await authService.loginWithToken(token);
}

export async function validateEmail(token: string) {
  return await authService.validateAccountById(token);
}

export async function resetPassword(token: string, newPassword: string) {
  return await authService.resetPasswordWithToken(token, newPassword);
}

export async function sendResetPasswordEmail(email: string) {
  return await authService.sendResetPasswordEmail(email);
}
