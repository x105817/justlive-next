'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少 6 位'),
});

export type LoginState = {
  success: boolean;
  error?: string;
} | null;

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || '输入无效' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    redirect('/');
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: '邮箱或密码错误' };
    }
    throw error;
  }
}
