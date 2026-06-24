import { PlatformClient } from './base';
import type { LiveRoom, RoomDetail, PlayUrl } from '@/types/live';

export class DouyuClient extends PlatformClient {
  platform = 'douyu' as const;

  async getRecommend(page: number, size: number): Promise<LiveRoom[]> {
    const url = `https://m.douyu.com/api/room/list?page=${page}&type=yz`;

    const data = await this.fetchJSON<any>(url);

    if (data.code !== 0 || !data.data?.list) {
      return [];
    }

    const list = data.data.list;

    return list.slice(0, size).map((item: any) => ({
      roomId: String(item.rid),
      platform: this.platform,
      title: item.roomName,
      owner: {
        name: item.nickname,
        avatar: item.avatar,
      },
      cover: item.roomSrc,
      online: item.hn || '0',
      category: item.cate2Name || '其他',
      isLive: item.isLive === 1,
    }));
  }

  async getRoomDetail(roomId: string): Promise<RoomDetail> {
    const url = `https://www.douyu.com/betard/${roomId}`;
    const data = await this.fetchJSON<any>(url);

    if (!data.room) {
      throw new Error('房间不存在或已关闭');
    }

    const room = data.room;
    const isLive = room.show_status === 1;

    // 从 room_biz_all.hot 获取人气值，保留原始格式
    const online = room.room_biz_all?.hot || '0';

    return {
      roomId,
      platform: this.platform,
      title: room.room_name || '未知标题',
      owner: {
        name: room.owner_name || '未知主播',
        avatar: room.avatar || 'https://apic.douyucdn.cn/upload/_middle.jpg',
      },
      cover: room.room_thumb || 'https://rpic.douyucdn.cn/live-cover/appCovers/default.jpg',
      online,
      category: room.second_lvl_name || room.cate_name || '其他',
      isLive,
      description: room.show_details || '',
      playUrls: isLive ? await this.getPlayUrls(roomId) : [],
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

    if (!data.data?.relateShow) {
      return [];
    }

    const rooms = data.data.relateShow;

    return rooms
      .filter((item: any) => !onlyLive || item.isLive === 1)
      .map((item: any) => ({
        roomId: String(item.rid),
        platform: this.platform,
        title: item.roomName,
        owner: {
          name: item.nickName,
          avatar: item.avatar,
        },
        cover: item.roomSrc,
        online: item.hot || '0',
        category: item.cateName || '其他',
        isLive: item.isLive === 1,
      }));
  }
}
