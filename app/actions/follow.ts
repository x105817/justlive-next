'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function followRoom(platform: string, roomId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: '请先登录' };
  }

  try {
    await prisma.follow.create({
      data: {
        userId: session.user.id,
        platform,
        roomId,
      },
    });

    revalidatePath('/follows');
    return { success: true };
  } catch (error) {
    console.error('Follow error:', error);
    return { success: false, error: '关注失败' };
  }
}

export async function unfollowRoom(platform: string, roomId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: '请先登录' };
  }

  try {
    await prisma.follow.deleteMany({
      where: {
        userId: session.user.id,
        platform,
        roomId,
      },
    });

    revalidatePath('/follows');
    return { success: true };
  } catch (error) {
    console.error('Unfollow error:', error);
    return { success: false, error: '取消关注失败' };
  }
}

export async function checkFollowing(platform: string, roomId: string): Promise<boolean> {
  const session = await auth();

  if (!session?.user?.id) {
    return false;
  }

  try {
    const follow = await prisma.follow.findUnique({
      where: {
        userId_platform_roomId: {
          userId: session.user.id,
          platform,
          roomId,
        },
      },
    });

    return !!follow;
  } catch (error) {
    console.error('Check following error:', error);
    return false;
  }
}
