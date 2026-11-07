'use client';

import React, { useState } from 'react';
import {
  Layers,
  Activity,
  GitPullRequest,
  Play,
  RefreshCw,
  Database,
  Check,
  Copy,
  Shield,
  UserCheck,
  Lock,
} from 'lucide-react';

interface ActiveNodeDetail {
  stepNumber: number;
  title: string;
  stageName: string;
  description: string;
  metric: string;
  technicalSpec: string;
  codeSnippet: string;
  isHumanGate?: boolean;
}

export default function ArchitectureSystemMap() {
  const [activeNodeKey, setActiveNodeKey] = useState<string>('sensorProxy');
  const [isTracing, setIsTracing] = useState(false);
  const [highlightedStep, setHighlightedStep] = useState<string | null>(null);
  const [traceLogs, setTraceLogs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'pipeline' | 'storage'>('pipeline');
  const [activeDdlTab, setActiveDdlTab] = useState<string>('tenants');
  const [copiedDdl, setCopiedDdl] = useState(false);

  const ddlTables: Record<string, { title: string; desc: string; sql: string }> = {
    tenants: {
      title: '1. Tenants & Organizations',
      desc: 'Multi-tenant isolation with SLA warranty status and enterprise tier tiers.',
      sql: `CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tier VARCHAR(50) DEFAULT 'growth' CHECK (tier IN ('open-core', 'growth', 'enterprise-grid', 'sovereign-mesh')),
    sla_warranty_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
    api_keys: {
      title: '2. Zero-Knowledge API Keys',
      desc: 'Argon2id salted secret hashes with strictly scoped permission arrays.',
      sql: `CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    key_prefix VARCHAR(16) NOT NULL,
    hashed_secret VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    rate_limit_rpm INT DEFAULT 60000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
    monitored_providers: {
      title: '3. Monitored SaaS Providers',
      desc: 'Upstream vendor hosts (Stripe, Twilio, OpenAI) and contract health.',
      sql: `CREATE TABLE monitored_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL,
    target_host VARCHAR(255) NOT NULL,
    current_version VARCHAR(50) DEFAULT '2025-03-31.basil',
    last_health_status VARCHAR(50) DEFAULT 'healthy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
    pathogens: {
      title: '4. Detected Pathogens (Drift Events)',
      desc: 'Observed contract mutations, old/new structural shapes, and sunset dates.',
      sql: `CREATE TABLE pathogens (
    id VARCHAR(128) PRIMARY KEY,
    vendor VARCHAR(50) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    drift_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'WARNING', 'INFO')),
    description TEXT NOT NULL,
    old_shape JSONB NOT NULL,
    new_shape JSONB NOT NULL,
    mutation_vector JSONB,
    evidence_payload JSONB,
    sunset_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'ANTIBODY_GENERATED',
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
    antibodies: {
      title: '5. Synthesized Antibodies (AST Fixes)',
      desc: 'Compiler-verified code transformations, AST diffs, and verification proofs.',
      sql: `CREATE TABLE antibodies (
    id VARCHAR(128) PRIMARY KEY,
    pathogen_id VARCHAR(128) NOT NULL REFERENCES pathogens(id) ON DELETE CASCADE,
    vendor VARCHAR(50) NOT NULL,
    strategy VARCHAR(50) NOT NULL,
    target_file VARCHAR(255) NOT NULL,
    ast_diff TEXT NOT NULL,
    verification_status VARCHAR(50) NOT NULL,
    sandbox_latency_ms NUMERIC(8, 2),
    cryptographic_certificate VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
    pull_requests: {
      title: '6. Pull Requests & Human Review Gate',
      desc: 'Human-in-the-loop audit trail. Pull requests require human approval before merge.',
      sql: `CREATE TABLE pull_requests (
    id VARCHAR(128) PRIMARY KEY,
    pr_number INT NOT NULL,
    repository VARCHAR(255) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'MERGED', 'REJECTED')),
    reviewer_id VARCHAR(255),
    merged_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
    immune_logs: {
      title: '7. Tamper-Evident Immune Log',
      desc: 'Immutable append-only audit trail with zero secrets retained.',
      sql: `CREATE TABLE immune_logs (
    id VARCHAR(128) PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    vendor VARCHAR(50) NOT NULL,
    entity_id VARCHAR(128),
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
  };

  const nodeSpecs: Record<string, ActiveNodeDetail> = {
    sensorProxy: {
      stepNumber: 1,
      title: 'Sensor Proxy & Redactor',
      stageName: 'Stage 1: Capture & Redact',
      description: 'Zero-leak HTTP client wrapper / sidecar proxy. Intercepts outbound vendor calls within process memory before TLS encryption and after TLS response decryption. Redacts keys, tokens, and PII prior to logging.',
      metric: '< 1.0ms Local Inspection Overhead',
      technicalSpec: 'Node.js / Python in-memory fetch wrapper. Never mutates live payment traffic in-flight.',
      codeSnippet: `const shieldedFetch = createSensorClient({
  vendor: 'stripe',
  onCapture: async (event) => {
    redactor.sanitize(event);
    pathogenDetector.analyze(event);
  }
});
// Forward unmodified request to vendor endpoint
const response = await fetch(url, init);`,
    },
    pathogenDetector: {
      stepNumber: 2,
      title: 'Pathogen Detector',
      stageName: 'Stage 2: Drift Detection',
      description: 'Compares live responses against stored Zod / Pydantic schemas, parses RFC 8594 Sunset/Deprecation headers, and flags error spikes (400/404/422). Dispatches scheduled canary probes against vendor sandboxes.',
      metric: 'Instantaneous Schema Drift Detection',
      technicalSpec: 'Zod v3 schema validator + RFC 8594 parser. Emits structured PathogenEvent.',
      codeSnippet: `const headerCheck = adapter.parseDeprecationHeaders(headers);
if (headerCheck.isDeprecated) {
  emitPathogen({
    drift_type: 'SUNSET_HEADER',
    severity: 'WARNING',
    sunset_date: headers['sunset'],
    evidence: redactedResponse
  });
}`,
    },
    antibodyGenerator: {
      stepNumber: 3,
      title: 'Antibody Generator (AST)',
      stageName: 'Stage 3: Deterministic AST Fix',
      description: 'Refactors source code call sites using compiler AST traversal (ts-morph for TypeScript, LibCST for Python). Synthesizes deterministic diffs with zero generative LLM hallucinations.',
      metric: '0.0% LLM Hallucinations (Compiler Verified)',
      technicalSpec: 'TypeScript Compiler API (ts-morph) & Python LibCST. Generates unified git diff.',
      codeSnippet: `// Deterministic AST Property Assignment rename
sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAssignment)
  .forEach(prop => {
    if (prop.getName() === "customer_email") {
      prop.getNameNode().replaceWithText("email_address");
    }
  });
const unifiedDiff = createUnifiedDiff(original, modified);`,
    },
    sandboxVerifier: {
      stepNumber: 4,
      title: 'Isolated Container Sandbox',
      stageName: 'Stage 4: Ephemeral Verification',
      description: 'Executes proposed AST patch in an isolated Docker container / gVisor sandbox. Runs customer unit tests against vendor test mode (e.g. Stripe 2025-03-31.basil). Zero bare-metal KVM dependency.',
      metric: '3/3 Tests Passed in 2.29ms',
      technicalSpec: 'Docker / gVisor container sandbox. Verifies tests before opening PR.',
      codeSnippet: `// Ephemeral test execution in isolated runner
const verification = await sandbox.run({
  patch: antibody.ast_diff,
  testSuite: 'npm test',
  target: 'https://api.stripe.com/v1/payment_intents'
});
// Output: 3/3 Tests Passed | Ed25519 Cert Verified`,
    },
    humanApprovalGate: {
      stepNumber: 5,
      title: 'HUMAN APPROVAL GATE',
      stageName: 'Stage 5: Mandatory Human Review',
      isHumanGate: true,
      description: 'STRICT SECURITY FIREWALL: Prevents poisoned-fix supply-chain attacks. PR Bot opens a GitHub Pull Request with verified diff, drift evidence, and sandbox test results. An authorized human engineer MUST review and approve the PR before any code enters main.',
      metric: 'Human Sign-off Required • Zero Auto-Merge',
      technicalSpec: 'GitHub Pull Request review with branch protection rules and multi-party sign-off.',
      codeSnippet: `SAFETY POLICY:
1. Live traffic is NEVER modified without human sign-off.
2. Antibody diff is presented in GitHub PR #414.
3. Human SRE/CTO must approve & merge to main.
4. Auto-merge is strictly forbidden by policy.`,
    },
    immuneLogVault: {
      stepNumber: 6,
      title: 'Inoculation & Immune Log',
      stageName: 'Stage 6: Deploy & Audit',
      description: 'Upon human approval and merge, the antibody is signed with an Ed25519 attestation, deployed into production repository, and permanently recorded in the tamper-evident audit trail backed by PostgreSQL / SQLite WAL.',
      metric: 'Ed25519 Signed • Tamper-Evident Audit',
      technicalSpec: 'PostgreSQL 16 relational store / SQLite WAL mode with SHA-256 hash chains.',
      codeSnippet: `immuneLog.append('PR_MERGED', 'stripe', {
  pr_number: 414,
  reviewer: 'cto@enterprise.com',
  certificate: 'ed25519_cert_93fb6d_verified',
  repository: 'acme-corp/payment-service'
});`,
    },
  };

  const runPipelineTrace = async () => {
    if (isTracing) return;
    setIsTracing(true);
    setTraceLogs([]);

    const steps = [
      { key: 'sensorProxy', text: '[+0.2ms] Stage 1: Sensor Proxy intercepts outbound payment intent; redacts API keys and cards.' },
      { key: 'pathogenDetector', text: '[+1.8ms] Stage 2: Pathogen Detector catches parameter deprecation (RFC 8594 Sunset header).' },
      { key: 'antibodyGenerator', text: '[+12ms] Stage 3: Antibody Generator performs ts-morph AST surgery: customer_email ➔ email_address.' },
      { key: 'sandboxVerifier', text: '[+2.1s] Stage 4: Container Sandbox executes billing test suite against Stripe sandbox: 3/3 Passed.' },
      { key: 'humanApprovalGate', text: '[PAUSE] Stage 5: HUMAN APPROVAL GATE: PR #414 opened. Human review strictly required (Zero Auto-Merge).' },
      { key: 'immuneLogVault', text: '[APPROVED] Stage 6: Human CTO approves & merges PR. Ed25519 attestation logged to Immune Log.' },
    ];

    try {
      fetch('/api/pipeline/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'Stripe Payments', endpoint: 'stripe/v1/payment_intents' }),
      }).catch(() => {});
    } catch {}

    steps.forEach((step, index) => {
      setTimeout(() => {
        setHighlightedStep(step.key);
        setActiveNodeKey(step.key);
        setTraceLogs((prev) => [...prev, step.text]);

        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsTracing(false);
          }, 800);
        }
      }, index * 700);
    });
  };

  const activeNode = nodeSpecs[activeNodeKey] || nodeSpecs.sensorProxy;

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(ddlTables[activeDdlTab].sql);
    setCopiedDdl(true);
    setTimeout(() => setCopiedDdl(false), 2500);
  };

  return (
    <section id="system-architecture-map" className="py-24 bg-[#0B0B0C] text-white relative overflow-hidden font-sans border-b border-[#D4AF37]/30">
      {/* Background ambient gold glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-b from-[#D4AF37]/15 via-[#997D25]/10 to-transparent blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" /> Grounded System Topology
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-white">
            Autonomous Immune Architecture
          </h2>
          <p className="mt-4 text-white/70 text-base sm:text-lg leading-relaxed">
            From wire capture to human-approved code fix: the 6-stage lifecycle for third-party API resilience. Zero in-flight tampering, zero hallucinations, zero unapproved merges.
          </p>

          {/* View Mode Toggle */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              suppressHydrationWarning
              onClick={() => setViewMode('pipeline')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === 'pipeline'
                  ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>6-Stage Core Lifecycle Map</span>
            </button>

            <button
              suppressHydrationWarning
              onClick={() => setViewMode('storage')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === 'storage'
                  ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Unified Relational Schema (Postgres / SQLite)</span>
            </button>

            {viewMode === 'pipeline' && (
              <button
                suppressHydrationWarning
                onClick={runPipelineTrace}
                disabled={isTracing}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-[#F3E5AB] font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isTracing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                    <span>Executing Pipeline Trace...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                    <span>Run Interactive Lifecycle Trace</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* VIEW 1: 6-STAGE CORE LIFECYCLE MAP */}
        {viewMode === 'pipeline' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 6-Stage Clean Flow Diagram */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Row 1: Production Runtime Egress Plane */}
              <div className="p-5 rounded-3xl bg-[#121214] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-white/60">
                  <span className="font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    Layer 1: Outbound HTTP Telemetry &amp; Detection
                  </span>
                  <span>Safety Principle: Zero in-flight payload modification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Stage 1 */}
                  <button
                    suppressHydrationWarning
                    onClick={() => setActiveNodeKey('sensorProxy')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      activeNodeKey === 'sensorProxy' || highlightedStep === 'sensorProxy'
                        ? 'bg-[#1C1C1F] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]'
                        : 'bg-black/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37]">
                        STAGE 1
                      </span>
                      <span className="text-[10px] font-mono text-[#10B981]">&lt; 1ms Overhead</span>
                    </div>
                    <div className="font-heading font-black text-sm text-white">Sensor Proxy &amp; Redactor</div>
                    <p className="text-[11px] text-white/60 mt-1 leading-snug">
                      Inspects outbound vendor calls in-process. Redacts secrets &amp; tokens prior to storage.
                    </p>
                  </button>

                  {/* Stage 2 */}
                  <button
                    suppressHydrationWarning
                    onClick={() => setActiveNodeKey('pathogenDetector')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      activeNodeKey === 'pathogenDetector' || highlightedStep === 'pathogenDetector'
                        ? 'bg-[#1C1C1F] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]'
                        : 'bg-black/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37]">
                        STAGE 2
                      </span>
                      <span className="text-[10px] font-mono text-amber-400">RFC 8594 Sunset</span>
                    </div>
                    <div className="font-heading font-black text-sm text-white">Pathogen Detector</div>
                    <p className="text-[11px] text-white/60 mt-1 leading-snug">
                      Compares responses to Zod schemas. Flags 400/404/422 spikes &amp; scheduled canaries.
                    </p>
                  </button>
                </div>
              </div>

              {/* Connecting Step */}
              <div className="flex justify-center text-[#D4AF37]/60">
                <span className="text-xs font-mono">↓ Pathogen Event Dispatched to Control Plane ↓</span>
              </div>

              {/* Row 2: Control Plane (Synthesis & Sandbox Verification) */}
              <div className="p-5 rounded-3xl bg-[#141416] border border-[#D4AF37]/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-white/60">
                  <span className="font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    Layer 2: Deterministic AST Repair &amp; Container Isolation
                  </span>
                  <span>Zero LLM Hallucinations • ts-morph &amp; LibCST</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Stage 3 */}
                  <button
                    suppressHydrationWarning
                    onClick={() => setActiveNodeKey('antibodyGenerator')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      activeNodeKey === 'antibodyGenerator' || highlightedStep === 'antibodyGenerator'
                        ? 'bg-[#1C1C1F] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]'
                        : 'bg-black/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37]">
                        STAGE 3
                      </span>
                      <span className="text-[10px] font-mono text-blue-400">Deterministic AST</span>
                    </div>
                    <div className="font-heading font-black text-sm text-white">Antibody Generator</div>
                    <p className="text-[11px] text-white/60 mt-1 leading-snug">
                      Refactors syntax tree call sites deterministically. Generates unified git diff with compiler check.
                    </p>
                  </button>

                  {/* Stage 4 */}
                  <button
                    suppressHydrationWarning
                    onClick={() => setActiveNodeKey('sandboxVerifier')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      activeNodeKey === 'sandboxVerifier' || highlightedStep === 'sandboxVerifier'
                        ? 'bg-[#1C1C1F] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]'
                        : 'bg-black/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37]">
                        STAGE 4
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">Docker Sandbox</span>
                    </div>
                    <div className="font-heading font-black text-sm text-white">Sandbox Verifier</div>
                    <p className="text-[11px] text-white/60 mt-1 leading-snug">
                      Runs customer unit tests against vendor test mode in isolated container. Zero KVM requirement.
                    </p>
                  </button>
                </div>
              </div>

              {/* Connecting Step */}
              <div className="flex justify-center text-[#D4AF37]/60">
                <span className="text-xs font-mono">↓ Verified Patch Requires Human Governance ↓</span>
              </div>

              {/* Row 3: Security Governance & Human Approval Gate (Central Safeguard) */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-[#1E190B] via-[#141416] to-[#0E1B13] border-2 border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.2)] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#D4AF37]" />
                    Layer 3: Sovereign Human Approval Gate &amp; Audit Trail
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
                    ANTI-POISONING SECURITY FIREWALL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Stage 5: THE MANDATORY HUMAN GATE */}
                  <button
                    suppressHydrationWarning
                    onClick={() => setActiveNodeKey('humanApprovalGate')}
                    className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                      activeNodeKey === 'humanApprovalGate' || highlightedStep === 'humanApprovalGate'
                        ? 'bg-[#2A220E] border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] ring-2 ring-amber-400'
                        : 'bg-black/80 border-amber-500/50 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-amber-300" /> STAGE 5 • MANDATORY
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Human Review Gate</span>
                    </div>
                    <div className="font-heading font-black text-base text-amber-300 flex items-center gap-2">
                      <GitPullRequest className="w-4 h-4 text-amber-400" /> PR Bot &amp; Human Sign-off
                    </div>
                    <p className="text-[11px] text-amber-100/80 mt-1 leading-snug">
                      PR #414 created with unified diff. <strong>Human engineer must review and approve before merge.</strong> Zero unverified auto-merge.
                    </p>
                  </button>

                  {/* Stage 6: Inoculation & Immune Log */}
                  <button
                    suppressHydrationWarning
                    onClick={() => setActiveNodeKey('immuneLogVault')}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      activeNodeKey === 'immuneLogVault' || highlightedStep === 'immuneLogVault'
                        ? 'bg-[#1C1C1F] border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-[#10B981]'
                        : 'bg-black/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981]">
                        STAGE 6 • PRODUCTION
                      </span>
                      <span className="text-[10px] font-mono text-[#10B981] font-bold">PostgreSQL / SQLite</span>
                    </div>
                    <div className="font-heading font-black text-base text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#10B981]" /> Inoculation &amp; Immune Log
                    </div>
                    <p className="text-[11px] text-white/60 mt-1 leading-snug">
                      Merged code deployed. Signed with Ed25519 attestation and logged to tamper-evident audit trail.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Node Inspector & Live Trace Console */}
            <div className="lg:col-span-4 space-y-6">
              {/* Live Trace Logs */}
              <div className="p-5 rounded-3xl bg-[#141416] border border-[#D4AF37]/40 shadow-2xl font-mono text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[#D4AF37] font-bold flex items-center gap-1.5 text-[11px]">
                    <Activity className="w-3.5 h-3.5 text-[#10B981] animate-pulse" /> Lifecycle Audit Stream
                  </span>
                  <span className="text-white/40 text-[10px]">Real-Time Telemetry</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {traceLogs.length === 0 ? (
                    <div className="text-white/40 py-8 text-center text-[11px]">
                      Click &quot;Run Interactive Lifecycle Trace&quot; above to watch a contract drift flow through the 6 stages.
                    </div>
                  ) : (
                    traceLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`text-[11px] leading-relaxed p-2 rounded-xl border ${
                          log.includes('Stage 1')
                            ? 'text-emerald-300 bg-emerald-950/30 border-emerald-800/40'
                            : log.includes('Stage 2')
                            ? 'text-amber-300 bg-amber-950/30 border-amber-800/40'
                            : log.includes('Stage 3')
                            ? 'text-blue-300 bg-blue-950/30 border-blue-800/40'
                            : log.includes('Stage 4')
                            ? 'text-cyan-300 bg-cyan-950/30 border-cyan-800/40'
                            : log.includes('Stage 5')
                            ? 'text-amber-400 bg-amber-900/40 border-amber-500 font-bold ring-1 ring-amber-400'
                            : 'text-purple-300 bg-purple-950/30 border-purple-800/40 font-bold'
                        }`}
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Selected Stage Detail Inspector */}
              <div className={`p-6 rounded-3xl bg-gradient-to-b from-[#1C1C1F] to-[#0B0B0C] border shadow-2xl space-y-4 font-mono text-xs ${
                activeNode.isHumanGate ? 'border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'border-[#D4AF37]/50'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold">
                      {activeNode.stageName}
                    </span>
                    <h4 className="font-heading font-black text-sm text-white mt-0.5">
                      {activeNode.title}
                    </h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    activeNode.isHumanGate
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      : 'bg-[#10B981]/20 text-[#10B981]'
                  }`}>
                    {activeNode.metric}
                  </span>
                </div>

                <p className="text-white/70 text-[11px] leading-relaxed">
                  {activeNode.description}
                </p>

                <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] text-white/80">
                  <strong className="text-[#D4AF37] block mb-1">Architecture Specification:</strong>
                  {activeNode.technicalSpec}
                </div>

                <div>
                  <span className="text-[10px] text-white/40 block mb-1 uppercase">Executable Implementation Hook:</span>
                  <pre className="p-3 rounded-xl bg-black border border-white/10 text-[10px] text-[#F3E5AB] overflow-x-auto leading-relaxed">
                    {activeNode.codeSnippet}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: UNIFIED RELATIONAL SCHEMA (POSTGRESQL / SQLITE) */
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-black/90 border border-[#D4AF37]/40 shadow-2xl font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold text-[#D4AF37] uppercase tracking-wider text-sm">
                    IMMUNIX RELATIONAL STORAGE SPECIFICATION (PostgreSQL 16 &amp; SQLite WAL)
                  </span>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-500/20 text-[#10B981] font-bold">
                  SINGLE SOURCE OF TRUTH
                </span>
              </div>

              <p className="text-white/70 text-xs leading-relaxed">
                Clean relational architecture: PostgreSQL is the single primary store in production, backed by embedded SQLite WAL mode for local zero-dependency development. Telemetry and audit trails are structured and tamper-evident.
              </p>

              {/* DDL Table Selector Tabs */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                {Object.entries(ddlTables).map(([key, item]) => (
                  <button
                    key={key}
                    suppressHydrationWarning
                    onClick={() => setActiveDdlTab(key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      activeDdlTab === key
                        ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                        : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {/* SQL Code Preview Card */}
              <div className="relative mt-4">
                <div className="flex items-center justify-between p-3 rounded-t-2xl bg-[#1C1C1F] border-t border-x border-white/10 text-white/70">
                  <span className="text-xs font-bold text-[#D4AF37]">{ddlTables[activeDdlTab].desc}</span>
                  <button
                    suppressHydrationWarning
                    onClick={handleCopyDdl}
                    className="px-3 py-1 rounded-lg bg-black text-[#D4AF37] hover:text-white text-[11px] border border-[#D4AF37]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedDdl ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedDdl ? 'Copied' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="p-5 rounded-b-2xl bg-black border border-white/10 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
                  {ddlTables[activeDdlTab].sql}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
