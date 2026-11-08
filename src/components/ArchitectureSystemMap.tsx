'use client';

import React, { useState } from 'react';
import {
  Layers,
  Activity,
  Play,
  RefreshCw,
  Database,
  Check,
  Copy,
  Shield,
  UserCheck,
  Lock,
  Cpu,
  Clock,
  Server,
  Radio,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface ActiveNodeDetail {
  id: string;
  stepNumber: number;
  title: string;
  layerName: string;
  description: string;
  metric: string;
  technicalSpec: string;
  codeSnippet: string;
  isHumanGate?: boolean;
}

export default function ArchitectureSystemMap() {
  const [activeTab, setActiveTab] = useState<'topology' | 'sequence' | 'storage' | 'benchmarks'>('topology');
  const [pathSelection, setPathSelection] = useState<'pathA' | 'pathB'>('pathA');
  const [activeNodeKey, setActiveNodeKey] = useState<string>('envoyL7');
  const [isTracing, setIsTracing] = useState(false);
  const [highlightedStep, setHighlightedStep] = useState<string | null>(null);
  const [traceLogs, setTraceLogs] = useState<string[]>([]);
  const [activeDdlTab, setActiveDdlTab] = useState<string>('tenants');
  const [copiedDdl, setCopiedDdl] = useState(false);

  // Storage DDL Specifications (PostgreSQL 16 & ClickHouse & SQLite)
  const ddlTables: Record<string, { title: string; tier: string; desc: string; sql: string }> = {
    tenants: {
      title: '1. Tenants & Orgs',
      tier: 'Central PostgreSQL 16',
      desc: 'Multi-tenant isolation with SLA warranty status and enterprise quota configurations.',
      sql: `CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tier VARCHAR(50) DEFAULT 'growth' CHECK (tier IN ('open-core', 'growth', 'enterprise-grid', 'sovereign-mesh')),
    sla_warranty_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
    monitored_providers: {
      title: '2. Upstream Providers',
      tier: 'Central PostgreSQL 16',
      desc: 'Upstream vendor hosts (Stripe, Twilio, OpenAI) and target contract versions.',
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
      title: '3. Pathogens (Drift Events)',
      tier: 'Central PostgreSQL 16',
      desc: 'Observed contract mutations, old/new structural shapes, and RFC 8594 sunset dates.',
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
      title: '4. Antibodies (AST Rules)',
      tier: 'Central PostgreSQL 16 & Edge SQLite',
      desc: 'Compiler-verified code transformations, AST diffs, and cryptographic attestations.',
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
      title: '5. Pull Requests & Human Gate',
      tier: 'Central PostgreSQL 16',
      desc: 'Human-in-the-loop audit log. Requires human review and explicit sign-off before merge.',
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
    clickhouse_telemetry: {
      title: '6. ClickHouse High-Volume Lake',
      tier: 'ClickHouse Telemetry Lake',
      desc: 'High-throughput append-only engine for raw eBPF TCP socket metrics and RFC 7807 failure frames.',
      sql: `CREATE TABLE telemetry_frames (
    timestamp DateTime64(6, 'UTC'),
    cluster_id LowCardinality(String),
    vendor LowCardinality(String),
    endpoint String,
    http_status UInt16,
    tcp_latency_us UInt32,
    envoy_wasm_overhead_us UInt32,
    rfc7807_error_code LowCardinality(String),
    redacted_trace_id UUID
) ENGINE = MergeTree()
ORDER BY (vendor, http_status, timestamp);`,
    },
  };

  // Node Specifications for Interactive Inspector
  const nodeSpecs: Record<string, ActiveNodeDetail> = {
    consumerApp: {
      id: 'consumerApp',
      stepNumber: 1,
      title: 'Host Application & @immunix/sensor',
      layerName: '1. Host Application with @immunix/sensor',
      description: 'Customer application runtime wrapped by @immunix/sensor with an integrated Fail-Open Circuit Breaker. Strips all customer secrets client-side via extractRedactedShape() and guarantees zero application blocking (< 2ms p99 overhead).',
      metric: '< 2ms Fail-Open Budget (P99 Overhead)',
      technicalSpec: 'Node.js / Python in-process SDK wrapper with fail-open circuit breaker and client-side PII shredder.',
      codeSnippet: `// In-process sensor wrapper with Fail-Open Circuit Breaker
const fetchClient = createSensorClient({
  vendor: 'stripe',
  activeAntibodies: [stripePreflightRule],
});
// Automatically applies pre-flight AST rewrite in < 2ms before network dispatch
const res = await fetchClient('https://api.stripe.com/v1/payment_intents', {
  method: 'POST',
  body: JSON.stringify({ source: 'tok_visa', amount: 2000 }),
});`,
    },
    envoyL7: {
      id: 'envoyL7',
      stepNumber: 2,
      title: 'Envoy L7 WASM Filter Proxy',
      layerName: '2. Data Plane (Envoy L7 Proxy)',
      description: 'L7 Reverse Proxy & WebAssembly execution engine operating strictly in-process AFTER client TLS termination and BEFORE outbound TLS encryption. Evaluates active in-memory antibody catalog for pre-flight payload rewrites (< 50µs overhead).',
      metric: '42µs – 75µs In-Memory Pre-Flight Rewrite',
      technicalSpec: 'Rust-compiled WebAssembly filter embedded in Envoy Proxy (proxy-wasm ABI). Inspects request body and rewrites deprecated parameters before upstream TLS wrapping.',
      codeSnippet: `// proxy-wasm Rust filter hook executing in Envoy worker thread
fn on_http_request_body(&mut self, body_size: usize, end_of_stream: bool) -> Action {
    if let Some(antibody) = self.wasm_catalog.lookup(&self.upstream_host, &self.path) {
        let transformed = antibody.apply_ast_patch(&self.buffer);
        self.set_http_request_body(0, transformed.len(), &transformed);
        // Pre-flight rewrite complete in 42µs. Forward directly to upstream.
    }
    Action::Continue
}`,
    },
    ebpfL4: {
      id: 'ebpfL4',
      stepNumber: 3,
      title: 'eBPF Socket Ring-Buffer Telemetry',
      layerName: '2. Data Plane (eBPF L4 Observability)',
      description: 'Strictly L4 kernel observability using kprobe/tcp_v4_rcv and sock_sendmsg. Streams zero-copy socket telemetry, TCP RTT, and byte counters directly into ring-buffer. Zero packet modification or TLS payload tampering in kernel space.',
      metric: '8µs Kernel Telemetry Overhead (Zero Payload Mutation)',
      technicalSpec: 'Linux BPF CO-RE (Compile Once – Run Everywhere) program attached to kprobe/tcp_v4_rcv. Emits L4 flow metrics to user-space daemon.',
      codeSnippet: `SEC("kprobe/tcp_v4_rcv")
int BPF_KPROBE(trace_tcp_v4_rcv, struct sk_buff *skb) {
    u64 ts = bpf_ktime_get_ns();
    struct flow_event_t event = { .ts = ts, .len = skb->len };
    bpf_ringbuf_output(&flow_events, &event, sizeof(event), 0);
    return 0; // Strictly passive L4 telemetry; never mutates ciphertext
}`,
    },
    upstreamSaaS: {
      id: 'upstreamSaaS',
      stepNumber: 4,
      title: 'Upstream SaaS Providers (TLS Egress)',
      layerName: '3. Upstream SaaS APIs',
      description: 'Upstream vendor APIs (e.g., Stripe Payments schema 2025-03-31.basil). In Path A, receives pre-flight patched request and returns HTTP 200 OK directly. In Path B (cold-start), rejects deprecated schema with HTTP 400 Bad Request.',
      metric: 'Realistic Stripe Version: 2025-03-31.basil',
      technicalSpec: 'Encrypted TLS 1.3 egress channel with mutual certificate verification. Enforces strict schema validations upstream.',
      codeSnippet: `HTTP/1.1 400 Bad Request
Content-Type: application/problem+json
{
  "type": "https://stripe.com/docs/error-codes/parameter-deprecated",
  "title": "Deprecated Parameter",
  "detail": "Parameter 'source' was sunset on 2025-03-31. Use 'payment_method' instead.",
  "code": "parameter_deprecated"
}`,
    },
    controlPlaneDiffer: {
      id: 'controlPlaneDiffer',
      stepNumber: 5,
      title: 'Deterministic RFC 7807 & OpenAPI Differ',
      layerName: '4. Central Control Plane (Tier 1)',
      description: 'Tier 1 Deterministic Engine: Parses RFC 7807 Problem Details and performs structural AST diffing against OpenAPI v3.1 contracts. Handles 95% of field rename and deprecation events with zero machine learning dependencies.',
      metric: '0.0% LLM Hallucinations (Deterministic Differ)',
      technicalSpec: 'FastAPI / Python AST analyzer matching RFC 7807 error vectors against OpenAPI component schemas.',
      codeSnippet: `def diff_rfc7807_error(error_payload: dict, schema: dict) -> DiffResult:
    problem = RFC7807Problem.parse_obj(error_payload)
    deprecated_field = problem.extract_culprit_field() # 'source'
    replacement_field = schema.resolve_replacement(deprecated_field) # 'payment_method'
    return DiffResult(strategy="RENAME_FIELD", old=deprecated_field, new=replacement_field)`,
    },
    astSurgeon: {
      id: 'astSurgeon',
      stepNumber: 6,
      title: 'Compiler AST Engine (ts-morph / LibCST)',
      layerName: '4. Central Control Plane (AST Synthesis)',
      description: 'Performs syntax tree code surgery on client repositories using ts-morph (TypeScript) and LibCST (Python). Synthesizes compiler-verified unified diffs with exact line-and-column attribution.',
      metric: 'Deterministic Code Refactoring',
      technicalSpec: 'TypeScript Compiler API & LibCST CST Visitor. Produces valid unified git diff patches.',
      codeSnippet: `sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAssignment).forEach(prop => {
  if (prop.getName() === "source") {
    prop.getNameNode().replaceWithText("payment_method");
  }
});
const patch = createUnifiedDiff(originalSource, sourceFile.getFullText());`,
    },
    ephemeralSandbox: {
      id: 'ephemeralSandbox',
      stepNumber: 7,
      title: 'Ephemeral Staging Sandbox Probe',
      layerName: '4. Central Control Plane (Sandbox Runner)',
      description: 'Spawns an isolated container sandbox (Docker / gVisor) to execute customer unit tests and synthetic canary probes against real vendor staging environments. Verifies fix before PR generation.',
      metric: '65ms – 180ms Live Sandbox Probe Latency',
      technicalSpec: 'Ephemeral container sandbox with cgroup v2 resource limits and network isolation.',
      codeSnippet: `// Ephemeral Sandbox Execution Log
[SANDBOX] Container c-9921b spawned in 4.8ms
[SANDBOX] Applying AST patch to /services/billing.ts... OK
[SANDBOX] Executing test suite against Stripe 2025-03-31.basil staging...
[SANDBOX] PASS: test_create_payment_intent (84ms)
[SANDBOX] 3/3 Tests Passed | Verification Status: VERIFIED`,
    },
    humanApprovalGate: {
      id: 'humanApprovalGate',
      stepNumber: 8,
      title: 'SRE / Human Review & Merge Gate',
      layerName: '4. Mandatory Security Governance Gate',
      isHumanGate: true,
      description: 'CRITICAL SECURITY DEFENSE: Prevents poisoned-fix supply chain vulnerabilities. Pull request is held open until a human SRE or CTO inspects the AST diff, reviews sandbox proofs, and explicitly executes the merge action.',
      metric: 'Human Sign-Off Required • Zero Auto-Merge',
      technicalSpec: 'GitHub PR #412 with protected branch rules, required multi-party signatures, and mandatory human review.',
      codeSnippet: `MANDATORY SECURITY INVARIANT:
- PR #412 cannot be merged programmatically.
- Human SRE must inspect diff & sandbox proof.
- Signed attestation generated ONLY upon human merge.
- Unapproved fixes are NEVER broadcasted to mesh.`,
    },
    hsmKmsSigner: {
      id: 'hsmKmsSigner',
      stepNumber: 9,
      title: 'Enterprise KMS / HSM Ed25519 Root Key',
      layerName: '4. Hardware Security Module Signer',
      description: 'Upon human merge approval, the release pipeline invokes Enterprise KMS / HSM (FIPS 140-3 Level 3) to sign the compiled vaccine bytecode with the organizations Ed25519 root private key.',
      metric: 'Ed25519 FIPS 140-3 Cryptographic Attestation',
      technicalSpec: 'Hardware Security Module signing service. Emits verifiable cryptographic signature for vaccine bytecode.',
      codeSnippet: `const signature = await enterpriseHsm.sign({
  keyId: 'kms/prod/ed25519-root',
  algorithm: 'Ed25519',
  payload: vaccineBytecodeHash,
});
// Emits: ed25519_sig_99fa772b... Attached to gossip payload`,
    },
    tokyoQuarantine: {
      id: 'tokyoQuarantine',
      stepNumber: 10,
      title: 'Remote Tokyo Node: 60s Quarantine Sandbox',
      layerName: '5. Global Herd Mesh (Zero-Trust Consensus)',
      description: 'Remote nodes (e.g., Tokyo cluster ap-ne-1) receive signed bytecode via peer-to-peer gossip, but DO NOT blindly trust it. The node quarantines bytecode for 60s, executes a local smoke-test probe against a synthetic canary, and only promotes to active Envoy WASM memory upon 100% pass.',
      metric: 'Zero-Trust Quarantine • 60s Local Canary Verification',
      technicalSpec: 'Local quarantine runner verifying Ed25519 signature and executing local mock probe before promotion.',
      codeSnippet: `// Remote Tokyo Node Quarantine Logic
const isSigValid = ed25519.verify(rootPublicKey, payload, signature);
if (isSigValid) {
  quarantineSandbox.load(payload);
  const smokePassed = await quarantineSandbox.runSmokeTest();
  if (smokePassed) {
    envoyWasmCatalog.promote(payload.antibodyId);
    console.log('[MESH] Tokyo cluster pre-emptively inoculated!');
  }
}`,
    },
  };

  const runPipelineTrace = async () => {
    if (isTracing) return;
    setIsTracing(true);
    setTraceLogs([]);

    if (pathSelection === 'pathA') {
      const stepsA = [
        { key: 'consumerApp', text: '[T+0.00ms] Downstream Consumer App dispatches POST /v1/charges (source="tok_visa") to local Envoy sidecar.' },
        { key: 'envoyL7', text: '[T+0.04ms] Envoy L7 WASM Filter matches active antibody in memory (< 50µs). Pre-flight AST rewrite: source ➔ payment_method.' },
        { key: 'upstreamSaaS', text: '[T+42.1ms] Stripe Payments (2025-03-31.basil) receives valid schema. Returns HTTP 200 OK directly on 1st roundtrip.' },
        { key: 'consumerApp', text: '[T+42.2ms] Consumer App receives HTTP 200 OK. Added latency: 42µs. Zero downtime!' },
      ];

      stepsA.forEach((step, index) => {
        setTimeout(() => {
          setHighlightedStep(step.key);
          setActiveNodeKey(step.key);
          setTraceLogs((prev) => [...prev, step.text]);

          if (index === stepsA.length - 1) {
            setTimeout(() => {
              setIsTracing(false);
            }, 800);
          }
        }, index * 800);
      });
    } else {
      const stepsB = [
        { key: 'consumerApp', text: '[T+0.00ms] Consumer App dispatches POST /v1/charges (source="tok_visa").' },
        { key: 'envoyL7', text: '[T+0.05ms] Envoy L7 Proxy checks catalog: No active antibody (Cold-Start Outage). Forwards unmodified payload.' },
        { key: 'upstreamSaaS', text: '[T+48.3ms] Stripe API returns HTTP 400 Bad Request ("Parameter source is deprecated", 2025-03-31.basil).' },
        { key: 'consumerApp', text: '[T+48.5ms] Envoy captures RFC 7807 error. Client receives 400 (or circuit breaker fallback).' },
        { key: 'controlPlaneDiffer', text: '[T+54.0ms] Async Control Plane: Tier 1 Deterministic OpenAPI / JSON Schema Differ pinpoints drift vector.' },
        { key: 'astSurgeon', text: '[T+72.0ms] ts-morph AST Engine refactors client syntax tree call sites deterministically.' },
        { key: 'ephemeralSandbox', text: '[T+168.0ms] Ephemeral Staging Sandbox Probe runs billing test suite against Stripe sandbox: 3/3 Passed (94ms).' },
        { key: 'humanApprovalGate', text: '[PAUSE] MANDATORY HUMAN GATE: PR #412 opened. Awaiting Human SRE / CTO Review & Merge.' },
        { key: 'hsmKmsSigner', text: '[APPROVED] SRE merges PR. Enterprise KMS/HSM Ed25519 Root Key signs vaccine bytecode.' },
        { key: 'tokyoQuarantine', text: '[MESH] Gossip bus broadcasts signed bytecode. Tokyo node runs 60s Quarantine Sandbox probe. PASS ➔ Inoculated!' },
      ];

      stepsB.forEach((step, index) => {
        setTimeout(() => {
          setHighlightedStep(step.key);
          setActiveNodeKey(step.key);
          setTraceLogs((prev) => [...prev, step.text]);

          if (index === stepsB.length - 1) {
            setTimeout(() => {
              setIsTracing(false);
            }, 900);
          }
        }, index * 750);
      });
    }
  };

  const activeNode = nodeSpecs[activeNodeKey] || nodeSpecs.envoyL7;

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(ddlTables[activeDdlTab].sql);
    setCopiedDdl(true);
    setTimeout(() => setCopiedDdl(false), 2500);
  };

  return (
    <section id="system-architecture-map" className="py-24 bg-[#0B0B0C] text-white relative overflow-hidden font-sans border-b border-[#D4AF37]/30">
      {/* Background ambient gold glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#D4AF37]/15 via-[#997D25]/10 to-transparent blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" /> Production-Grade Distributed Systems Topology
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-white">
            Autonomous Software Immune Architecture
          </h2>
          <p className="mt-4 text-white/70 text-base sm:text-lg leading-relaxed">
            The definitive architecture resolving eBPF L4 vs Envoy L7 payload boundaries, eliminating cold-start fallacies with a strict two-path lifecycle, and establishing zero-trust quarantine verification.
          </p>

          {/* Top-Level Navigation Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              suppressHydrationWarning
              onClick={() => setActiveTab('topology')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'topology'
                  ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Topology (Path A &amp; B)</span>
            </button>

            <button
              suppressHydrationWarning
              onClick={() => setActiveTab('sequence')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'sequence'
                  ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>End-to-End Sequence Diagram</span>
            </button>

            <button
              suppressHydrationWarning
              onClick={() => setActiveTab('storage')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'storage'
                  ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Three-Tier Storage Architecture</span>
            </button>

            <button
              suppressHydrationWarning
              onClick={() => setActiveTab('benchmarks')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'benchmarks'
                  ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Realistic Performance Bounds</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE TOPOLOGY MAP (PATH A & PATH B) */}
        {activeTab === 'topology' && (
          <div className="space-y-8">
            {/* Two-Path Operational Switcher */}
            <div className="p-4 rounded-2xl bg-[#141416] border border-[#D4AF37]/40 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-white/70 uppercase tracking-wider">
                  Operational Execution Path:
                </span>
                <div className="inline-flex rounded-xl p-1 bg-black/60 border border-white/10">
                  <button
                    suppressHydrationWarning
                    onClick={() => setPathSelection('pathA')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      pathSelection === 'pathA'
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>PATH A: Known Pathogen (&lt; 50µs Pre-Flight)</span>
                  </button>
                  <button
                    suppressHydrationWarning
                    onClick={() => setPathSelection('pathB')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      pathSelection === 'pathB'
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>PATH B: Cold-Start Outage &amp; Adaptive Loop</span>
                  </button>
                </div>
              </div>

              <button
                suppressHydrationWarning
                onClick={runPipelineTrace}
                disabled={isTracing}
                className="px-5 py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/60 text-[#F3E5AB] font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isTracing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                    <span>Executing Path Simulation...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                    <span>Simulate {pathSelection === 'pathA' ? 'Path A (Pre-Flight)' : 'Path B (Cold-Start)'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Main Interactive Topology Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Visual Architecture Flow */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* 1. CONSUMER MICROSERVICE ENVIRONMENT */}
                <div className="p-4 sm:p-5 rounded-3xl bg-[#121214] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-white/60">
                    <span className="font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-[#D4AF37]" />
                      1. Consumer Microservice Environment
                    </span>
                    <span className="text-[11px] text-white/50">Plaintext Pre-TLS Egress</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      suppressHydrationWarning
                      onClick={() => setActiveNodeKey('consumerApp')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        activeNodeKey === 'consumerApp' || highlightedStep === 'consumerApp'
                          ? 'bg-[#1C1C1F] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]'
                          : 'bg-black/60 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">NODE / PYTHON / GO APP</div>
                      <div className="font-heading font-black text-sm text-white">Downstream Consumer App</div>
                      <p className="text-[11px] text-white/60 mt-1">
                        Emits outbound API calls via co-located Envoy sidecar proxy.
                      </p>
                    </button>

                    <div className="p-3.5 rounded-2xl border border-dashed border-white/20 bg-black/40 flex flex-col justify-center">
                      <span className="text-[10px] font-mono text-white/40 uppercase">Egress Payload Vector:</span>
                      <code className="text-xs font-mono text-amber-300 mt-1">POST /v1/charges &#123; source: &quot;tok_visa&quot; &#125;</code>
                    </div>
                  </div>
                </div>

                {/* Arrow down */}
                <div className="flex justify-center text-[#D4AF37]/60">
                  <span className="text-xs font-mono">↓ Plaintext HTTP Egress Hand-off ↓</span>
                </div>

                {/* 2. DATA PLANE (ENVOY L7 PROXY + eBPF L4 OBSERVABILITY) */}
                <div className="p-5 rounded-3xl bg-[#141416] border-2 border-[#D4AF37]/50 shadow-xl space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#D4AF37]" />
                      2. Data Plane (Envoy L7 Proxy + eBPF L4 Observability)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      AFTER Client TLS • BEFORE Egress TLS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Envoy L7 Proxy */}
                    <button
                      suppressHydrationWarning
                      onClick={() => setActiveNodeKey('envoyL7')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        activeNodeKey === 'envoyL7' || highlightedStep === 'envoyL7'
                          ? 'bg-[#1C1C1F] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] ring-1 ring-[#D4AF37]'
                          : 'bg-black/80 border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37]">
                          L7 WASM FILTER
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">&lt; 50µs Overhead</span>
                      </div>
                      <div className="font-heading font-black text-sm text-white">Envoy L7 Sidecar / Gateway</div>
                      <p className="text-[11px] text-white/60 mt-1">
                        In-process AST payload rewriting in Rust WASM filter. Matches memory catalog.
                      </p>
                    </button>

                    {/* eBPF L4 Metrics */}
                    <button
                      suppressHydrationWarning
                      onClick={() => setActiveNodeKey('ebpfL4')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        activeNodeKey === 'ebpfL4' || highlightedStep === 'ebpfL4'
                          ? 'bg-[#1C1C1F] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] ring-1 ring-[#D4AF37]'
                          : 'bg-black/80 border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                          L4 SOCKET TELEMETRY
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300 font-bold">8µs Kernel Telemetry</span>
                      </div>
                      <div className="font-heading font-black text-sm text-white">eBPF Socket Ring-Buffer</div>
                      <p className="text-[11px] text-white/60 mt-1">
                        Strictly L4 TCP metrics via kprobe/tcp_v4_rcv. Zero payload tampering.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Arrow to Upstream */}
                <div className="flex justify-center text-[#D4AF37]/60">
                  <span className="text-xs font-mono">↓ Egress TLS Handshake (api.stripe.com) ↓</span>
                </div>

                {/* 3. UPSTREAM SAAS PROVIDERS */}
                <div className="p-4 sm:p-5 rounded-3xl bg-[#121214] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-white/60">
                    <span className="font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-[#D4AF37]" />
                      3. Upstream SaaS Providers (TLS Egress)
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono">Stripe 2025-03-31.basil</span>
                  </div>

                  <button
                    suppressHydrationWarning
                    onClick={() => setActiveNodeKey('upstreamSaaS')}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      activeNodeKey === 'upstreamSaaS' || highlightedStep === 'upstreamSaaS'
                        ? 'bg-[#1C1C1F] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]'
                        : 'bg-black/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-heading font-black text-sm text-white">
                        Stripe Payments API (2025-03-31.basil Breaking Contract)
                      </div>
                      <span className="text-[10px] font-mono text-white/50">api.stripe.com</span>
                    </div>
                    <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed">
                      {pathSelection === 'pathA' ? (
                        <span className="text-emerald-400 font-medium">
                          ✓ Path A Active: Received pre-flight rewritten payment_method parameter. Returns HTTP 200 OK directly on 1st roundtrip!
                        </span>
                      ) : (
                        <span className="text-amber-400 font-medium">
                          ⚠ Path B Active: Received deprecated source parameter on cold start. Rejects with HTTP 400 Bad Request. Async self-healing triggered.
                        </span>
                      )}
                    </p>
                  </button>
                </div>

                {/* PATH B ASYNC CONTROL PLANE SECTION */}
                {pathSelection === 'pathB' && (
                  <>
                    <div className="flex justify-center text-[#D4AF37]">
                      <span className="text-xs font-mono font-bold animate-pulse">
                        ⚡ Outbound 400 Caught ➔ Streaming RFC 7807 Error to Central Control Plane ⚡
                      </span>
                    </div>

                    {/* 4. CENTRAL CONTROL PLANE */}
                    <div className="p-5 rounded-3xl bg-gradient-to-b from-[#161414] to-[#121214] border-2 border-amber-500/60 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-amber-400" />
                          4. Central Control Plane (Adaptive Immunity &amp; AST Engine)
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          Postgres 16 + ClickHouse Lake
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          suppressHydrationWarning
                          onClick={() => setActiveNodeKey('controlPlaneDiffer')}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            activeNodeKey === 'controlPlaneDiffer' || highlightedStep === 'controlPlaneDiffer'
                              ? 'bg-[#1C1C1F] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                              : 'bg-black/60 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="text-[10px] font-mono text-blue-400 font-bold mb-1">TIER 1 DIFFER</div>
                          <div className="font-heading font-black text-xs text-white">Deterministic OpenAPI Differ</div>
                          <p className="text-[10px] text-white/60 mt-1">Parses RFC 7807 details; resolves replacement fields.</p>
                        </button>

                        <button
                          suppressHydrationWarning
                          onClick={() => setActiveNodeKey('astSurgeon')}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            activeNodeKey === 'astSurgeon' || highlightedStep === 'astSurgeon'
                              ? 'bg-[#1C1C1F] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                              : 'bg-black/60 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="text-[10px] font-mono text-purple-400 font-bold mb-1">AST ENGINE</div>
                          <div className="font-heading font-black text-xs text-white">ts-morph &amp; LibCST</div>
                          <p className="text-[10px] text-white/60 mt-1">Deterministic code surgery. Generates unified diff.</p>
                        </button>

                        <button
                          suppressHydrationWarning
                          onClick={() => setActiveNodeKey('ephemeralSandbox')}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            activeNodeKey === 'ephemeralSandbox' || highlightedStep === 'ephemeralSandbox'
                              ? 'bg-[#1C1C1F] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                              : 'bg-black/60 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">SANDBOX PROBE</div>
                          <div className="font-heading font-black text-xs text-white">Ephemeral Staging Test</div>
                          <p className="text-[10px] text-white/60 mt-1">Runs customer tests against real vendor staging (65ms-180ms).</p>
                        </button>
                      </div>

                      {/* MANDATORY HUMAN REVIEW GATE */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2A220E] via-[#1E190B] to-[#141416] border-2 border-amber-400 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-amber-400" />
                            CRITICAL SECURITY FIREWALL: SRE HUMAN APPROVAL GATE
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                            ZERO AUTO-MERGE
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <button
                            suppressHydrationWarning
                            onClick={() => setActiveNodeKey('humanApprovalGate')}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              activeNodeKey === 'humanApprovalGate' || highlightedStep === 'humanApprovalGate'
                                ? 'bg-amber-950/60 border-amber-400 ring-1 ring-amber-400'
                                : 'bg-black/70 border-amber-500/30 hover:border-amber-400'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-heading font-black text-xs text-amber-200">
                              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                              GitHub PR #412 Review &amp; Sign-off
                            </div>
                            <p className="text-[10px] text-amber-100/70 mt-1">
                              Human SRE inspects diff &amp; sandbox test results. Must approve before merge.
                            </p>
                          </button>

                          <button
                            suppressHydrationWarning
                            onClick={() => setActiveNodeKey('hsmKmsSigner')}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              activeNodeKey === 'hsmKmsSigner' || highlightedStep === 'hsmKmsSigner'
                                ? 'bg-[#1C1C1F] border-[#10B981] ring-1 ring-[#10B981]'
                                : 'bg-black/70 border-white/20 hover:border-white/40'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-heading font-black text-xs text-white">
                              <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                              Enterprise KMS/HSM Ed25519 Signer
                            </div>
                            <p className="text-[10px] text-white/60 mt-1">
                              Signs vaccine bytecode upon human approval. Emits root attestation.
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 5. GLOBAL HERD MESH (ZERO-TRUST CONSENSUS) */}
                    <div className="p-5 rounded-3xl bg-[#121214] border border-[#D4AF37]/40 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-white/60">
                        <span className="font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                          <Radio className="w-3.5 h-3.5 text-[#D4AF37]" />
                          5. Global Herd Mesh (Zero-Trust Consensus)
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">P2P Gossip Bus</span>
                      </div>

                      <button
                        suppressHydrationWarning
                        onClick={() => setActiveNodeKey('tokyoQuarantine')}
                        className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          activeNodeKey === 'tokyoQuarantine' || highlightedStep === 'tokyoQuarantine'
                            ? 'bg-[#1C1C1F] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]'
                            : 'bg-black/60 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-purple-400 font-bold">
                            REMOTE TOKYO CLUSTER (ap-ne-1)
                          </span>
                          <span className="text-[10px] font-mono text-[#10B981] font-bold">
                            Local Smoke-Test PASSED
                          </span>
                        </div>
                        <div className="font-heading font-black text-sm text-white">
                          60-Second Zero-Trust Quarantine Sandbox
                        </div>
                        <p className="text-[11px] text-white/60 mt-1">
                          Remote nodes never blindly trust signed bytecode. They execute a local 60s quarantine smoke test against a synthetic canary before promoting to in-memory Envoy WASM catalog.
                        </p>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Right Column: Node Inspector & Live Trace Console */}
              <div className="lg:col-span-4 space-y-6">
                {/* Live Trace Logs */}
                <div className="p-5 rounded-3xl bg-[#141416] border border-[#D4AF37]/40 shadow-2xl font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[#D4AF37] font-bold flex items-center gap-1.5 text-[11px]">
                      <Activity className="w-3.5 h-3.5 text-[#10B981] animate-pulse" /> Live Execution Stream
                    </span>
                    <span className="text-white/40 text-[10px]">Deterministic Telemetry</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {traceLogs.length === 0 ? (
                      <div className="text-white/40 py-8 text-center text-[11px]">
                        Click &quot;Simulate {pathSelection === 'pathA' ? 'Path A' : 'Path B'}&quot; above to watch the lifecycle execute step-by-step.
                      </div>
                    ) : (
                      traceLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className={`text-[11px] leading-relaxed p-2.5 rounded-xl border ${
                            log.includes('PATH A') || log.includes('Path A') || log.includes('200 OK')
                              ? 'text-emerald-300 bg-emerald-950/40 border-emerald-800/50'
                              : log.includes('MANDATORY HUMAN GATE') || log.includes('PAUSE')
                              ? 'text-amber-400 bg-amber-950/60 border-amber-500 font-bold ring-1 ring-amber-400'
                              : log.includes('Cold-Start') || log.includes('400')
                              ? 'text-amber-300 bg-amber-950/40 border-amber-800/50'
                              : 'text-purple-300 bg-purple-950/40 border-purple-800/40'
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
                  activeNode.isHumanGate ? 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] ring-1 ring-amber-400' : 'border-[#D4AF37]/50'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold">
                        {activeNode.layerName}
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
          </div>
        )}

        {/* TAB 2: END-TO-END SEQUENCE DIAGRAM (MATCHING ARCHITECTURE SPEC) */}
        {activeTab === 'sequence' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-black/90 border border-[#D4AF37]/40 shadow-2xl font-mono text-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                    Definitive Distributed Sequence Flow
                  </span>
                  <h3 className="font-heading font-black text-xl text-white mt-1">
                    Path A vs Path B End-to-End Sequence Lifecycle
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-[#10B981] font-bold text-[10px]">
                    PATH A: 42µs Added Latency
                  </span>
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                    PATH B: Zero Auto-Merge
                  </span>
                </div>
              </div>

              {/* Visual Sequence Cards */}
              <div className="space-y-6">
                {/* SECTION 1: PATH A */}
                <div className="p-5 rounded-2xl bg-[#121815] border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      PATH A: Known Pathogen (Pre-Flight Inoculation &lt; 50µs)
                    </span>
                    <span className="text-[10px] text-emerald-300 font-mono">Zero Downtime • 1 Roundtrip Only</span>
                  </div>

                  <div className="space-y-2 text-[11px] text-white/80">
                    <div className="p-3 rounded-xl bg-black/50 border border-emerald-900/40 flex items-start gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">1</span>
                      <div>
                        <strong>Consumer App ➔ Envoy L7 WASM Proxy:</strong> Dispatches <code className="text-amber-300">POST /v1/charges &#123; source: &quot;tok_visa&quot; &#125;</code>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-emerald-900/40 flex items-start gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">2</span>
                      <div>
                        <strong>Envoy L7 WASM Proxy:</strong> Active Antibody in local memory catalog (<code className="text-emerald-400">&lt; 50µs lookup</code>). Applies in-process AST rewrite: <code className="text-amber-300">source ➔ payment_method</code>. Forwards to Stripe over TLS.
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-emerald-900/40 flex items-start gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">3</span>
                      <div>
                        <strong>Stripe API ➔ Envoy L7:</strong> Receives modern schema on 1st attempt. Returns <code className="text-emerald-400">HTTP 200 OK (Payment Succeeded)</code>.
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-emerald-900/40 flex items-start gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">4</span>
                      <div>
                        <strong>Envoy L7 ➔ Consumer App:</strong> Passes <code className="text-emerald-400">HTTP 200 OK</code> to app. <strong>Total Added Latency: 42µs.</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: PATH B */}
                <div className="p-5 rounded-2xl bg-[#1C1610] border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      PATH B: Unknown Pathogen (Cold-Start Outage &amp; Adaptive Synthesis)
                    </span>
                    <span className="text-[10px] text-amber-300 font-mono">Mandatory Human Review Gate</span>
                  </div>

                  <div className="space-y-2 text-[11px] text-white/80">
                    <div className="p-3 rounded-xl bg-black/50 border border-amber-900/40 flex items-start gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">5</span>
                      <div>
                        <strong>Consumer App ➔ Envoy L7 Proxy:</strong> Dispatches <code className="text-amber-300">POST /v1/charges</code>. No antibody exists in local memory yet (cold start).
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-amber-900/40 flex items-start gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">6</span>
                      <div>
                        <strong>Envoy L7 ➔ Stripe API:</strong> Forwards original unpatched request. Stripe rejects with <code className="text-red-400">HTTP 400 Bad Request (&quot;Parameter source is deprecated&quot;, 2025-03-31.basil)</code>.
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-amber-900/40 flex items-start gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">7</span>
                      <div>
                        <strong>Envoy L7 ➔ Consumer App:</strong> Returns <code className="text-red-400">HTTP 400</code> (or circuit breaker fallback). Envoy asynchronously streams RFC 7807 error details to Central Control Plane.
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-amber-900/40 flex items-start gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">8</span>
                      <div>
                        <strong>Control Plane Differ &amp; AST Engine:</strong> Tier 1 Deterministic OpenAPI Differ pinpoints drift vector. ts-morph / LibCST synthesizes AST patch. Ephemeral Staging Sandbox executes customer tests against real vendor staging (<code className="text-emerald-400">112ms PASS</code>).
                      </div>
                    </div>

                    {/* SRE HUMAN APPROVAL GATE */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/80 to-black border-2 border-amber-400 flex items-start gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black font-black text-[10px]">GATE</span>
                      <div>
                        <strong className="text-amber-300 uppercase">SRE Human Review &amp; Merge Gate:</strong> Control plane opens GitHub PR #412 with sandbox proof. <strong>Human SRE reviews and manually merges the pull request. Auto-merge is strictly forbidden.</strong>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-amber-900/40 flex items-start gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">9</span>
                      <div>
                        <strong>Enterprise KMS/HSM:</strong> Upon human merge, the FIPS 140-3 HSM signs the vaccine bytecode using the organization&apos;s Ed25519 root private key.
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-amber-900/40 flex items-start gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">10</span>
                      <div>
                        <strong>Remote Tokyo Cluster Quarantine:</strong> Signed bytecode broadcast via P2P gossip bus. Tokyo cluster places it in a <strong>60-second Quarantine Sandbox</strong>, executes a local synthetic canary smoke test, and promotes to active Envoy WASM memory catalog only upon 100% pass!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: THREE-TIER STORAGE ARCHITECTURE */}
        {activeTab === 'storage' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-black/90 border border-[#D4AF37]/40 shadow-2xl font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold text-[#D4AF37] uppercase tracking-wider text-sm">
                    Three-Tier Storage Specification
                  </span>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-500/20 text-[#10B981] font-bold">
                  PostgreSQL 16 • ClickHouse • SQLite WAL
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
                <div className="p-4 rounded-2xl bg-[#141416] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold">TIER 1 • EDGE CACHE</span>
                  <h4 className="font-bold text-white text-sm">SQLite (WAL Mode)</h4>
                  <p className="text-[11px] text-white/60">
                    Local embedded zero-dependency storage for sidecar nodes. Caches active antibodies and local quarantine state.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141416] border border-emerald-500/40 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">TIER 2 • PRIMARY RELATIONAL</span>
                  <h4 className="font-bold text-white text-sm">PostgreSQL 16</h4>
                  <p className="text-[11px] text-white/60">
                    The single source of truth for tenants, cryptographic keys, detected pathogens, verified antibodies, and PR audit trails.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141416] border border-blue-500/40 space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 font-bold">TIER 3 • TELEMETRY LAKE</span>
                  <h4 className="font-bold text-white text-sm">ClickHouse</h4>
                  <p className="text-[11px] text-white/60">
                    High-throughput append-only engine for raw eBPF L4 socket telemetry and RFC 7807 failure frames.
                  </p>
                </div>
              </div>

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
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#D4AF37]">{ddlTables[activeDdlTab].desc}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/60">{ddlTables[activeDdlTab].tier}</span>
                  </div>
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

        {/* TAB 4: REALISTIC PERFORMANCE MATRIX & DISTRIBUTED PHYSICS */}
        {activeTab === 'benchmarks' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-black/90 border border-[#D4AF37]/40 shadow-2xl font-mono text-xs space-y-6">
              <div className="pb-4 border-b border-white/10">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                  Ground Truth in Distributed Systems
                </span>
                <h3 className="font-heading font-black text-xl text-white mt-1">
                  Empirical Latency Bounds &amp; Fallacy Resolution
                </h3>
                <p className="text-white/70 text-xs mt-2 leading-relaxed">
                  Network calls that leave a cloud datacenter cannot defy the speed of light. Any claim of &quot;rescuing a 400 Bad Request in 0.4ms&quot; over the public internet is physically impossible. Immunix grounds all metrics in verifiable distributed systems reality.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-4">
                  <h4 className="font-bold text-[#D4AF37] text-sm uppercase">1. Grounded Latency Bounds</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-white/80">Envoy L7 WASM Pre-flight Hot-Patch:</span>
                      <span className="font-bold text-emerald-400">42µs – 75µs</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-white/80">eBPF L4 Socket Telemetry Hook:</span>
                      <span className="font-bold text-cyan-300">8µs</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-white/80">Local In-Memory Mock Verification:</span>
                      <span className="font-bold text-purple-300">4.8ms – 8.2ms</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-white/80">Live Ephemeral Sandbox Probe (Stripe Staging):</span>
                      <span className="font-bold text-amber-300">65ms – 180ms</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-4">
                  <h4 className="font-bold text-amber-400 text-sm uppercase">2. Fallacies Explicitly Resolved</h4>
                  <ul className="space-y-2 text-[11px] text-white/70 list-disc list-inside leading-relaxed">
                    <li>
                      <strong className="text-white">eBPF TLS Ciphertext Limitation:</strong> Outbound HTTPS traffic is encrypted. eBPF socket probes only see ciphertext. Immunix executes all payload AST rewrites inside Envoy L7 before TLS encryption.
                    </li>
                    <li>
                      <strong className="text-white">The 0.4ms Cold-Start Fallacy:</strong> When an upstream breaking change arrives unannounced, the initial request fails upstream. Immunix explicitly models Path B (Cold-Start Outage) followed by async healing and pre-emptive mesh inoculation.
                    </li>
                    <li>
                      <strong className="text-white">Poisoned-Fix Supply Chain Risk:</strong> Auto-merge is strictly forbidden. Human SRE must inspect and approve every pull request before KMS/HSM root key attestation.
                    </li>
                    <li>
                      <strong className="text-white">Zero-Trust Remote Validation:</strong> Remote clusters (e.g. Tokyo) never execute foreign bytecode immediately; they validate it in a 60-second Quarantine Sandbox with synthetic canary probes.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
