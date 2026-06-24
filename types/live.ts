export type Platform = 'douyu' | 'huya' | 'bilibili' | 'netease';

export interface LiveRoom {
  roomId: string;
  platform: Platform;
  title: string;
  owner: {
    name: string;
    avatar: string;
  };
  cover: string;
  online: number;
  category: string;
  isLive: boolean;
}

export interface PlayUrl {
  quality: string;
  url: string;
  bitrate?: number;
}

export interface DanmakuMessage {
  type: 'danmaku' | 'gift' | 'enter';
  user: string;
  content: string;
  timestamp: number;
  level?: number;
}

export interface RoomDetail extends LiveRoom {
  description?: string;
  playUrls: PlayUrl[];
  tags?: string[];
}
