import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getPlatformClient } from '@/lib/platforms';
import type { Platform } from '@/types/live';
import { RoomGrid } from '@/components/live/RoomGrid';

export default async function FollowsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const follows = await prisma.follow.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  if (follows.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">我的关注</h1>
        <div className="text-center py-12 text-muted-foreground">
          还没有关注任何直播间
        </div>
      </div>
    );
  }

  // 获取所有关注房间的详情
  const rooms = await Promise.all(
    follows.map(async (follow) => {
      try {
        const client = getPlatformClient(follow.platform as Platform);
        return await client.getRoomDetail(follow.roomId);
      } catch (error) {
        console.error(`Failed to fetch room ${follow.platform}_${follow.roomId}:`, error);
        return null;
      }
    })
  );

  const validRooms = rooms.filter((room) => room !== null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">我的关注</h1>
      <RoomGrid rooms={validRooms} />
    </div>
  );
}

export const revalidate = 120; // 2 分钟缓存
