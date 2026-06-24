import { NextRequest, NextResponse } from 'next/server';
import { getPlatformClient } from '@/lib/platforms';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const platform = searchParams.get('platform');
    const roomId = searchParams.get('roomId');

    if (!platform || !roomId) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const client = getPlatformClient(platform as any);
    if (!client) {
      return NextResponse.json(
        { success: false, error: '不支持的平台' },
        { status: 400 }
      );
    }

    const detail = await client.getRoomDetail(roomId);

    return NextResponse.json({
      success: true,
      data: detail,
    });
  } catch (error) {
    console.error('获取房间详情失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取房间详情失败'
      },
      { status: 500 }
    );
  }
}
