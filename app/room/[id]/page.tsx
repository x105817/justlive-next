import { notFound } from 'next/navigation';
import { getPlatformClient } from '@/lib/platforms';
import type { Platform } from '@/types/live';
import { Badge } from '@/components/ui/badge';
import { formatNumber, getPlatformName } from '@/lib/format';

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;
  const [platform, roomId] = id.split('_') as [Platform, string];

  if (!platform || !roomId) {
    notFound();
  }

  try {
    const client = getPlatformClient(platform);
    const room = await client.getRoomDetail(roomId);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 播放器占位 */}
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <div className="text-white text-center space-y-4">
              <p className="text-xl">播放器功能开发中</p>
              <p className="text-sm text-gray-400">
                房间 ID: {roomId} | 平台: {getPlatformName(platform)}
              </p>
            </div>
          </div>

          {/* 直播间信息 */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <h1 className="text-2xl font-bold">{room.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{room.owner.name}</span>
                  <span>•</span>
                  <span>{room.category}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge variant="destructive">
                  {formatNumber(room.online)} 在线
                </Badge>
                {room.isLive && (
                  <Badge className="bg-green-500">直播中</Badge>
                )}
                <Badge variant="secondary">
                  {getPlatformName(room.platform)}
                </Badge>
              </div>
            </div>

            {room.description && (
              <p className="text-sm text-muted-foreground">{room.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to load room:', error);
    notFound();
  }
}

export const revalidate = 60; // 1 分钟缓存
