import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const antibodies = db.prepare('SELECT * FROM antibodies ORDER BY shielded_reqs DESC').all();
    return NextResponse.json({
      success: true,
      count: antibodies.length,
      antibodies,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

