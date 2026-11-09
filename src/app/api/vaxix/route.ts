import { NextResponse } from 'next/server';
import { immuneLog } from '@/vaxix/immune-log';
import { PathogenDetector, PathogenEvent } from '@/vaxix/detector';
import { AntibodyGenerator } from '@/vaxix/antibody';
import { SandboxVerifier } from '@/vaxix/sandbox';
import { PullRequestBot } from '@/vaxix/pr-bot';
import { ADAPTER_REGISTRY } from '@/vaxix/adapters';
import db from '@/lib/db';

// Global in-memory singleton detector and bot state
const detector = new PathogenDetector();
const generator = new AntibodyGenerator();
const verifier = new SandboxVerifier();
const prBot = new PullRequestBot();

function getDb() {
  return db;
}

// Fallback in-memory seeds if database is unavailable
const fallbackPathogens = [
  {
    id: 'path_stripe_rename_412',
    vendor: 'stripe',
    endpoint: '/v1/payment_intents',
    drift_type: 'FIELD_RENAMED',
    severity: 'CRITICAL',
    description: "Upstream parameter renamed from 'customer_email' to 'email_address' on /v1/payment_intents",
    old_shape: { customer_email: 'string' },
    new_shape: { email_address: 'string' },
    mutation: {
      old_field: 'customer_email',
      new_field: 'email_address',
      call_sites_hint: ['src/services/billing.ts'],
    },
    evidence_payload: {
      error: {
        type: 'invalid_request_error',
        message: "Missing required parameter 'email_address'. Field 'customer_email' deprecated.",
        code: 'parameter_deprecated',
      },
    },
    sunset_date: '2026-03-01T00:00:00Z',
    status: 'ANTIBODY_GENERATED',
    detected_at: '14 minutes ago',
  },
  {
    id: 'path_twilio_sunset_413',
    vendor: 'twilio',
    endpoint: '/v1/charges',
    drift_type: 'FIELD_REMOVED',
    severity: 'CRITICAL',
    description: 'Endpoint /v1/charges has been permanently sunset by upstream vendor',
    old_shape: { to: 'string', amount: 'number' },
    new_shape: { recipient: 'string', token: 'string' },
    mutation: {
      old_field: '/v1/charges',
      new_field: '/v2/checkout/pay',
      call_sites_hint: ['src/services/checkout.ts'],
    },
    evidence_payload: {
      code: 20404,
      message: 'Endpoint /v1/charges sunset permanently. Relocated to /v2/checkout/pay.',
    },
    sunset_date: '2026-01-01T00:00:00Z',
    status: 'ANTIBODY_GENERATED',
    detected_at: '2 hours ago',
  },
];

const fallbackAntibodies = [
  {
    id: 'atb_stripe_412',
    pathogen_id: 'path_stripe_rename_412',
    vendor: 'stripe',
    strategy: 'AST_FIELD_RENAME (ts-morph)',
    target_file: 'src/services/billing.ts',
    ast_diff: `--- a/src/services/billing.ts
+++ b/src/services/billing.ts
@@ -14,7 +14,7 @@ export async function chargeCustomer(payload: ChargeRequest) {
-  const customerEmail = payload.customer_email;
+  const customerEmail = payload.email_address ?? payload.customer_email;
   return stripe.paymentIntents.create({
     amount: payload.amount_cents,
-    customer_email: customerEmail,
+    receipt_email: customerEmail,
   });
 }`,
    verification_status: 'VERIFIED_SANDBOX',
    sandbox_latency_ms: 5.8,
    cryptographic_certificate: 'ed25519_cert_9941a82b9c0182def41_verified',
    created_at: '12 minutes ago',
  },
  {
    id: 'atb_twilio_413',
    pathogen_id: 'path_twilio_sunset_413',
    vendor: 'twilio',
    strategy: 'AST_URL_REROUTE (ts-morph)',
    target_file: 'src/services/checkout.ts',
    ast_diff: `--- a/src/services/checkout.ts
+++ b/src/services/checkout.ts
@@ -28,5 +28,5 @@ export async function dispatchSmsVerification(toPhone: string, code: string) {
-  const endpoint = "https://api.twilio.com/v1/charges";
+  const endpoint = "https://api.twilio.com/v2/checkout/pay";
   return httpClient.post(endpoint, {
     recipient: toPhone,
     token: code,
   });`,
    verification_status: 'VERIFIED_SANDBOX',
    sandbox_latency_ms: 6.2,
    cryptographic_certificate: 'ed25519_cert_8820f14a88bc0192ea9_verified',
    created_at: '1 hour ago',
  },
];

const fallbackPullRequests = [
  {
    id: 'pr_412',
    pr_number: 412,
    repository: 'acme-corp/payment-service',
    branch: 'vaxix/antibody-stripe-pr412',
    title: "fix(stripe): adopt official 'email_address' parameter",
    status: 'OPEN',
    url: 'https://github.com/acme-corp/payment-service/pull/412',
    opened_at: '10 minutes ago',
  },
  {
    id: 'pr_413',
    pr_number: 413,
    repository: 'acme-corp/crm-sync-worker',
    branch: 'vaxix/antibody-twilio-pr413',
    title: 'fix(twilio): relocate /v1/charges ➔ /v2/checkout/pay',
    status: 'OPEN',
    url: 'https://github.com/acme-corp/crm-sync-worker/pull/413',
    opened_at: '1 hour ago',
  },
];

interface PathogenItem {
  id: string;
  vendor: string;
  endpoint: string;
  drift_type: string;
  severity: string;
  description: string;
  old_shape: Record<string, unknown>;
  new_shape: Record<string, unknown>;
  mutation?: Record<string, unknown>;
  evidence_payload?: Record<string, unknown>;
  sunset_date?: string | null;
  status: string;
  detected_at: string;
}

interface AntibodyItem {
  id: string;
  pathogen_id: string;
  vendor: string;
  strategy: string;
  target_file: string;
  ast_diff: string;
  verification_status: string;
  sandbox_latency_ms: number;
  cryptographic_certificate: string;
  created_at: string;
}

interface PullRequestItem {
  id: string;
  pr_number: number;
  repository: string;
  branch: string;
  title: string;
  status: 'OPEN' | 'MERGED';
  url: string;
  opened_at: string;
}

export async function GET() {
  const vendors = Object.values(ADAPTER_REGISTRY).map((adapter) => ({
    id: adapter.id,
    name: adapter.name,
    baseUrl: adapter.baseUrl,
    endpointsCount: Object.keys(adapter.endpoints).length,
    status: 'HEALTHY',
    lastCanary: '3 minutes ago',
  }));

  const db = getDb();

  let activePathogens: PathogenItem[] = fallbackPathogens;
  let activeAntibodies: AntibodyItem[] = fallbackAntibodies;
  let pullRequests: PullRequestItem[] = fallbackPullRequests as PullRequestItem[];
  let logs = immuneLog.getEntries(50);

  if (db) {
    try {
      interface RawPathogen {
        id: string;
        vendor: string;
        endpoint: string;
        drift_type: string;
        severity: string;
        description: string;
        old_shape: string | null;
        new_shape: string | null;
        mutation_vector: string | null;
        evidence_payload: string | null;
        sunset_date: string | null;
        status: string;
        detected_at: string;
      }

      const rows = db.prepare('SELECT * FROM pathogens ORDER BY detected_at DESC').all() as unknown as RawPathogen[];
      if (rows.length > 0) {
        activePathogens = rows.map((p) => ({
          ...p,
          old_shape: p.old_shape ? JSON.parse(p.old_shape) : {},
          new_shape: p.new_shape ? JSON.parse(p.new_shape) : {},
          mutation: p.mutation_vector ? JSON.parse(p.mutation_vector) : {},
          evidence_payload: p.evidence_payload ? JSON.parse(p.evidence_payload) : {},
        }));
      }

      interface RawAntibody {
        id: string;
        pathogen_id: string;
        vendor: string;
        strategy: string;
        target_file: string;
        ast_diff: string;
        verification_status: string;
        sandbox_latency_ms: number;
        cryptographic_certificate: string;
        created_at: string;
      }

      const atbRows = db.prepare('SELECT * FROM antibodies ORDER BY created_at DESC').all() as unknown as RawAntibody[];
      if (atbRows.length > 0) {
        activeAntibodies = atbRows;
      }

      interface RawPr {
        id: string;
        pr_number: number;
        repository: string;
        branch: string;
        title: string;
        status: 'OPEN' | 'MERGED';
        opened_at: string;
      }

      const prRows = db.prepare('SELECT id, pr_number, repository, branch, title, status, opened_at FROM pull_requests ORDER BY pr_number ASC').all() as unknown as RawPr[];
      if (prRows.length > 0) {
        pullRequests = prRows.map((r) => ({
          ...r,
          url: `https://github.com/${r.repository}/pull/${r.pr_number}`,
        }));
      }

      const dbLogs = immuneLog.getEntries(50);
      if (dbLogs.length > 0) {
        logs = dbLogs;
      }
    } catch {}
  }

  return NextResponse.json({
    tagline: 'Your integrations, immune to vendor surprises.',
    vendors,
    pathogens: activePathogens,
    antibodies: activeAntibodies,
    pull_requests: pullRequests,
    immune_log: logs,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, vendor = 'stripe' } = body;
    const db = getDb();

    if (action === 'trigger_canary') {
      immuneLog.append('CANARY_EXECUTED', vendor, `Triggered scheduled canary probe for ${vendor}`);
      const pathogen = await detector.executeCanaryProbe(vendor, '/v1/charges', 'http://localhost:4000').catch(() => null);

      if (pathogen) {
        immuneLog.append('PATHOGEN_DETECTED', vendor, `Canary probe detected pathogen: ${pathogen.description}`, {}, pathogen.id);
        if (db) {
          try {
            db.prepare(`
              INSERT INTO pathogens (id, vendor, endpoint, drift_type, severity, description, old_shape, new_shape, mutation_vector, evidence_payload, sunset_date, status, detected_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            `).run(
              pathogen.id,
              pathogen.vendor,
              pathogen.endpoint,
              pathogen.drift_type,
              pathogen.severity,
              pathogen.description,
              JSON.stringify(pathogen.old_shape || {}),
              JSON.stringify(pathogen.new_shape || {}),
              JSON.stringify(pathogen.mutation || {}),
              JSON.stringify(pathogen.evidence_payload || {}),
              pathogen.sunset_date || null,
              'ANTIBODY_GENERATED'
            );
          } catch {}
        }
      }

      return NextResponse.json({
        success: true,
        canary_executed: true,
        pathogen_detected: Boolean(pathogen),
        pathogen,
      });
    }

    if (action === 'synthesize_antibody') {
      const samplePathogen = fallbackPathogens[0] as unknown as PathogenEvent;
      const sourceCode = `import stripe\ndef charge(): return stripe.Charge.create(customer_email="user@test.com")`;
      const antibody = generator.generateTypeScriptAntibody(samplePathogen, sourceCode, 'src/billing.ts');
      const verification = await verifier.verifyAntibody(antibody);
      const pr = await prBot.openPullRequest(samplePathogen, antibody, verification);

      immuneLog.append('PR_DISPATCHED', vendor, `PR #${pr.pr_number} dispatched for review.`, {}, pr.id);

      if (db) {
        try {
          db.prepare(`
            INSERT INTO antibodies (id, pathogen_id, vendor, strategy, target_file, ast_diff, verification_status, sandbox_latency_ms, cryptographic_certificate, rescues_count, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
          `).run(
            antibody.id,
            antibody.pathogen_id,
            antibody.vendor,
            antibody.strategy,
            antibody.target_file,
            antibody.ast_diff,
            verification.status,
            verification.duration_ms,
            verification.cryptographic_certificate,
            1
          );

          db.prepare(`
            INSERT INTO pull_requests (id, pr_number, repository, branch, title, description, status, ast_diff, certificate, opened_at)
            VALUES (?, ?, ?, ?, ?, ?, 'OPEN', ?, ?, 'Just now')
          `).run(
            pr.id,
            pr.pr_number,
            pr.repository,
            pr.branch_name,
            pr.title,
            pr.body_markdown,
            antibody.ast_diff,
            verification.cryptographic_certificate
          );
        } catch {}
      }

      return NextResponse.json({
        success: true,
        antibody,
        verification,
        pull_request: pr,
      });
    }

    if (action === 'simulate_merge') {
      const prNumber = body.pr_number || 412;
      const repo = body.repo || 'acme-corp/payment-service';
      immuneLog.append(
        'PR_MERGED',
        vendor,
        `PR #${prNumber} in ${repo} merged to main by human reviewer. Production code updated.`,
        { pr_number: prNumber, reviewer: 'cto@sovereign-holdings.ch', strategy: 'SQUASH_AND_MERGE' },
        `pr_${prNumber}`
      );

      if (db) {
        try {
          db.prepare('UPDATE pull_requests SET status = ? WHERE pr_number = ?').run('MERGED', prNumber);
        } catch {}
      }

      return NextResponse.json({
        success: true,
        merged: true,
        pr_number: prNumber,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
