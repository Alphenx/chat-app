import authOptions from '@/features/auth/config/auth.options';
import { getServerSession } from 'next-auth';

export async function getSession() {
  return await getServerSession(authOptions);
}
