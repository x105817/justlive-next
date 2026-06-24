import { Suspense } from 'react';
import { RoomGrid } from '@/components/live/RoomGrid';
import { RoomListSkeleton } from '@/components/live/RoomListSkeleton';
import { getPlatformClient } from '@/lib/platforms';

async function RecommendRooms() {
  try {
    const client = getPlatformClient('douyu');
    const rooms = await client.getRecommend(1, 20);
    return <RoomGrid rooms={rooms} />;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    return <div className="text-center py-12 text-red-500">加载失败，请刷新重试</div>;
  }
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">推荐直播</h1>
      <Suspense fallback={<RoomListSkeleton />}>
        <RecommendRooms />
      </Suspense>
    </div>
  );
}

export const revalidate = 300; // 5 分钟缓存
