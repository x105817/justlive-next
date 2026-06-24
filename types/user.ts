export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  createdAt: Date;
}

export interface FollowItem {
  id: string;
  platform: string;
  roomId: string;
  createdAt: Date;
}

export interface UserSettings {
  danmakuEnabled: boolean;
  danmakuFilterLevel: number;
  autoplay: boolean;
}
