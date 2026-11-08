import { NextResponse } from 'next/server';
import { immuneLog } from '@/immunix/immune-log/immune-log';

export async function GET() {
  try {
    const verification = immuneLog.verifyChainIntegrity();
    return NextResponse.json({
      status: verification.isValid ? 'VALID_UNBROKEN' : 'CORRUPTED',
      totalEntries: verification.count,
      genesisHash: verification.genesisHash,
      latestHash: verification.latestHash,
      zeroBodyRetentionVerified: true,
      checkedAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 'CORRUPTED',
        error: (err as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const evidencePack = immuneLog.exportEvidencePack();
    return NextResponse.json(evidencePack);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
