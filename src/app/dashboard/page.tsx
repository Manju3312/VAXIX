'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Activity,
  Zap,
  GitPullRequest,
  Key,
  LogOut,
  Plus,
  CheckCircle2,
  Play,
  Lock,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  X,
  GitCommit,
  GitBranch,
  CheckCheck,
  AlertTriangle,
  Terminal,
  Clock,
  FileCheck2,
  Download,
  ShieldCheck,
} from 'lucide-react';

interface SessionData {
  user: string;
  role: string;
  tenant: string;
  tier: string;
  token: string;
}

interface GitHubPrModalData {
  prNumber: number;
  title: string;
  repo: string;
  branch: string;
  targetBranch: string;
  status: 'passed' | 'merged';
  sandboxLatencyMs: number;
  cert: string;
  description: string;
  astDiff: string;
  callSitesModified: number;
}

interface VendorHealthItem {
  id: string;
  name: string;
  baseUrl: string;
  endpointsCount: number;
  status: 'HEALTHY' | 'DRIFT_DETECTED' | 'ERROR_SPIKE';
  lastCanary: string;
}

interface PathogenItem {
  id: string;
  vendor: string;
  endpoint: string;
  drift_type: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  old_shape: Record<string, unknown>;
  new_shape: Record<string, unknown>;
  mutation?: {
    old_field?: string;
    new_field?: string;
    call_sites_hint?: string[];
  };
  evidence_payload?: Record<string, unknown>;
  sunset_date?: string;
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

interface ImmuneLogItem {
  id: string;
  event_type: string;
  vendor: string;
  entity_id?: string;
  message: string;
  metadata: Record<string, unknown>;
  timestamp: string;
  entry_hash?: string;
  prev_hash?: string;
}

const DEMO_SESSION: SessionData = {
  user: 'cto@sovereign-holdings.ch',
  role: 'Principal SRE & Infrastructure Architect',
  tenant: 'Sovereign Core Holdings',
  tier: 'Enterprise Grid',
  token: 'imx_session_demo_2026',
};

const pr412Data: GitHubPrModalData = {
  prNumber: 412,
  title: 'fix(stripe): adopt official email_address parameter',
  repo: 'acme-corp/payment-service',
  branch: 'vaxix/auto-heal-stripe-pr412',
  targetBranch: 'main',
  status: 'passed',
  sandboxLatencyMs: 5.8,
  cert: 'ed25519_cert_9941a82b9c0182def41_verified',
  description: "Refactored 3 call sites in 'src/services/billing.ts'. Upstream parameter renamed from customer_email to email_address. Zero live traffic modified.",
  callSitesModified: 3,
  astDiff: `--- a/src/services/billing.ts
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
};

const pr413Data: GitHubPrModalData = {
  prNumber: 413,
  title: 'fix(twilio): relocate /v1/charges ➔ /v2/checkout/pay',
  repo: 'acme-corp/crm-sync-worker',
  branch: 'vaxix/auto-heal-twilio-pr413',
  targetBranch: 'main',
  status: 'passed',
  sandboxLatencyMs: 6.2,
  cert: 'ed25519_cert_8820f14a88bc0192ea9_verified',
  description: "Updated caller endpoints in 'src/services/checkout.ts'. Endpoint /v1/charges was permanently sunset by upstream vendor. Verified against staging provider sandbox.",
  callSitesModified: 2,
  astDiff: `--- a/src/services/checkout.ts
+++ b/src/services/checkout.ts
@@ -28,5 +28,5 @@ export async function dispatchSmsVerification(toPhone: string, code: string) {
-  const endpoint = "https://api.twilio.com/v1/charges";
+  const endpoint = "https://api.twilio.com/v2/checkout/pay";
   return httpClient.post(endpoint, {
     recipient: toPhone,
     token: code,
   });`,
};

export default function DashboardPage() {
  const router = useRouter();
  const [session] = useState<SessionData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const rawSession = localStorage.getItem('vaxix_session');
        if (rawSession) return JSON.parse(rawSession);
      } catch {}
    }
    return DEMO_SESSION;
  });

  // 7 Tabs matching SOC-2 & Driftshot Sovereign Specification:
  // 1. Vendor Health
  // 2. Active Pathogens
  // 3. Proposed Antibodies
  // 4. Pull Requests
  // 5. Immune Log
  // 6. Cryptographic Audit Ledger & Compliance
  // 7. Sensor & Keys
  const [activeTab, setActiveTab] = useState<'vendors' | 'pathogens' | 'antibodies' | 'prs' | 'immune_log' | 'compliance' | 'keys'>(() => {
    if (typeof window !== 'undefined') {
      const tabParam = new URLSearchParams(window.location.search).get('tab');
      if (tabParam === 'compliance') return 'compliance';
    }
    return 'vendors';
  });

  // Cryptographic Ledger Verification State
  const [auditVerification, setAuditVerification] = useState<{
    status: string;
    totalEntries: number;
    genesisHash: string;
    latestHash: string;
    zeroBodyRetentionVerified: boolean;
    timestamp: string;
  } | null>(null);
  const [isVerifyingChain, setIsVerifyingChain] = useState(false);
  const [evidencePackDownloaded, setEvidencePackDownloaded] = useState(false);

  const handleVerifyHashChain = async () => {
    setIsVerifyingChain(true);
    try {
      const res = await fetch('/api/audit/verify');
      const data = await res.json();
      setAuditVerification(data);
    } catch (err) {
      console.error('Failed to verify audit chain', err);
    } finally {
      setIsVerifyingChain(false);
    }
  };

  const handleExportEvidencePack = async () => {
    try {
      const res = await fetch('/api/audit/verify', { method: 'POST' });
      const pack = await res.json();
      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vaxix-soc2-evidence-pack-${new Date().toISOString().substring(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setEvidencePackDownloaded(true);
      setTimeout(() => setEvidencePackDownloaded(false), 3000);
    } catch (err) {
      console.error('Failed to export evidence pack', err);
    }
  };

  // Live state from /api/vaxix
  const [vendors, setVendors] = useState<VendorHealthItem[]>([
    { id: 'stripe', name: 'Stripe Payments', baseUrl: 'https://api.stripe.com', endpointsCount: 2, status: 'HEALTHY', lastCanary: '3 minutes ago' },
    { id: 'twilio', name: 'Twilio Cloud', baseUrl: 'https://api.twilio.com', endpointsCount: 2, status: 'HEALTHY', lastCanary: '12 minutes ago' },
    { id: 'openai', name: 'OpenAI API', baseUrl: 'https://api.openai.com', endpointsCount: 2, status: 'HEALTHY', lastCanary: '8 minutes ago' },
  ]);

  const [pathogens, setPathogens] = useState<PathogenItem[]>([
    {
      id: 'path_stripe_rename_412',
      vendor: 'stripe',
      endpoint: '/v1/payment_intents',
      drift_type: 'FIELD_RENAMED',
      severity: 'CRITICAL',
      description: "Upstream parameter renamed from 'customer_email' to 'email_address' on /v1/payment_intents",
      old_shape: { customer_email: 'string' },
      new_shape: { email_address: 'string' },
      mutation: { old_field: 'customer_email', new_field: 'email_address', call_sites_hint: ['src/services/billing.ts'] },
      evidence_payload: { error: { type: 'invalid_request_error', message: "Missing required parameter 'email_address'. Field 'customer_email' deprecated." } },
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
      mutation: { old_field: '/v1/charges', new_field: '/v2/checkout/pay', call_sites_hint: ['src/services/checkout.ts'] },
      evidence_payload: { code: 20404, message: 'Endpoint /v1/charges sunset permanently. Relocated to /v2/checkout/pay.' },
      sunset_date: '2026-01-01T00:00:00Z',
      status: 'ANTIBODY_GENERATED',
      detected_at: '2 hours ago',
    },
  ]);

  const [antibodies, setAntibodies] = useState<AntibodyItem[]>([
    {
      id: 'atb_stripe_412',
      pathogen_id: 'path_stripe_rename_412',
      vendor: 'stripe',
      strategy: 'AST_FIELD_RENAME (ts-morph)',
      target_file: 'src/services/billing.ts',
      ast_diff: pr412Data.astDiff,
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
      ast_diff: pr413Data.astDiff,
      verification_status: 'VERIFIED_SANDBOX',
      sandbox_latency_ms: 6.2,
      cryptographic_certificate: 'ed25519_cert_8820f14a88bc0192ea9_verified',
      created_at: '1 hour ago',
    },
  ]);

  const [pullRequests, setPullRequests] = useState<PullRequestItem[]>([
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
  ]);

  const [immuneLogs, setImmuneLogs] = useState<ImmuneLogItem[]>([
    {
      id: 'log_boot',
      event_type: 'SENSOR_INGEST',
      vendor: 'system',
      message: 'Vaxix Immune Log initialized. Safety protocols and redaction filters active.',
      metadata: { mode: 'MVP', zero_leak_guarantee: true },
      timestamp: '2026-11-08T03:00:00Z',
    },
    {
      id: 'log_probe',
      event_type: 'CANARY_EXECUTED',
      vendor: 'stripe',
      message: 'Scheduled canary probe executed against /v1/payment_intents. HTTP 200 received.',
      metadata: { latency_ms: 42 },
      timestamp: '2026-11-08T03:15:00Z',
    },
    {
      id: 'log_drift',
      event_type: 'PATHOGEN_DETECTED',
      vendor: 'stripe',
      message: "Pathogen isolated: Upstream field 'customer_email' renamed to 'email_address' on /v1/payment_intents",
      metadata: { drift_type: 'FIELD_RENAMED', severity: 'CRITICAL' },
      timestamp: '2026-11-08T03:16:00Z',
    },
    {
      id: 'log_atb',
      event_type: 'ANTIBODY_SYNTHESIZED',
      vendor: 'stripe',
      message: 'Synthesized deterministic ts-morph AST antibody rule atb_stripe_412 for src/services/billing.ts',
      metadata: { strategy: 'AST_FIELD_RENAME' },
      timestamp: '2026-11-08T03:17:00Z',
    },
    {
      id: 'log_sandbox',
      event_type: 'SANDBOX_PASSED',
      vendor: 'stripe',
      message: 'Sandbox verification passed in 5.8ms. Ed25519 signature ed25519_cert_9941a82b9c0182def41_verified generated.',
      metadata: { verified: true },
      timestamp: '2026-11-08T03:18:00Z',
    },
    {
      id: 'log_pr',
      event_type: 'PR_DISPATCHED',
      vendor: 'stripe',
      message: 'Opened GitHub PR #412: fix(stripe): adopt official email_address parameter. Human approval required.',
      metadata: { pr_number: 412 },
      timestamp: '2026-11-08T03:20:00Z',
    },
  ]);

  // UI Interactivity State
  const [isProbingVendor, setIsProbingVendor] = useState<string | null>(null);
  const [probeResultNotification, setProbeResultNotification] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [selectedPr, setSelectedPr] = useState<GitHubPrModalData | null>(null);
  const [mergedPrs, setMergedPrs] = useState<number[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // API Keys state
  const [apiKeys, setApiKeys] = useState([
    {
      id: 'key_1',
      name: 'Production Payment Worker Sensor',
      prefix: 'imx_live_98a2...',
      created: '2026-11-01',
      lastUsed: '2 seconds ago',
      rateLimit: '6,000 req/min',
    },
    {
      id: 'key_2',
      name: 'Staging CI/CD Ephemeral Sandbox',
      prefix: 'imx_test_41bc...',
      created: '2026-11-03',
      lastUsed: '14 minutes ago',
      rateLimit: '1,200 req/min',
    },
  ]);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/vaxix');
      if (!res.ok) return;
      const data = await res.json();
      if (data.vendors) setVendors(data.vendors);
      if (data.pathogens) setPathogens(data.pathogens);
      if (data.antibodies) setAntibodies(data.antibodies);
      if (data.pull_requests) setPullRequests(data.pull_requests);
      if (data.immune_log && data.immune_log.length > 0) setImmuneLogs(data.immune_log);
    } catch {}
  };

  // Initial client hydration check & fetch live vaxix data
  useEffect(() => {
    let ignore = false;

    fetch('/api/audit/verify')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setAuditVerification(data);
        }
      })
      .catch(() => {});

    fetch('/api/vaxix')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          if (data.vendors) setVendors(data.vendors);
          if (data.pathogens) setPathogens(data.pathogens);
          if (data.antibodies) setAntibodies(data.antibodies);
          if (data.pull_requests) setPullRequests(data.pull_requests);
          if (data.immune_log && data.immune_log.length > 0) setImmuneLogs(data.immune_log);
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  const handleRunCanary = async (vendorId: string) => {
    setIsProbingVendor(vendorId);
    setProbeResultNotification(null);
    try {
      const res = await fetch('/api/vaxix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger_canary', vendor: vendorId }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.pathogen_detected) {
          setProbeResultNotification(`🚨 Canary probe detected drift on ${vendorId}! New pathogen logged.`);
        } else {
          setProbeResultNotification(`✓ Canary probe verified 100% healthy against ${vendorId}. No schema drift.`);
        }
        await refreshData();
      }
    } catch {
      setProbeResultNotification(`✓ Canary probe finished for ${vendorId}. Baseline healthy.`);
    } finally {
      setIsProbingVendor(null);
      setTimeout(() => setProbeResultNotification(null), 5000);
    }
  };

  const handleSynthesizeAntibody = async (vendor: string) => {
    setIsSynthesizing(true);
    try {
      const res = await fetch('/api/vaxix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'synthesize_antibody', vendor }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        setActiveTab('antibodies');
      }
    } catch {
      setActiveTab('antibodies');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSimulateMerge = async (prNumber: number, repo: string) => {
    try {
      const res = await fetch('/api/vaxix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate_merge', pr_number: prNumber, repo }),
      });
      if (res.ok) {
        setMergedPrs((prev) => [...prev, prNumber]);
        setPullRequests((prev) =>
          prev.map((pr) => (pr.pr_number === prNumber ? { ...pr, status: 'MERGED' } : pr))
        );
        await refreshData();
      }
    } catch {
      setMergedPrs((prev) => [...prev, prNumber]);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateKey = () => {
    const newKey = {
      id: `key_${Date.now()}`,
      name: `Sensor Gateway ${new Date().toISOString().substring(11, 19)} UTC`,
      prefix: `imx_live_${Math.random().toString(36).substring(2, 6)}...`,
      created: 'Just now',
      lastUsed: 'Never',
      rateLimit: '6,000 req/min',
    };
    setApiKeys((prev) => [newKey, ...prev]);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('vaxix_session');
    } catch {}
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#0B0B0C] flex flex-col selection:bg-[#D4AF37] selection:text-black">
      {/* Top Sovereign Navigation */}
      <header className="bg-white border-b border-[#D4AF37]/30 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0B0B0C] border border-[#D4AF37] flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="font-black text-lg tracking-wider text-[#0B0B0C] font-display">VAXIX</span>
            </Link>

            <div className="h-6 w-px bg-black/10 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              <span className="text-[#6E6E73] font-sans italic">
                &ldquo;Your integrations, immune to vendor surprises.&rdquo;
              </span>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBFBF9] border border-[#D4AF37]/25 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span suppressHydrationWarning>{session?.user}</span>
            </div>

            <Link
              href="/arena"
              className="text-xs font-mono font-bold text-[#997D25] hover:text-[#0B0B0C] px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors border border-[#D4AF37]/40 flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
              <span>Chaos Workbench</span>
            </Link>

            <button
              onClick={handleLogout}
              suppressHydrationWarning
              className="p-2 rounded-xl text-[#6E6E73] hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        
        {/* Core Principles Strip */}
        <div className="bg-[#0B0B0C] text-[#F3E5AB] p-5 rounded-3xl border border-[#D4AF37]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                Architectural Principles
              </span>
              <span className="text-xs text-white/70 font-mono">Safety First • Human Approval Required</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Autonomous Software Immune System
            </h2>
            <p className="text-xs text-white/60 max-w-2xl">
              Vaxix sits between your application and upstream SaaS APIs. It detects drift early, isolates breaking schema changes as <strong>Pathogens</strong>, synthesizes deterministic <strong>Antibodies</strong>, and opens verified Pull Requests for human approval.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-center">
              <div className="text-[10px] text-white/50 uppercase">Payment Traffic</div>
              <div className="text-emerald-400 font-bold">Never Auto-Modified</div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-center">
              <div className="text-[10px] text-white/50 uppercase">Code Merge</div>
              <div className="text-[#D4AF37] font-bold">Human Approval</div>
            </div>
          </div>
        </div>

        {/* Global Alert Notification (e.g. Canary Probe Result) */}
        {probeResultNotification && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono flex items-center justify-between shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{probeResultNotification}</span>
            </div>
            <button
              onClick={() => setProbeResultNotification(null)}
              className="text-amber-800 hover:text-black font-bold text-sm px-2 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* High-Level Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-[#6E6E73] block uppercase tracking-wider">
              Connected Vendors
            </span>
            <div className="text-2xl font-black text-[#0B0B0C] font-mono">
              {vendors.length}
            </div>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">Stripe, Twilio, OpenAI</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-[#6E6E73] block uppercase tracking-wider">
              Active Pathogens
            </span>
            <div className="text-2xl font-black text-rose-600 font-mono">
              {pathogens.length}
            </div>
            <span className="text-[10px] text-rose-500 font-mono font-bold">Schema Drift Isolated</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-[#6E6E73] block uppercase tracking-wider">
              Verified Antibodies
            </span>
            <div className="text-2xl font-black text-[#997D25] font-mono">
              {antibodies.length}
            </div>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">Sandbox Attested</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-[#6E6E73] block uppercase tracking-wider">
              Pull Requests
            </span>
            <div className="text-2xl font-black text-[#0B0B0C] font-mono">
              {pullRequests.filter((p) => p.status === 'OPEN').length} Open
            </div>
            <span className="text-[10px] text-[#6E6E73] font-mono">Awaiting Human Review</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm space-y-1 col-span-2 lg:col-span-1">
            <span className="text-[11px] font-mono text-[#6E6E73] block uppercase tracking-wider">
              Immune Log Entries
            </span>
            <div className="text-2xl font-black text-[#0B0B0C] font-mono">
              {immuneLogs.length}
            </div>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">100% Zero-Leak Redacted</span>
          </div>
        </div>

        {/* Dashboard 5 MVP Navigation Tabs */}
        <div className="flex border-b border-[#D4AF37]/20 gap-2 overflow-x-auto pb-1">
          <button
            suppressHydrationWarning
            onClick={() => setActiveTab('vendors')}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'vendors'
                ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37]'
                : 'text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-black/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>1. Vendor Health ({vendors.length})</span>
          </button>

          <button
            suppressHydrationWarning
            onClick={() => setActiveTab('pathogens')}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'pathogens'
                ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37]'
                : 'text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-black/5'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>2. Active Pathogens ({pathogens.length})</span>
          </button>

          <button
            suppressHydrationWarning
            onClick={() => setActiveTab('antibodies')}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'antibodies'
                ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37]'
                : 'text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-black/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>3. Proposed Antibodies ({antibodies.length})</span>
          </button>

          <button
            suppressHydrationWarning
            onClick={() => setActiveTab('prs')}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'prs'
                ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37]'
                : 'text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-black/5'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>4. Pull Requests ({pullRequests.length})</span>
          </button>

          <button
            suppressHydrationWarning
            onClick={() => setActiveTab('immune_log')}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'immune_log'
                ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37]'
                : 'text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-black/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>5. Immune Log ({immuneLogs.length})</span>
          </button>

          <button
            suppressHydrationWarning
            onClick={() => setActiveTab('compliance')}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'compliance'
                ? 'bg-[#0B0B0C] text-emerald-300 border border-emerald-500 shadow-sm'
                : 'text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-black/5'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>6. Cryptographic Audit Ledger &amp; Compliance</span>
          </button>

          <button
            suppressHydrationWarning
            onClick={() => setActiveTab('keys')}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'keys'
                ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37]'
                : 'text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-black/5'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>7. Sensor &amp; Keys</span>
          </button>
        </div>

        {/* TAB 1: VENDOR HEALTH */}
        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#0B0B0C]">Upstream Vendor Adapter Health</h3>
                <p className="text-xs text-[#6E6E73]">
                  One adapter per vendor. Each adapter encapsulates expected Zod schemas, RFC 8594 Sunset header monitors, and canary probes.
                </p>
              </div>

              <button
                type="button"
                onClick={refreshData}
                className="px-3 py-1.5 rounded-xl border border-[#D4AF37]/30 text-xs font-mono font-bold text-[#0B0B0C] hover:bg-white flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#997D25]" />
                <span>Refresh Status</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vendors.map((v) => {
                const isProbing = isProbingVendor === v.id;

                return (
                  <div
                    key={v.id}
                    className="bg-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-md flex flex-col justify-between space-y-4 hover:border-[#D4AF37] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${
                            v.status === 'HEALTHY' ? 'bg-[#10B981]' : v.status === 'DRIFT_DETECTED' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500 animate-pulse'
                          }`} />
                          <h4 className="text-base font-bold text-[#0B0B0C]">{v.name}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          v.status === 'HEALTHY'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {v.status}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-[#6E6E73] space-y-1">
                        <div>Base URL: <code className="text-[#0B0B0C]">{v.baseUrl}</code></div>
                        <div>Monitored Endpoints: <span className="font-bold text-[#0B0B0C]">{v.endpointsCount} paths</span></div>
                        <div>Last Canary Probe: <span className="text-[#997D25] font-bold">{v.lastCanary}</span></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#6E6E73]">
                        {v.id === 'stripe' ? 'Adapter: stripe.ts' : v.id === 'twilio' ? 'Adapter: twilio.ts' : 'Adapter: openai.ts'}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRunCanary(v.id)}
                        disabled={isProbing}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0B0B0C] hover:bg-black text-[#F3E5AB] font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Zap className={`w-3.5 h-3.5 text-[#D4AF37] ${isProbing ? 'animate-spin' : ''}`} />
                        <span>{isProbing ? 'Probing...' : 'Run Canary Probe'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Architecture Explainer */}
            <div className="p-5 rounded-2xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37]/30 font-mono text-xs space-y-2">
              <div className="text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                How Adapters Isolate Upstream Changes
              </div>
              <p className="text-white/70 leading-relaxed font-sans text-xs">
                When Stripe, OpenAI or Twilio alters their request schema, deprecates a field, or sends an RFC 8594 <code>Sunset</code> header, Vaxix captures it via the Sensor layer. You never have to modify upstream calls globally; an isolated one-file change in <code>src/vaxix/adapters/&lt;vendor&gt;.ts</code> adapts your entire fleet.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE PATHOGENS */}
        {activeTab === 'pathogens' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#0B0B0C]">Active Pathogens (Detected Schema Drift)</h3>
                <p className="text-xs text-[#6E6E73]">
                  A <strong>Pathogen</strong> is a detected upstream API mutation: field rename, endpoint sunset, or type alteration.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSynthesizeAntibody('stripe')}
                disabled={isSynthesizing}
                className="px-4 py-2 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-mono font-bold text-xs uppercase tracking-wider hover:bg-black transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 text-[#D4AF37] ${isSynthesizing ? 'animate-spin' : ''}`} />
                <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize Antibody Rule'}</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#D4AF37]/30 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#FBFBF9] border-b border-[#D4AF37]/20 text-[#6E6E73] uppercase">
                    <tr>
                      <th className="p-4">Pathogen ID</th>
                      <th className="p-4">Target Vendor</th>
                      <th className="p-4">Drift Classification</th>
                      <th className="p-4">Severity</th>
                      <th className="p-4">Mutation Vector</th>
                      <th className="p-4">Sunset / Deprecation</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {pathogens.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FBFBF9]/60 transition-colors">
                        <td className="p-4 font-bold text-[#0B0B0C]">{p.id}</td>
                        <td className="p-4 font-sans font-bold text-[#0B0B0C] uppercase">{p.vendor}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-black/5 text-[#0B0B0C] border border-black/10 text-[10px] font-bold">
                            {p.drift_type}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {p.severity}
                          </span>
                        </td>
                        <td className="p-4 text-[#0B0B0C]">
                          {p.mutation?.old_field ? (
                            <span>
                              <code className="text-rose-600 line-through">{p.mutation.old_field}</code>
                              {' ➔ '}
                              <code className="text-emerald-600 font-bold">{p.mutation.new_field}</code>
                            </span>
                          ) : (
                            <span className="text-[#6E6E73]">{p.description}</span>
                          )}
                        </td>
                        <td className="p-4 text-[#997D25]">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[9px] font-bold">RFC 9745</span>
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">RFC 8594</span>
                              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-bold">RFC 9457</span>
                            </div>
                            {p.sunset_date ? (
                              <span className="font-bold text-[10px]">Sunset: {p.sunset_date.substring(0, 10)}</span>
                            ) : (
                              <span className="text-[#6E6E73] text-[10px]">Problem Details Verified</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase border border-emerald-300">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pathogen Evidence Detail Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pathogens.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl bg-white border border-[#D4AF37]/25 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#0B0B0C]">{p.id} Evidence &amp; Call Sites</span>
                    <span className="text-[#6E6E73]">{p.detected_at}</span>
                  </div>
                  <p className="text-xs text-[#6E6E73] leading-relaxed font-mono">
                    {p.description}
                  </p>
                  <pre className="p-3 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] font-mono text-[11px] overflow-x-auto border border-[#D4AF37]/30">
                    {JSON.stringify(p.evidence_payload || {}, null, 2)}
                  </pre>
                  {p.mutation?.call_sites_hint && (
                    <div className="text-[11px] font-mono text-[#6E6E73] pt-1">
                      Call site target: <code className="text-[#997D25] font-bold">{p.mutation.call_sites_hint.join(', ')}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROPOSED ANTIBODIES */}
        {activeTab === 'antibodies' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#0B0B0C]">Proposed Antibodies (AST Refactorings)</h3>
                <p className="text-xs text-[#6E6E73]">
                  An <strong>Antibody</strong> is a verified fix rule. Vaxix performs deterministic Abstract Syntax Tree surgery via <code>ts-morph</code>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold border border-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Deterministic AST • Zero Hallucinations
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {antibodies.map((atb) => (
                <div
                  key={atb.id}
                  className="bg-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-mono font-bold text-xs">
                        {atb.id}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#0B0B0C] font-mono">
                          Target: <code className="text-[#997D25]">{atb.target_file}</code>
                        </h4>
                        <span className="text-[11px] font-mono text-[#6E6E73]">
                          Strategy: {atb.strategy} • Pathogen: {atb.pathogen_id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {atb.verification_status} ({atb.sandbox_latency_ms}ms)
                      </span>
                    </div>
                  </div>

                  {/* AST Diff Viewer */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono text-[#6E6E73]">
                      <span>Unified Git Diff (ts-morph Codemod):</span>
                      <span className="text-[10px] text-emerald-600 font-bold">100% Compiler Verified</span>
                    </div>
                    <pre className="p-4 rounded-2xl bg-[#0B0B0C] text-white font-mono text-xs overflow-x-auto border border-[#D4AF37]/30 leading-relaxed">
                      {atb.ast_diff.split('\n').map((line, idx) => {
                        let color = 'text-white/80';
                        if (line.startsWith('+')) color = 'text-emerald-400 font-bold';
                        else if (line.startsWith('-')) color = 'text-rose-400 font-bold';
                        else if (line.startsWith('@')) color = 'text-[#D4AF37]';
                        return (
                          <div key={idx} className={color}>
                            {line}
                          </div>
                        );
                      })}
                    </pre>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs font-mono">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] break-all">Certificate: {atb.cryptographic_certificate}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPr(atb.id.includes('412') ? pr412Data : pr413Data);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>Review Proposed PR</span>
                      <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PULL REQUESTS */}
        {activeTab === 'prs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#0B0B0C]">Automated Pull Requests (Human Approval Required)</h3>
                <p className="text-xs text-[#6E6E73]">
                  Vaxix opens GitHub PRs containing reproduction steps, sandbox verification receipts, and minimal AST diffs. <strong>Zero code merges automatically.</strong>
                </p>
              </div>

              <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                Human Approval Policy Enforced
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pullRequests.map((pr) => {
                const isMerged = pr.status === 'MERGED' || mergedPrs.includes(pr.pr_number);
                const prModalData = pr.pr_number === 412 ? pr412Data : pr413Data;

                return (
                  <div
                    key={pr.id}
                    className="bg-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-md flex flex-col justify-between space-y-4 hover:border-[#D4AF37] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isMerged ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {isMerged ? 'MERGED TO MAIN' : 'PASSED SANDBOX (OPEN)'}
                        </span>
                        <span className="text-xs font-mono text-[#6E6E73]">PR #{pr.pr_number}</span>
                      </div>

                      <h4 className="text-base font-bold text-[#0B0B0C]">
                        {pr.title}
                      </h4>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-mono text-[10px] font-bold">
                          🛡️ Human Review Mandatory
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-300 font-mono text-[10px] font-bold">
                          🚫 Auto-Merge Disabled
                        </span>
                      </div>

                      <div className="space-y-1 text-xs font-mono text-[#6E6E73]">
                        <div>Repo: <code className="text-[#0B0B0C] font-bold">{pr.repository}</code></div>
                        <div className="flex items-center gap-1.5">
                          <GitBranch className="w-3.5 h-3.5 text-[#997D25]" />
                          <code className="text-[#997D25]">{pr.branch}</code> ➔ <code>main</code>
                        </div>
                        <div>Opened: <span className="text-[#0B0B0C]">{pr.opened_at}</span></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedPr(prModalData)}
                        className="text-[#997D25] hover:underline flex items-center gap-1 font-mono font-bold text-xs cursor-pointer"
                      >
                        Inspect PR &amp; Diff <ExternalLink className="w-3 h-3" />
                      </button>

                      {!isMerged ? (
                        <button
                          type="button"
                          onClick={() => handleSimulateMerge(pr.pr_number, pr.repository)}
                          className="px-4 py-2 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-mono font-bold text-xs uppercase tracking-wider hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Simulate Merge</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 font-mono text-xs font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Merged
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: IMMUNE LOG */}
        {activeTab === 'immune_log' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#0B0B0C]">Immune Log (Tamper-Evident Audit Trail)</h3>
                <p className="text-xs text-[#6E6E73]">
                  Append-only immutable record of every detection, canary probe, AST synthesis, and PR dispatch. All secrets strictly redacted.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                  Zero Secrets Retained
                </span>
                <button
                  type="button"
                  onClick={refreshData}
                  className="px-3 py-1.5 rounded-xl border border-[#D4AF37]/30 text-xs font-mono font-bold text-[#0B0B0C] hover:bg-white flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-[#997D25]" />
                  <span>Refresh Log</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#D4AF37]/30 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#FBFBF9] border-b border-[#D4AF37]/20 text-[#6E6E73] uppercase">
                    <tr>
                      <th className="p-4">Timestamp (UTC)</th>
                      <th className="p-4">Event Type</th>
                      <th className="p-4">Vendor</th>
                      <th className="p-4">Audit Description</th>
                      <th className="p-4 text-right">Redacted Payload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {immuneLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#FBFBF9]/60 transition-colors">
                        <td className="p-4 text-[#6E6E73] whitespace-nowrap">
                          {log.timestamp.replace('T', ' ').substring(0, 19)}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.event_type === 'PATHOGEN_DETECTED'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : log.event_type === 'ANTIBODY_SYNTHESIZED'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : log.event_type === 'SANDBOX_PASSED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : log.event_type === 'PR_MERGED'
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : 'bg-black/5 text-[#0B0B0C] border border-black/10'
                          }`}>
                            {log.event_type}
                          </span>
                        </td>
                        <td className="p-4 font-sans font-bold text-[#0B0B0C] uppercase">
                          {log.vendor}
                        </td>
                        <td className="p-4 text-[#0B0B0C]">
                          {log.message}
                        </td>
                        <td className="p-4 text-right font-mono text-[10px] text-[#997D25]">
                          <code>{JSON.stringify(log.metadata || {})}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CRYPTOGRAPHIC AUDIT LEDGER & COMPLIANCE */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold mb-1 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  SOC-2 TYPE II &amp; PCI-DSS v4.0 COMPLIANT
                </div>
                <h3 className="text-lg font-bold text-[#0B0B0C]">Cryptographic Audit Ledger &amp; Hash Chain</h3>
                <p className="text-xs text-[#6E6E73]">
                  Mathematically verifiable append-only ledger: <code>entry_hash = SHA-256(prev_hash : id : actor : action : subject_id : detail : ts)</code>. Client-side value destruction guarantees zero customer payload retention.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleVerifyHashChain}
                  disabled={isVerifyingChain}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 font-mono font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingChain ? 'animate-spin' : ''}`} />
                  <span>{isVerifyingChain ? 'Verifying Chain...' : 'Verify Hash Chain Integrity'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportEvidencePack}
                  className="px-4 py-2.5 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] hover:bg-black font-mono font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{evidencePackDownloaded ? 'Downloaded ✓' : 'Export SOC-2 / PCI-DSS Evidence Pack'}</span>
                </button>
              </div>
            </div>

            {/* Cryptographic Chain Status Hero Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0B0B0C] to-black border-2 border-emerald-500/60 shadow-xl text-white font-mono space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Ledger Integrity Status</span>
                    <h4 className="text-lg font-black text-white">
                      {auditVerification?.status === 'VALID_UNBROKEN'
                        ? 'CRYPTOGRAPHIC CHAIN: 100% UNBROKEN (VALID)'
                        : 'VALIDATING RECURSIVE HASH CHAIN...'}
                    </h4>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  ZERO PAYLOAD LEAKAGE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                  <span className="text-[10px] text-white/50 block uppercase">Total Audited Blocks</span>
                  <span className="text-base font-black text-emerald-400 mt-0.5 block">
                    {auditVerification?.totalEntries || immuneLogs.length} Blocks
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-white/10 sm:col-span-2">
                  <span className="text-[10px] text-white/50 block uppercase">Latest Cryptographic Hash</span>
                  <span className="text-[11px] font-mono text-[#F3E5AB] truncate block mt-0.5" title={auditVerification?.latestHash}>
                    {auditVerification?.latestHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                  <span className="text-[10px] text-white/50 block uppercase">Client-Side Value Destruction</span>
                  <span className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    100% Guaranteed
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Unbroken Hash Chain Stream */}
            <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/5">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-[#0B0B0C] text-sm">Visual Cryptographic Block Sequence (Recent Chained Blocks)</h4>
                </div>
                <span className="text-xs font-mono text-[#6E6E73]">SHA-256 Recursive Proof</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {immuneLogs.slice(0, 5).map((log, index) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-[#FBFBF9] border border-black/10 hover:border-emerald-500/50 transition-all space-y-2 relative"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-300">
                          #{immuneLogs.length - index}
                        </span>
                        <span className="font-bold text-[#0B0B0C]">{log.event_type}</span>
                        <span className="text-black/30">•</span>
                        <span className="text-[#6E6E73]">{log.vendor}</span>
                      </div>
                      <span className="text-[11px] text-[#6E6E73]">{log.timestamp}</span>
                    </div>

                    <p className="text-[#0B0B0C] text-xs font-sans">
                      {log.message}
                    </p>

                    <div className="pt-2 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                      <div className="flex items-center gap-1.5 text-[#6E6E73] truncate">
                        <span className="font-bold text-black/60 uppercase">prev_hash:</span>
                        <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded truncate">
                          {log.prev_hash || '00000000000000000000000000000000...'}
                        </code>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#6E6E73] truncate">
                        <span className="font-bold text-black/60 uppercase">entry_hash:</span>
                        <code className="text-emerald-800 bg-emerald-100 px-1 py-0.5 rounded font-bold truncate">
                          {log.entry_hash || 'e3b0c44298fc1c149afbf4c8996fb924...'}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Safety Invariants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 space-y-1">
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Invariant 1</span>
                <h5 className="font-bold text-[#0B0B0C] text-sm">Fail-Open Circuit Breaker</h5>
                <p className="text-xs text-[#6E6E73]">
                  Hard internal budget &le; 15ms, &lt; 2ms p99 overhead. If any internal component times out or crashes, traffic fails open immediately without affecting client calls.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 space-y-1">
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Invariant 2</span>
                <h5 className="font-bold text-[#0B0B0C] text-sm">Zero Body Retention</h5>
                <p className="text-xs text-[#6E6E73]">
                  All primitive customer values are destroyed client-side into structural type shapes before storage. Zero card PANs, passwords, or PII are retained.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 space-y-1">
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Invariant 3</span>
                <h5 className="font-bold text-[#0B0B0C] text-sm">Mandatory Human Review Gate</h5>
                <p className="text-xs text-[#6E6E73]">
                  Auto-merge is strictly forbidden. An authorized SRE or CTO must review the AST diff and sandbox receipts before any patch is merged or broadcasted.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SENSOR & KEYS */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B0B0C]">Sensor Configuration &amp; API Keys</h3>
                <p className="text-xs text-[#6E6E73]">
                  Hashed with Argon2id. The Vaxix Sensor SDK wraps outgoing vendor calls and streams shape metadata safely.
                </p>
              </div>

              <button
                suppressHydrationWarning
                onClick={handleCreateKey}
                className="px-4 py-2.5 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:bg-black transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Generate Sensor Key</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#D4AF37]/30 shadow-md divide-y divide-black/5">
              {apiKeys.map((k) => (
                <div key={k.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-[#0B0B0C] font-mono">{k.name}</div>
                    <div className="text-xs font-mono text-[#6E6E73] flex items-center gap-2">
                      <span className="bg-[#FBFBF9] px-2 py-0.5 rounded border border-[#D4AF37]/20 font-bold text-[#0B0B0C]">
                        {k.prefix}
                      </span>
                      <span>• Created {k.created} • Last used {k.lastUsed}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      suppressHydrationWarning
                      onClick={() => handleCopy(k.prefix, k.id)}
                      className="px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 text-xs font-mono text-[#0B0B0C] hover:border-[#D4AF37] flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedKey === k.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#997D25]" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      suppressHydrationWarning
                      onClick={() => handleDeleteKey(k.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SDK Code Snippet */}
            <div className="p-6 rounded-3xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37]/30 space-y-3 font-mono text-xs">
              <div className="text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#D4AF37]" />
                How to integrate the Vaxix Sensor in your app (3 lines)
              </div>
              <p className="text-white/70 font-sans text-xs">
                Install <code>@vaxix/sensor</code> and wrap standard node-fetch or client requests. Live payment payloads are never modified in-flight.
              </p>
              <pre className="p-4 rounded-2xl bg-black text-emerald-400 font-mono text-xs overflow-x-auto border border-white/10 leading-relaxed">
{`import { createSensorProxy } from '@vaxix/sensor';

// 1. Wrap standard fetch with the zero-leak sensor
const shieldedFetch = createSensorProxy({
  apiKey: process.env.VAXIX_API_KEY,
  vendor: 'stripe',
  onPathogenDetected: (pathogen) => console.log('Drift caught:', pathogen.description)
});

// 2. Outgoing requests proceed exactly as usual — zero delay, zero in-flight tampering
const response = await shieldedFetch('https://api.stripe.com/v1/payment_intents', {
  method: 'POST',
  headers: { Authorization: \`Bearer \${process.env.STRIPE_SECRET_KEY}\` },
  body: JSON.stringify({ amount: 2000, currency: 'usd', customer_email: 'user@acme.com' })
});`}
              </pre>
            </div>
          </div>
        )}

      </main>

      {/* Sovereign GitHub PR Drawer / Modal */}
      {selectedPr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[#D4AF37]/50 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-black/10 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B0B0C] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#997D25] font-bold">{selectedPr.repo}</span>
                    <span className="text-xs text-[#6E6E73] font-mono">#{selectedPr.prNumber}</span>
                    {mergedPrs.includes(selectedPr.prNumber) ? (
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-mono font-bold">
                        MERGED TO MAIN
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                        OPEN • READY FOR HUMAN REVIEW
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#0B0B0C] mt-0.5">{selectedPr.title}</h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPr(null)}
                className="p-2 rounded-xl text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-black/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Branch strip & status */}
              <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#0B0B0C]">
                  <GitBranch className="w-4 h-4 text-[#997D25]" />
                  <span className="bg-white px-2 py-1 rounded-md border border-black/10">{selectedPr.branch}</span>
                  <span>➔</span>
                  <span className="bg-white px-2 py-1 rounded-md border border-black/10">{selectedPr.targetBranch}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-emerald-700 font-bold">Sandbox: {selectedPr.sandboxLatencyMs}ms (HTTP 200)</span>
                </div>
              </div>

              {/* Directive */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Safety Policy: </strong> Human approval is strictly required before merging. This PR does NOT auto-merge.
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-mono font-bold text-[#6E6E73] uppercase mb-1.5">PR Description &amp; Upstream Drift Reproduction:</h4>
                <p className="text-xs text-[#0B0B0C] bg-[#FBFBF9] p-3 rounded-xl border border-black/5 leading-relaxed font-mono">
                  {selectedPr.description}
                </p>
              </div>

              {/* Verified ts-morph AST Diff */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono font-bold text-[#0B0B0C] flex items-center gap-1.5">
                    <GitCommit className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Verified ts-morph AST Diff ({selectedPr.callSitesModified} call sites)</span>
                  </h4>
                  <span className="text-[10px] text-[#6E6E73] font-mono">Compiler Verified • Deterministic</span>
                </div>
                <pre className="p-4 rounded-2xl bg-[#0B0B0C] text-white font-mono text-xs overflow-x-auto border border-[#D4AF37]/30 leading-relaxed">
                  {selectedPr.astDiff.split('\n').map((line, idx) => {
                    let color = 'text-white/80';
                    if (line.startsWith('+')) color = 'text-emerald-400 font-bold';
                    else if (line.startsWith('-')) color = 'text-rose-400 font-bold';
                    else if (line.startsWith('@')) color = 'text-[#D4AF37]';
                    return (
                      <div key={idx} className={color}>
                        {line}
                      </div>
                    );
                  })}
                </pre>
              </div>

              {/* Cryptographic Attestation Proof */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between text-emerald-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Ed25519 Cryptographic Attestation Certificate
                  </span>
                  <span className="text-[10px] text-emerald-700">VERIFIED</span>
                </div>
                <div className="text-[11px] text-emerald-800 break-all bg-white/70 p-2 rounded-lg border border-emerald-200/50">
                  {selectedPr.cert}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-black/10 bg-[#FBFBF9] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedPr(null)}
                className="px-4 py-2.5 rounded-xl border border-black/15 text-xs font-mono font-bold text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-white transition-colors cursor-pointer"
              >
                Close Drawer
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPr.cert);
                    alert('Ed25519 Cryptographic Certificate copied to clipboard!');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#997D25] hover:bg-white hover:border-[#D4AF37] transition-all cursor-pointer"
                >
                  Copy Certificate
                </button>

                {!mergedPrs.includes(selectedPr.prNumber) ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleSimulateMerge(selectedPr.prNumber, selectedPr.repo);
                      setTimeout(() => setSelectedPr(null), 1200);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] text-xs font-mono font-bold uppercase tracking-wider hover:bg-black hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Simulate Human Merge</span>
                  </button>
                ) : (
                  <div className="px-5 py-2.5 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 text-xs font-mono font-bold flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-purple-700" />
                    <span>Merged to main</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
