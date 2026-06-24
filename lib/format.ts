export function formatNumber(num: string | number): string {
  // 如果已经是格式化后的字符串（包含"万"），直接返回
  if (typeof num === 'string' && num.includes('万')) {
    return num;
  }

  // 转换为数字
  const value = typeof num === 'number' ? num : parseInt(num) || 0;

  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  return value.toString();
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
