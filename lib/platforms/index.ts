import type { Platform } from '@/types/live';
import type { PlatformClient } from './base';
import { DouyuClient } from './douyu';

export function getPlatformClient(platform: Platform): PlatformClient {
  switch (platform) {
    case 'douyu':
      return new DouyuClient();
    case 'huya':
      throw new Error('Huya client not implemented yet');
    case 'bilibili':
      throw new Error('Bilibili client not implemented yet');
    case 'netease':
      throw new Error('Netease client not implemented yet');
    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
}

export { PlatformClient } from './base';
