import { PlatformClient } from './base';
import type { LiveRoom, RoomDetail, PlayUrl } from '@/types/live';

export class DouyuClient extends PlatformClient {
  platform = 'douyu' as const;

  async getRecommend(page: number, size: number): Promise<LiveRoom[]> {
    const offset = (page - 1) * size;
    const url = `https://www.douyu.com/japi/weblist/api/getRecList?page=${page}&type=yz`;

    const data = await this.fetchJSON<any>(url);
    const list = data.data?.rl || [];

    return list.slice(0, size).map((item: any) => ({
      roomId: item.rid,
      platform: this.platform,
      title: item.rn,
      owner: {
        name: item.nn,
        avatar: item.av,
      },
      cover: item.rs16,
      online: parseInt(item.ol),
      category: item.c2name,
      isLive: item.isLive === 1,
    }));
  }

  async getRoomDetail(roomId: string): Promise<RoomDetail> {
    const url = `https://www.douyu.com/betard/${roomId}`;
    const data = await this.fetchJSON<any>(url);
    const room = data.room;

    return {
      roomId: room.room_id,
      platform: this.platform,
      title: room.room_name,
      owner: {
        name: room.owner_name,
        avatar: room.avatar,
      },
      cover: room.room_pic,
      online: parseInt(room.room_biz_all?.hot || '0'),
      category: room.second_lvl_name,
      isLive: room.show_status === 1,
      description: room.show_details,
      playUrls: await this.getPlayUrls(roomId),
    };
  }

  async getPlayUrls(roomId: string): Promise<PlayUrl[]> {
    // 简化实现：返回 HLS 流
    return [
      {
        quality: '超清',
        url: `https://www.douyu.com/${roomId}`,
        bitrate: 4000,
      },
    ];
  }

  async search(keyword: string, onlyLive: boolean): Promise<LiveRoom[]> {
    const url = `https://www.douyu.com/japi/search/api/searchShow?kw=${encodeURIComponent(keyword)}&page=1&pageSize=20`;

    const data = await this.fetchJSON<any>(url);
    const list = data.data?.relateShow || [];

    return list
      .filter((item: any) => !onlyLive || item.isLive === 1)
      .map((item: any) => ({
        roomId: item.rid,
        platform: this.platform,
        title: item.roomName,
        owner: {
          name: item.nickName,
          avatar: item.avatar,
        },
        cover: item.roomSrc,
        online: parseInt(item.hot || '0'),
        category: item.cateName,
        isLive: item.isLive === 1,
      }));
  }
}
