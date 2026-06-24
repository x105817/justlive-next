import type { LiveRoom, RoomDetail, PlayUrl, Platform } from '@/types/live';

export abstract class PlatformClient {
  abstract platform: Platform;

  abstract getRecommend(page: number, size: number): Promise<LiveRoom[]>;

  abstract getRoomDetail(roomId: string): Promise<RoomDetail>;

  abstract getPlayUrls(roomId: string): Promise<PlayUrl[]>;

  abstract search(keyword: string, onlyLive: boolean): Promise<LiveRoom[]>;

  protected async fetchJSON<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
