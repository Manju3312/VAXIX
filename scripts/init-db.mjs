/**
 * IMMUNIX Unified SQLite Database Initializer
 * Sets up WAL mode, foreign keys, and seeds all core tables.
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'immunix.sqlite');
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA synchronous = NORMAL;');

// 1. Clusters table
db.exec(`
CREATE TABLE IF NOT EXISTS clusters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  status TEXT DEFAULT 'INOCULATED',
  latency_ms REAL DEFAULT 0.35,
  nodes_count INTEGER DEFAULT 2040,
  antibodies_count INTEGER DEFAULT 7,
  last_sync_utc TEXT
);
`);

// 2. Monitored Providers table
db.exec(`
CREATE TABLE IF NOT EXISTS monitored_providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  target_host TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  status TEXT DEFAULT 'inoculated',
  latency_ms REAL DEFAULT 0.32,
  last_verified TEXT,
  env_var TEXT NOT NULL
);
`);

// 3. Pathogens table (Schema Drift Events)
db.exec(`
CREATE TABLE IF NOT EXISTS pathogens (
  id TEXT PRIMARY KEY,
  vendor TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  drift_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT NOT NULL,
  old_shape TEXT,
  new_shape TEXT,
  mutation_vector TEXT,
  evidence_payload TEXT,
  sunset_date TEXT,
  status TEXT DEFAULT 'ANTIBODY_GENERATED',
  detected_at TEXT
);
`);

// 4. Antibodies table (Verified Fix Rules)
db.exec(`
CREATE TABLE IF NOT EXISTS antibodies (
  id TEXT PRIMARY KEY,
  pathogen_id TEXT,
  vendor TEXT NOT NULL,
  strategy TEXT NOT NULL,
  target_file TEXT NOT NULL,
  ast_diff TEXT NOT NULL,
  verification_status TEXT DEFAULT 'VERIFIED_SANDBOX',
  sandbox_latency_ms REAL DEFAULT 5.8,
  cryptographic_certificate TEXT NOT NULL,
  rescues_count INTEGER DEFAULT 0,
  created_at TEXT
);
`);

// 5. Pull Requests table
db.exec(`
CREATE TABLE IF NOT EXISTS pull_requests (
  id TEXT PRIMARY KEY,
  pr_number INTEGER NOT NULL UNIQUE,
  repository TEXT NOT NULL,
  branch TEXT NOT NULL,
  target_branch TEXT DEFAULT 'main',
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'OPEN',
  ast_diff TEXT,
  certificate TEXT,
  opened_at TEXT
);
`);

// 6. Immune Logs table (Tamper-Evident Audit Trail)
db.exec(`
CREATE TABLE IF NOT EXISTS immune_logs (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  vendor TEXT NOT NULL,
  entity_id TEXT,
  message TEXT NOT NULL,
  metadata TEXT,
  timestamp TEXT NOT NULL
);
`);

// 7. API Keys table
db.exec(`
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  tier TEXT DEFAULT 'enterprise',
  rate_limit_rpm INTEGER DEFAULT 60000,
  requests_count INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);
`);

// Seed Clusters if empty
const clusterCount = db.prepare('SELECT COUNT(*) as count FROM clusters').get().count;
if (clusterCount === 0) {
  const insertCluster = db.prepare(`
    INSERT INTO clusters (id, name, region, status, latency_ms, nodes_count, antibodies_count, last_sync_utc)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const clustersData = [
    ['cls_tokyo', 'Tokyo Sovereign Alpha', 'ap-northeast-1', 'INOCULATED', 0.34, 2040, 7],
    ['cls_frankfurt', 'Frankfurt Sovereign Beta', 'eu-central-1', 'INOCULATED', 0.29, 2040, 7],
    ['cls_ny', 'New York Financial Core', 'us-east-1', 'INOCULATED', 0.31, 2040, 7],
    ['cls_sf', 'Silicon Valley Gateway', 'us-west-1', 'INOCULATED', 0.38, 2040, 7],
    ['cls_london', 'London City Hub', 'eu-west-2', 'INOCULATED', 0.32, 2040, 7],
    ['cls_singapore', 'Singapore Marina Hub', 'ap-southeast-1', 'INOCULATED', 0.35, 2040, 7],
    ['cls_zurich', 'Zurich Private Banking Mesh', 'eu-central-2', 'INOCULATED', 0.28, 2040, 7],
  ];

  for (const c of clustersData) {
    insertCluster.run(...c);
  }
}

// Seed Monitored Providers if empty
const providerCount = db.prepare('SELECT COUNT(*) as count FROM monitored_providers').get().count;
if (providerCount === 0) {
  const insertProvider = db.prepare(`
    INSERT INTO monitored_providers (id, name, category, target_host, key_prefix, status, latency_ms, last_verified, env_var)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const providersData = [
    ['stripe', 'Stripe Payments', 'Payment Infrastructure', 'api.stripe.com', 'sk_test_51P98...', 'inoculated', 0.31, '2 seconds ago', 'STRIPE_SECRET_KEY'],
    ['openai', 'OpenAI Platform', 'AI Inference Egress', 'api.openai.com', 'sk-proj-...', 'inoculated', 0.42, '4 seconds ago', 'OPENAI_API_KEY'],
    ['anthropic', 'Anthropic Claude', 'Sovereign Agent Egress', 'api.anthropic.com', 'sk-ant-ap...', 'inoculated', 0.32, 'Just now', 'ANTHROPIC_API_KEY'],
    ['twilio', 'Twilio Cloud', 'Telecom & SMS Egress', 'api.twilio.com', 'AC_imx...', 'inoculated', 0.28, '10 seconds ago', 'TWILIO_ACCOUNT_SID'],
    ['salesforce', 'Salesforce CRM', 'Enterprise Data Graph', 'salesforce.com/services/data', '3MVG9_...', 'inoculated', 0.35, '12 seconds ago', 'SALESFORCE_CLIENT_ID'],
    ['plaid', 'Plaid Core Banking', 'Fintech Interbank', 'api.plaid.com', 'plaid_cl...', 'inoculated', 0.36, '18 seconds ago', 'PLAID_CLIENT_ID'],
    ['github', 'GitHub Webhooks', 'Developer Operations', 'api.github.com', 'ghp_imx...', 'inoculated', 0.29, '1 minute ago', 'GITHUB_TOKEN'],
    ['python_ai', 'Python 3.12 AI Engine', 'LibCST & Scikit-Learn Engine', 'localhost:8001', 'imx_local_kernel_8001', 'connected', 0.38, 'Live Wire', 'PYTHON_AI_ENGINE_URL'],
  ];

  for (const p of providersData) {
    insertProvider.run(...p);
  }
}

// Seed Pathogens if empty
const pathogenCount = db.prepare('SELECT COUNT(*) as count FROM pathogens').get().count;
if (pathogenCount === 0) {
  const insertPathogen = db.prepare(`
    INSERT INTO pathogens (id, vendor, endpoint, drift_type, severity, description, old_shape, new_shape, mutation_vector, evidence_payload, sunset_date, status, detected_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPathogen.run(
    'path_stripe_rename_412',
    'stripe',
    '/v1/payment_intents',
    'FIELD_RENAMED',
    'CRITICAL',
    "Upstream parameter renamed from 'customer_email' to 'email_address' on /v1/payment_intents",
    JSON.stringify({ customer_email: 'string' }),
    JSON.stringify({ email_address: 'string' }),
    JSON.stringify({ old_field: 'customer_email', new_field: 'email_address', call_sites_hint: ['src/services/billing.ts'] }),
    JSON.stringify({ error: { type: 'invalid_request_error', message: "Missing required parameter 'email_address'. Field 'customer_email' deprecated.", code: 'parameter_deprecated' } }),
    '2026-03-01T00:00:00Z',
    'ANTIBODY_GENERATED',
    '14 minutes ago'
  );

  insertPathogen.run(
    'path_twilio_sunset_413',
    'twilio',
    '/v1/charges',
    'FIELD_REMOVED',
    'CRITICAL',
    'Endpoint /v1/charges has been permanently sunset by upstream vendor',
    JSON.stringify({ to: 'string', amount: 'number' }),
    JSON.stringify({ recipient: 'string', token: 'string' }),
    JSON.stringify({ old_field: '/v1/charges', new_field: '/v2/checkout/pay', call_sites_hint: ['src/services/checkout.ts'] }),
    JSON.stringify({ code: 20404, message: 'Endpoint /v1/charges sunset permanently. Relocated to /v2/checkout/pay.' }),
    '2026-01-01T00:00:00Z',
    'ANTIBODY_GENERATED',
    '2 hours ago'
  );
}

// Seed Antibodies if empty
const atbCount = db.prepare('SELECT COUNT(*) as count FROM antibodies').get().count;
if (atbCount === 0) {
  const insertAtb = db.prepare(`
    INSERT INTO antibodies (id, pathogen_id, vendor, strategy, target_file, ast_diff, verification_status, sandbox_latency_ms, cryptographic_certificate, rescues_count, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAtb.run(
    'atb_stripe_412',
    'path_stripe_rename_412',
    'stripe',
    'AST_FIELD_RENAME (ts-morph)',
    'src/services/billing.ts',
    `--- a/src/services/billing.ts
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
    'VERIFIED_SANDBOX',
    5.8,
    'ed25519_cert_9941a82b9c0182def41_verified',
    891400,
    '12 minutes ago'
  );

  insertAtb.run(
    'atb_twilio_413',
    'path_twilio_sunset_413',
    'twilio',
    'AST_URL_REROUTE (ts-morph)',
    'src/services/checkout.ts',
    `--- a/src/services/checkout.ts
+++ b/src/services/checkout.ts
@@ -28,5 +28,5 @@ export async function dispatchSmsVerification(toPhone: string, code: string) {
-  const endpoint = "https://api.twilio.com/v1/charges";
+  const endpoint = "https://api.twilio.com/v2/checkout/pay";
   return httpClient.post(endpoint, {
     recipient: toPhone,
     token: code,
   });`,
    'VERIFIED_SANDBOX',
    6.2,
    'ed25519_cert_8820f14a88bc0192ea9_verified',
    142100,
    '1 hour ago'
  );
}

// Seed Pull Requests if empty
const prCount = db.prepare('SELECT COUNT(*) as count FROM pull_requests').get().count;
if (prCount === 0) {
  const insertPr = db.prepare(`
    INSERT INTO pull_requests (id, pr_number, repository, branch, target_branch, title, description, status, ast_diff, certificate, opened_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPr.run(
    'pr_412',
    412,
    'acme-corp/payment-service',
    'immunix/antibody-stripe-pr412',
    'main',
    "fix(stripe): adopt official 'email_address' parameter",
    "Refactored 3 call sites in 'src/services/billing.ts'. Upstream parameter renamed from customer_email to email_address. Zero live traffic modified.",
    'OPEN',
    `--- a/src/services/billing.ts\n+++ b/src/services/billing.ts\n@@ -14,7 +14,7 @@\n-  const customerEmail = payload.customer_email;\n+  const customerEmail = payload.email_address ?? payload.customer_email;`,
    'ed25519_cert_9941a82b9c0182def41_verified',
    '10 minutes ago'
  );

  insertPr.run(
    'pr_413',
    413,
    'acme-corp/crm-sync-worker',
    'immunix/antibody-twilio-pr413',
    'main',
    'fix(twilio): relocate /v1/charges ➔ /v2/checkout/pay',
    "Updated caller endpoints in 'src/services/checkout.ts'. Endpoint /v1/charges was permanently sunset by upstream vendor.",
    'OPEN',
    `--- a/src/services/checkout.ts\n+++ b/src/services/checkout.ts\n@@ -28,5 +28,5 @@\n-  const endpoint = "https://api.twilio.com/v1/charges";\n+  const endpoint = "https://api.twilio.com/v2/checkout/pay";`,
    'ed25519_cert_8820f14a88bc0192ea9_verified',
    '1 hour ago'
  );
}

// Seed Immune Logs if empty
const logCount = db.prepare('SELECT COUNT(*) as count FROM immune_logs').get().count;
if (logCount === 0) {
  const insertLog = db.prepare(`
    INSERT INTO immune_logs (id, event_type, vendor, entity_id, message, metadata, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const initialLogs = [
    ['log_boot', 'SENSOR_INGEST', 'system', 'sys_0', 'Immunix Immune Log initialized. Safety protocols and redaction filters active.', JSON.stringify({ mode: 'MVP', zero_leak_guarantee: true }), '2026-11-08T03:00:00Z'],
    ['log_probe', 'CANARY_EXECUTED', 'stripe', 'can_1', 'Scheduled canary probe executed against /v1/payment_intents. HTTP 200 received.', JSON.stringify({ latency_ms: 42 }), '2026-11-08T03:15:00Z'],
    ['log_drift', 'PATHOGEN_DETECTED', 'stripe', 'path_stripe_rename_412', "Pathogen isolated: Upstream field 'customer_email' renamed to 'email_address' on /v1/payment_intents", JSON.stringify({ drift_type: 'FIELD_RENAMED', severity: 'CRITICAL' }), '2026-11-08T03:16:00Z'],
    ['log_atb', 'ANTIBODY_SYNTHESIZED', 'stripe', 'atb_stripe_412', 'Synthesized deterministic ts-morph AST antibody rule atb_stripe_412 for src/services/billing.ts', JSON.stringify({ strategy: 'AST_FIELD_RENAME' }), '2026-11-08T03:17:00Z'],
    ['log_sandbox', 'SANDBOX_PASSED', 'stripe', 'cert_412', 'Sandbox verification passed in 5.8ms. Ed25519 signature ed25519_cert_9941a82b9c0182def41_verified generated.', JSON.stringify({ verified: true }), '2026-11-08T03:18:00Z'],
    ['log_pr', 'PR_DISPATCHED', 'stripe', 'pr_412', 'Opened GitHub PR #412: fix(stripe): adopt official email_address parameter. Human approval required.', JSON.stringify({ pr_number: 412 }), '2026-11-08T03:20:00Z'],
  ];

  for (const l of initialLogs) {
    insertLog.run(...l);
  }
}

console.log('✅ SQLite Database successfully initialized with all core tables and seed data.');

