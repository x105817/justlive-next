import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LiveRoom } from '@/types/live';
import { formatNumber, getPlatformName } from '@/lib/format';

interface RoomCardProps {
  room: LiveRoom;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/room/${room.platform}_${room.roomId}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative aspect-video">
          <Image
            src={room.cover}
            alt={room.title}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge variant="destructive">
              {formatNumber(room.online)} 在线
            </Badge>
            {room.isLive && (
              <Badge className="bg-green-500">直播中</Badge>
            )}
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary">
              {getPlatformName(room.platform)}
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm line-clamp-2 h-10">
            {room.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p className="truncate">{room.owner.name}</p>
          <p className="truncate text-xs">{room.category}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
