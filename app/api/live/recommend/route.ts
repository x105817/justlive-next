import { NextRequest, NextResponse } from 'next/server';
import { getPlatformClient } from '@/lib/platforms';
import type { Platform } from '@/types/live';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const size = parseInt(searchParams.get('size') || '20');
    const platform = searchParams.get('platform') as Platform | null;

    if (platform) {
      const client = getPlatformClient(platform);
      const rooms = await client.getRecommend(page, size);

      return NextResponse.json({
        success: true,
        data: {
          rooms,
          total: rooms.length,
          page,
          size,
        },
      });
    }

    // 聚合所有平台
    const platforms: Platform[] = ['douyu'];
    const results = await Promise.all(
      platforms.map(async (p) => {
        try {
          const client = getPlatformClient(p);
          return await client.getRecommend(1, 10);
        } catch (error) {
          console.error(`Failed to fetch ${p}:`, error);
          return [];
        }
      })
    );

    const rooms = results.flat().sort((a, b) => b.online - a.online).slice(0, size);

    return NextResponse.json({
      success: true,
      data: {
        rooms,
        total: rooms.length,
        page,
        size,
      },
    });
  } catch (error) {
    console.error('Recommend API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
export const revalidate = 300; // 5 分钟缓存
