export function formatNumber(num: number): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  }
  return num.toString();
}

export function getPlatformName(platform: string): string {
  const names: Record<string, string> = {
    douyu: '斗鱼',
    huya: '虎牙',
    bilibili: 'B站',
    netease: '网易CC',
  };
  return names[platform] || platform;
}
