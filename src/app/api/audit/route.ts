import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, cloud, volume, tier = 'Enterprise Grid' } = body;

    if (!name || !email || !company) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and company are required' },
        { status: 400 }
      );
    }

    const id = `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const accessToken = `imx_sovereign_${Math.random().toString(36).substring(2, 10)}`;

    db.prepare(`
      INSERT INTO audit_requests (id, name, email, company, cloud, volume, tier, access_token)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, email, company, cloud || 'AWS', volume || '10M-50M', tier, accessToken);

    return NextResponse.json({
      success: true,
      audit_id: id,
      access_token: accessToken,
      cloud: cloud || 'AWS',
      tier,
      message: 'Sovereign Architecture Evaluation provisioned successfully',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const requests = db
      .prepare('SELECT id, name, company, cloud, volume, tier, status, created_at FROM audit_requests ORDER BY created_at DESC')
      .all();
    return NextResponse.json({ success: true, count: requests.length, requests });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

