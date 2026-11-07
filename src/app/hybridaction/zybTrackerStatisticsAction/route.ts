import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const callback = url.searchParams.get('__callback__') || '__cb__zybTrackerStatisticsAction';

  // Return harmless JSONP callback execution
  return new NextResponse(`/**/${callback}({ status: "ok" });`, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store',
    },
  });
}

