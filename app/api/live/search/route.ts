import { NextRequest, NextResponse } from 'next/server';
import { getPlatformClient } from '@/lib/platforms';
import type { Platform } from '@/types/live';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const platform = searchParams.get('platform') as Platform | null;
    const onlyLive = searchParams.get('onlyLive') !== 'false';

    if (!keyword) {
      return NextResponse.json(
        { success: false, error: 'Missing keyword parameter' },
        { status: 400 }
      );
    }

    if (platform) {
      const client = getPlatformClient(platform);
      const rooms = await client.search(keyword, onlyLive);

      return NextResponse.json({
        success: true,
        data: { rooms },
      });
    }

    // 搜索所有平台
    const platforms: Platform[] = ['douyu'];
    const results = await Promise.all(
      platforms.map(async (p) => {
        try {
          const client = getPlatformClient(p);
          return await client.search(keyword, onlyLive);
        } catch (error) {
          console.error(`Failed to search ${p}:`, error);
          return [];
        }
      })
    );

    const rooms = results.flat().sort((a, b) => b.online - a.online);

    return NextResponse.json({
      success: true,
      data: { rooms },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
