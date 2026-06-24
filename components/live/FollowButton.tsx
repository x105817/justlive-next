'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { followRoom, unfollowRoom } from '@/app/actions/follow';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
  platform: string;
  roomId: string;
  initialFollowing: boolean;
}

export function FollowButton({ platform, roomId, initialFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsLoading(true);

    try {
      if (isFollowing) {
        const result = await unfollowRoom(platform, roomId);
        if (result.success) {
          setIsFollowing(false);
        } else if (result.error === '请先登录') {
          router.push('/login');
        }
      } else {
        const result = await followRoom(platform, roomId);
        if (result.success) {
          setIsFollowing(true);
        } else if (result.error === '请先登录') {
          router.push('/login');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={isLoading}
      variant={isFollowing ? 'outline' : 'default'}
    >
      {isLoading ? '处理中...' : isFollowing ? '已关注' : '关注'}
    </Button>
  );
}
