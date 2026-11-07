import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const keys = db
      .prepare('SELECT id, name, key_prefix, tier, rate_limit_rpm, requests_count, is_active, created_at FROM api_keys ORDER BY created_at DESC')
      .all();
    return NextResponse.json({ success: true, count: keys.length, keys });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name = 'Production Cluster Agent', tier = 'growth' } = body;

    const id = `key_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const randomHex = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
    const secretKey = tier === 'sovereign' ? `imx_live_sec_${randomHex}` : `imx_test_sec_${randomHex}`;
    const keyPrefix = `${secretKey.substring(0, 12)}...`;

    const rpmLimits: Record<string, number> = {
      community: 600,
      growth: 6000,
      enterprise: 60000,
      sovereign: 500000,
    };

    const rateLimit = rpmLimits[tier] || 6000;

    db.prepare(`
      INSERT INTO api_keys (id, name, key_hash, key_prefix, tier, rate_limit_rpm)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, secretKey, keyPrefix, tier, rateLimit);

    return NextResponse.json({
      success: true,
      id,
      name,
      tier,
      rate_limit_rpm: rateLimit,
      api_key: secretKey, // Returned once upon creation
      message: 'Store your sovereign API key securely. It will not be shown again.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

