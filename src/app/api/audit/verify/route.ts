import { NextResponse } from 'next/server';
import { immuneLog } from '@/immunix/immune-log/immune-log';

export async function GET() {
  try {
    const result = immuneLog.verifyChain();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        status: 'CHAIN_TAMPERED',
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

