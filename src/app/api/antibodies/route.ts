import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { AntibodyLifecycleManager, AntibodyLifecycleStage } from '@/immunix/antibody/lifecycle';
import { immuneLog } from '@/immunix/immune-log/immune-log';

export async function GET() {
  try {
    const antibodies = db.prepare('SELECT * FROM antibodies ORDER BY shielded_reqs DESC').all();
    let activeAntibodies: Array<Record<string, unknown>> = [];
    try {
      activeAntibodies = db.prepare('SELECT * FROM active_antibodies ORDER BY created_at DESC').all() as Array<Record<string, unknown>>;
    } catch {}

    return NextResponse.json({
      success: true,
      count: antibodies.length,
      antibodies,
      activeAntibodies,
      lifecycle_stages: ['PROPOSED', 'SANDBOX_VERIFIED', 'HUMAN_APPROVED', 'SHADOW', 'ACTIVE', 'REVOKED'],
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, next_stage, approved_by, shadow_matches = 0 } = body;

    if (!id || !next_stage) {
      return NextResponse.json(
        { success: false, error: 'id and next_stage are required' },
        { status: 400 }
      );
    }

    // Lookup existing antibody in active_antibodies or antibodies
    let currentRecord: Record<string, unknown> | undefined;
    try {
      currentRecord = db.prepare('SELECT * FROM active_antibodies WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    } catch {}

    const currentStage: AntibodyLifecycleStage = (currentRecord?.lifecycle as AntibodyLifecycleStage) || 'PROPOSED';
    const isSensitive = Boolean(currentRecord?.sensitive);

    // Validate transition using 6-stage lifecycle state machine
    const validation = AntibodyLifecycleManager.canTransition(
      currentStage,
      next_stage as AntibodyLifecycleStage,
      {
        approved_by,
        shadow_matches: Number(shadow_matches) || Number(currentRecord?.shadow_matches || 0),
        sensitive: isSensitive,
      }
    );

    if (!validation.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'State transition rejected by policy',
          details: validation.reason,
          currentStage,
          requestedStage: next_stage,
        },
        { status: 422 }
      );
    }

    // Apply update
    try {
      db.prepare(`
        UPDATE active_antibodies
        SET lifecycle = ?, approved_by = COALESCE(?, approved_by), shadow_matches = COALESCE(?, shadow_matches)
        WHERE id = ?
      `).run(next_stage, approved_by || null, shadow_matches, id);
    } catch {}

    // Append to tamper-evident audit ledger
    immuneLog.append(
      next_stage === 'HUMAN_APPROVED'
        ? 'HUMAN_APPROVED'
        : next_stage === 'ACTIVE'
        ? 'RULE_ACTIVATED'
        : 'ANTIBODY_PROPOSED',
      String(currentRecord?.provider_id || 'stripe'),
      `Antibody ${id} transitioned from ${currentStage} to ${next_stage} by ${approved_by || 'system'}.`,
      { id, previousStage: currentStage, nextStage: next_stage, approved_by },
      id
    );

    return NextResponse.json({
      success: true,
      id,
      previous_stage: currentStage,
      current_stage: next_stage,
      approved_by: approved_by || currentRecord?.approved_by || null,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
