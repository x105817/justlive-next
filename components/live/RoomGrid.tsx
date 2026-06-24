import { RoomCard } from './RoomCard';
import type { LiveRoom } from '@/types/live';

interface RoomGridProps {
  rooms: LiveRoom[];
}

export function RoomGrid({ rooms }: RoomGridProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        暂无直播间
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rooms.map((room) => (
        <RoomCard key={`${room.platform}_${room.roomId}`} room={room} />
      ))}
    </div>
  );
}
