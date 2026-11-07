import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'immunix.sqlite');
const db = new DatabaseSync(dbPath);

// Initialize Sovereign Database Schema
export function initDatabase() {
  // 1. API Keys Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      key_hash TEXT NOT NULL UNIQUE,
      key_prefix TEXT NOT NULL,
      tier TEXT NOT NULL DEFAULT 'community',
      rate_limit_rpm INTEGER NOT NULL DEFAULT 600,
      requests_count INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Clusters Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clusters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      region TEXT NOT NULL,
      cloud TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Inoculated',
      latency_ms REAL NOT NULL DEFAULT 0.38,
      shielded_count INTEGER NOT NULL DEFAULT 0,
      last_sync_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Antibodies Table (Vaccine Rules)
  db.exec(`
    CREATE TABLE IF NOT EXISTS antibodies (
      id TEXT PRIMARY KEY,
      target_vendor TEXT NOT NULL,
      mutation_type TEXT NOT NULL,
      original_schema TEXT NOT NULL,
      healed_schema TEXT NOT NULL,
      ast_patch TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'VERIFIED_GREEN',
      shielded_reqs INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Sabotage Events Log Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sabotage_events (
      id TEXT PRIMARY KEY,
      scenario_id TEXT NOT NULL,
      vendor TEXT NOT NULL,
      status TEXT NOT NULL,
      latency_ms REAL NOT NULL,
      payload_before TEXT NOT NULL,
      payload_after TEXT NOT NULL,
      ast_patch TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Audit & PoC Requests Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT NOT NULL,
      cloud TEXT NOT NULL,
      volume TEXT NOT NULL,
      tier TEXT NOT NULL,
      access_token TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PROVISIONED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default clusters if empty
  const clusterCount = db.prepare('SELECT count(*) as count FROM clusters').get() as { count: number };
  if (clusterCount.count === 0) {
    const defaultClusters = [
      ['aws-us-east-1', 'New York Sovereign NY-1', 'us-east-1', 'AWS', 'Inoculated', 0.31, 890400],
      ['gcp-europe-west3', 'Frankfurt Grid EU-1', 'eu-central-1', 'GCP', 'Inoculated', 0.29, 310200],
      ['azure-japaneast', 'Tokyo Cluster AP-1', 'ap-northeast-1', 'Azure', 'Inoculated', 0.34, 142500],
      ['aws-eu-west-2', 'London Sovereign UK-1', 'eu-west-2', 'AWS', 'Inoculated', 0.36, 240100],
      ['gcp-asia-southeast1', 'Singapore Hub SG-1', 'ap-southeast-1', 'GCP', 'Inoculated', 0.41, 190000],
      ['onprem-zurich', 'Zurich Vault CH-1', 'europe-west6', 'BareMetal', 'Inoculated', 0.22, 54000],
      ['aws-sa-east-1', 'São Paulo Grid SA-1', 'sa-east-1', 'AWS', 'Inoculated', 0.45, 85400],
    ];

    const insertCluster = db.prepare(`
      INSERT INTO clusters (id, name, region, cloud, status, latency_ms, shielded_count)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of defaultClusters) {
      insertCluster.run(...c);
    }
  }

  // Seed default antibodies if empty
  const antibodyCount = db.prepare('SELECT count(*) as count FROM antibodies').get() as { count: number };
  if (antibodyCount.count === 0) {
    const defaultAntibodies = [
      [
        'ATB-8921',
        'Stripe Payments',
        'PROPERTY_RENAMED',
        JSON.stringify({ customer_email: 'string' }),
        JSON.stringify({ email_address: 'string', customer_email: 'alias' }),
        'const recipient = charge.email_address ?? charge.customer_email;',
        'VERIFIED_GREEN',
        14920,
      ],
      [
        'ATB-4819',
        'Salesforce CRM',
        'ENDPOINT_RELOCATED',
        '/v1/charges',
        '/v2/checkout/pay',
        "return await http.post('/v2/checkout/pay', payload);",
        'VERIFIED_GREEN',
        8110,
      ],
      [
        'ATB-3104',
        'Twilio Cloud',
        'TYPE_MUTATED',
        JSON.stringify({ amount: 'string' }),
        JSON.stringify({ amount: 'number' }),
        'amount: z.union([z.number(), z.string().transform(Number)])',
        'VERIFIED_GREEN',
        3420,
      ],
      [
        'ATB-1902',
        'OpenAI API',
        'ENVELOPE_WRAPPED',
        'choices[0].text',
        'choices[0].message.content',
        'const content = res.choices[0].message?.content ?? res.choices[0].text;',
        'VERIFIED_GREEN',
        91200,
      ],
    ];

    const insertAntibody = db.prepare(`
      INSERT INTO antibodies (id, target_vendor, mutation_type, original_schema, healed_schema, ast_patch, status, shielded_reqs)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const a of defaultAntibodies) {
      insertAntibody.run(...a);
    }
  }

  // Seed default master API key if empty
  const keyCount = db.prepare('SELECT count(*) as count FROM api_keys').get() as { count: number };
  if (keyCount.count === 0) {
    const insertKey = db.prepare(`
      INSERT INTO api_keys (id, name, key_hash, key_prefix, tier, rate_limit_rpm)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertKey.run(
      'key_master_01',
      'Production Sovereign Mesh Master',
      'imx_live_sec_789f2a41bc901',
      'imx_live_789f...',
      'sovereign',
      100000
    );

    insertKey.run(
      'key_dev_01',
      'Local Sandbox Developer Key',
      'imx_test_sec_314d89a2bc108',
      'imx_test_314d...',
      'community',
      1200
    );
  }
}

// Ensure database tables exist on module load
initDatabase();

export default db;

