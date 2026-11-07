'use client';

import React, { useState } from 'react';
import {
  Layers,
  Zap,
  Activity,
  ArrowDown,
  GitPullRequest,
  Play,
  RefreshCw,
  Database,
  FileCode,
  Check,
  Copy,
} from 'lucide-react';

interface ActiveNodeDetail {
  title: string;
  plane: string;
  description: string;
  metric: string;
  technicalSpec: string;
  codeSnippet: string;
}

export default function ArchitectureSystemMap() {
  const [activeNode, setActiveNode] = useState<ActiveNodeDetail | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [highlightedStep, setHighlightedStep] = useState<string | null>(null);
  const [traceLogs, setTraceLogs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'3plane' | '5tier'>('3plane');
  const [activeDdlTab, setActiveDdlTab] = useState<string>('tenants');
  const [copiedDdl, setCopiedDdl] = useState(false);

  const ddlTables: Record<string, { title: string; desc: string; sql: string }> = {
    tenants: {
      title: '1. Tenants & SLAs',
      desc: 'Multi-tenant isolation with SLA warranty status and enterprise tier tiers.',
      sql: `CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    key_prefix VARCHAR(16) NOT NULL,
    hashed_secret VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    scopes TEXT[] DEFAULT ARRAY['wire:proxy', 'telemetry:write'],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
    monitored_providers: {
      title: '3. Monitored Providers',
      desc: 'Upstream vendor hosts (Stripe, Twilio, OpenAI, Salesforce) and specs.',
      sql: `CREATE TABLE monitored_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL,
    target_host VARCHAR(255) NOT NULL,
    spec_type VARCHAR(50) DEFAULT 'openapi3',
    last_health_status VARCHAR(50) DEFAULT 'healthy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
    active_antibodies: {
      title: '4. Speed 1: Active Antibodies',
      desc: 'Sub-millisecond wire transformation rules (payload rewrite, url reroute).',
      sql: `CREATE TABLE active_antibodies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES monitored_providers(id) ON DELETE CASCADE,
    antigen_signature VARCHAR(128) NOT NULL,
    rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN ('payload_rewrite', 'url_reroute', 'header_transform', 'synthetic_mock')),
    source_pattern JSONB NOT NULL,
    target_mutation JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'evaluating', 'retired', 'failed')),
    in_flight_rescues_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
    dna_repairs: {
      title: '5. Speed 2: Permanent AST Repairs',
      desc: 'Deterministic ts-morph code patches and sandbox verification proofs.',
      sql: `CREATE TABLE dna_repairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    antibody_id UUID NOT NULL REFERENCES active_antibodies(id) ON DELETE CASCADE,
    repository_url VARCHAR(500) NOT NULL,
    target_branch VARCHAR(100) DEFAULT 'main',
    pr_number INT,
    pr_url TEXT,
    ast_diff_summary TEXT NOT NULL,
    sandbox_verification_status VARCHAR(50) DEFAULT 'pending' CHECK (sandbox_verification_status IN ('pending', 'passed', 'failed')),
    sandbox_latency_ms NUMERIC(8, 2),
    cryptographic_certificate VARCHAR(255),
    merged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
    herd_vaccines: {
      title: '6. Global Herd Immunity Ledger',
      desc: 'Ed25519-signed vaccine bytecodes with Byzantine peer consensus.',
      sql: `CREATE TABLE herd_vaccines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vaccine_hash VARCHAR(128) UNIQUE NOT NULL,
    origin_region VARCHAR(50) NOT NULL,
    target_host VARCHAR(255) NOT NULL,
    antigen_pattern JSONB NOT NULL,
    antibody_bytecode BYTEA NOT NULL,
    ed25519_signature VARCHAR(255) NOT NULL,
    consensus_peer_votes INT DEFAULT 1,
    is_globally_approved BOOLEAN DEFAULT FALSE,
    broadcast_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
    schema_vector_index: {
      title: '7. pgvector Semantic Memory',
      desc: '1536-dimensional OpenAI embeddings for fuzzy schema drift recognition.',
      sql: `CREATE TABLE schema_vector_index (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES monitored_providers(id) ON DELETE CASCADE,
    field_path VARCHAR(255) NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    },
  };

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(ddlTables[activeDdlTab]?.sql || '');
    setCopiedDdl(true);
    setTimeout(() => setCopiedDdl(false), 2000);
  };

  const nodeSpecs: Record<string, ActiveNodeDetail> = {
    microservice: {
      title: 'Downstream Consumer Microservices',
      plane: '1. DATA PLANE',
      description: 'Internal backend microservices (Node.js, Go, Java, Python) emitting external HTTP/gRPC requests to vendor APIs.',
      metric: '0.00ms (Egress Start)',
      technicalSpec: 'Standard HTTP/1.1 and HTTP/2 client connections with TLS termination.',
      codeSnippet: `const res = await fetch("https://api.stripe.com/v1/charges", {
  method: "POST",
  headers: { Authorization: "Bearer sk_live_..." },
  body: JSON.stringify(checkoutData)
});`,
    },
    envoy: {
      title: 'Envoy / Edge Ingress Gateway',
      plane: '1. DATA PLANE',
      description: 'High-performance edge proxy intercepting egress socket descriptors and delegating inspection to the WASM kernel filter.',
      metric: '0.04ms Hook Overhead',
      technicalSpec: 'Envoy Proxy v1.31 with WebAssembly (proxy-wasm) ABI filter chains.',
      codeSnippet: `filter_chains:
- filters:
  - name: envoy.filters.http.wasm
    typed_config:
      "@type": type.googleapis.com/envoy.extensions.filters.http.wasm.v3.Wasm
      config:
        name: "immunix_wasm_filter"
        root_id: "immunix_edge_interceptor"`,
    },
    wasmFilter: {
      title: 'IMMUNIX WASM Kernel Filter',
      plane: '1. DATA PLANE',
      description: 'Sub-millisecond WebAssembly byte-stream filter executing hot-patches and in-flight payload translation.',
      metric: '0.38ms Inception Budget',
      technicalSpec: 'Wasmtime / V8 embedded JIT with zero socket memory allocation.',
      codeSnippet: `#[no_mangle]
pub extern "C" fn on_http_response_body(body_size: usize, end_of_stream: bool) -> Action {
    let trie = LOCK_FREE_TRIE.read();
    if let Some(antibody) = trie.match_route(current_path()) {
        antibody.synthesize_bridge(response_buffer);
        Action::Continue
    }
}`,
    },
    antibodyTrie: {
      title: 'In-Memory Lock-Free Antibody Trie',
      plane: '1. DATA PLANE',
      description: 'Concurrent radix trie holding verified translation rules. Receives push updates from Control Plane in real time.',
      metric: '14,280 Cached Antibodies (O(1))',
      technicalSpec: 'RCU (Read-Copy-Update) memory synchronization with atomic pointer swap.',
      codeSnippet: `class LockFreeAntibodyTrie {
  // Fast path lookup without mutex contention
  lookup(route: string): AntibodyRule | null {
    return this.radixRoot.match(route);
  }
}`,
    },
    upstreamSaaS: {
      title: 'Upstream SaaS / Internal API',
      plane: '1. DATA PLANE',
      description: 'External provider endpoints (Stripe, Twilio, OpenAI, Salesforce) that mutate schemas unexpectedly.',
      metric: 'Target Target 200 OK',
      technicalSpec: 'Public SaaS infrastructure with uncoordinated release cycles.',
      codeSnippet: `HTTP/1.1 200 OK
Content-Type: application/json
{
  "email_address": "patron@sovereign.ch" // Renamed from customer_email
}`,
    },
    eventBroker: {
      title: 'Kafka / Redpanda Event Broker',
      plane: '2. CONTROL PLANE',
      description: 'High-throughput anomaly ingestion bus streaming wire-level drift events from all cluster nodes.',
      metric: '1.2M events / sec',
      technicalSpec: 'Redpanda cluster with Raft consensus and sub-millisecond produce latency.',
      codeSnippet: `Topic: immunix.anomalies.stream
Partition: 12
ReplicationFactor: 3
Retention: 72h`,
    },
    antigenProfiler: {
      title: 'Antigen Profiler & Anomaly Sentry',
      plane: '2. CONTROL PLANE',
      description: 'Autonomous analyzer categorizing schema drift patterns into structural diff vectors.',
      metric: '0.12ms Profiling Time',
      technicalSpec: 'Probabilistic Bloom Filter + JSON Schema AST diffing algorithms.',
      codeSnippet: `const diff = profileAnomaly({
  vendor: "Stripe",
  drift: "FIELD_RENAMED",
  before: "customer_email",
  after: "email_address"
});`,
    },
    hotPatchCompiler: {
      title: 'Hot-Patch Rule Compiler',
      plane: '2. CONTROL PLANE',
      description: 'Instantly compiles WASM translation bytecode and pushes immediate rule updates back to local Data Plane and Herd Mesh.',
      metric: '0.15ms Compilation Speed',
      technicalSpec: 'LLVM / Cranelift WebAssembly bytecode JIT emission.',
      codeSnippet: `// Push rule update back to Data Plane:
dataPlane.inMemoryTrie.pushUpdate(compiledWasmRule);
// Broadcast to Global Herd Mesh:
herdMesh.sanitizeAndBroadcast(compiledWasmRule);`,
    },
    astGenomeEngine: {
      title: 'AST Genome Engine (ts-morph / ast-grep)',
      plane: '2. CONTROL PLANE',
      description: 'Permanent code repair engine parsing repositories with compiler APIs and deterministic AST transformations.',
      metric: '100% Zero Hallucination',
      technicalSpec: 'TypeScript Compiler API v5.7 + ts-morph project graph traversal.',
      codeSnippet: `sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
  .forEach(node => {
    if (node.getName() === "customer_email") {
      node.replaceWithText("(charge.email_address ?? charge.customer_email)");
    }
  });`,
    },
    sandboxVerifier: {
      title: 'Ephemeral Unmocked Sandbox Verifier',
      plane: '2. CONTROL PLANE',
      description: 'Spins up isolated microVM sandboxes and verifies patches against live upstream staging targets.',
      metric: '48 / 48 Tests Passed',
      technicalSpec: 'AWS Firecracker microVM instance with 18ms boot time.',
      codeSnippet: `✓ Boot Firecracker microVM (18ms)
✓ Run Jest integration suite
✓ Target: api.stripe.com/v2/staging
✓ Result: HTTP 200 OK (Contract Verified)`,
    },
    prSynthesizer: {
      title: 'PR Synthesizer & GitHub App',
      plane: '2. CONTROL PLANE',
      description: 'Automatically creates a Git branch, commits verified AST patches, and opens a Pull Request on GitHub.',
      metric: 'PR #204 Opened & Verified',
      technicalSpec: 'GitHub App REST v3 API with GPG signature authentication.',
      codeSnippet: `git checkout -b immunix/heal-stripe-v2026-03
git commit -S -m "fix(stripe): adopt email_address contract alias"
gh pr create --title "fix(stripe): adopt email_address" --body "Verified via Immunix Sandbox"`,
    },
    zkSanitizer: {
      title: 'Zero-Knowledge PII Sanitizer',
      plane: '3. GLOBAL HERD MESH',
      description: 'Strips all private credentials, authorization tokens, and customer data from the vaccine payload.',
      metric: '0 Bytes PII Escaped',
      technicalSpec: 'Deterministic redaction of RFC 7519 JWTs and bearer headers.',
      codeSnippet: `const sanitized = sanitizeRule(hotPatchRule, {
  stripAuth: true,
  stripCookies: true,
  preserveAstGrammarOnly: true
});`,
    },
    edSigner: {
      title: 'Ed25519 Cryptographic Signer',
      plane: '3. GLOBAL HERD MESH',
      description: 'Signs sanitized antibody bytecodes with sovereign cluster private keys for cryptographic consensus.',
      metric: 'Ed25519 Curve25519 Proof',
      technicalSpec: 'FIPS 186-5 compliant high-speed digital signature scheme.',
      codeSnippet: `const signature = ed25519.sign(
  sha256(sanitizedBytecode),
  sovereignClusterPrivateKey
);`,
    },
    gossipSub: {
      title: 'P2P GossipSub Mesh Network',
      plane: '3. GLOBAL HERD MESH',
      description: 'Peer-to-peer gossip protocol broadcasting verified antibodies across 14,280 global nodes in under 4ms.',
      metric: '3.4ms Global Propagation',
      technicalSpec: 'libp2p GossipSub v1.2 with topic score protection against rule poisoning.',
      codeSnippet: `gossipSub.publish(
  "/immunix/vaccines/v1",
  signedVaccineBlock
);`,
    },
    enterpriseClusters: {
      title: 'Global Enterprise Clusters (Tokyo, Frankfurt, SF)',
      plane: '3. GLOBAL HERD MESH',
      description: 'Production enterprise clusters receiving pre-emptive inoculations hours before vendor regional rollouts reach them.',
      metric: '14,280 Clusters Pre-Inoculated',
      technicalSpec: 'Cross-cloud mesh spanning AWS, GCP, Azure, and bare-metal VPCs.',
      codeSnippet: `✓ Tokyo AP-1: Inoculated (1.2ms)
✓ Frankfurt EU-1: Inoculated (2.1ms)
✓ San Francisco SF-1: Inoculated (2.8ms)`,
    },
  };

  const runPipelineTrace = async () => {
    if (isTracing) return;
    setIsTracing(true);
    setTraceLogs([]);

    const steps = [
      { key: 'microservice', text: '[0.00ms] 1. DATA PLANE: Downstream microservice emits outbound Stripe request' },
      { key: 'envoy', text: '[0.04ms] 1. DATA PLANE: Envoy edge gateway hooks socket descriptor' },
      { key: 'wasmFilter', text: '[0.12ms] 1. DATA PLANE: IMMUNIX WASM Kernel Filter captures schema drift' },
      { key: 'antibodyTrie', text: '[0.20ms] 1. DATA PLANE: In-Memory Lock-Free Antibody Trie fast-match lookup' },
      { key: 'upstreamSaaS', text: '[0.38ms] 1. DATA PLANE: In-flight payload bridge delivered (HTTP 200 OK)' },
      { key: 'eventBroker', text: '[0.42ms] 2. CONTROL PLANE: Anomaly streamed to Kafka/Redpanda Event Broker' },
      { key: 'antigenProfiler', text: '[0.55ms] 2. CONTROL PLANE: Antigen Profiler categorizes FIELD_RENAMED' },
      { key: 'hotPatchCompiler', text: '[0.70ms] 2. CONTROL PLANE: Hot-Patch Compiler pushes rule update back to Trie' },
      { key: 'astGenomeEngine', text: '[1.10ms] 2. CONTROL PLANE: AST Genome Engine (ts-morph) refactors 3 call sites' },
      { key: 'sandboxVerifier', text: '[1.80ms] 2. CONTROL PLANE: Ephemeral Unmocked Sandbox verifies HTTP 200' },
      { key: 'prSynthesizer', text: '[2.20ms] 2. CONTROL PLANE: Pull Request #204 auto-opened on GitHub' },
      { key: 'zkSanitizer', text: '[2.60ms] 3. GLOBAL HERD MESH: Zero-Knowledge PII Sanitizer strips sensitive headers' },
      { key: 'edSigner', text: '[2.90ms] 3. GLOBAL HERD MESH: Ed25519 Cryptographic Signer stamps sovereign proof' },
      { key: 'gossipSub', text: '[3.40ms] 3. GLOBAL HERD MESH: P2P GossipSub Mesh Network broadcasts vaccine' },
      { key: 'enterpriseClusters', text: '[3.80ms] 3. GLOBAL HERD MESH: Tokyo, Frankfurt, SF pre-emptively inoculated!' },
    ];

    try {
      // Trigger real backend pipeline simulation
      fetch('/api/pipeline/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'Stripe Payments', endpoint: 'stripe/v1/charges' }),
      }).catch(() => {});
    } catch {
      // safe
    }

    steps.forEach((step, index) => {
      setTimeout(() => {
        setHighlightedStep(step.key);
        setActiveNode(nodeSpecs[step.key]);
        setTraceLogs((prev) => [...prev, step.text]);

        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsTracing(false);
          }, 1000);
        }
      }, index * 400);
    });
  };

  return (
    <section id="system-architecture-map" className="py-24 bg-[#0B0B0C] text-white relative overflow-hidden font-sans border-b border-[#D4AF37]/30">
      {/* Background ambient gold aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-b from-[#D4AF37]/15 via-[#997D25]/10 to-transparent blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" /> Sovereign System Topology
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-white">
            Autonomous Immune Architecture
          </h2>
          <p className="mt-4 text-white/70 text-base sm:text-lg leading-relaxed">
            The canonical 3-tier software immunology architecture: Edge Wire Defense (Data Plane), Autonomous DNA Repair (Control Plane), and Collective Consensus (Global Herd Mesh).
          </p>

          {/* View Toggle */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button suppressHydrationWarning
              onClick={() => setViewMode('3plane')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === '3plane'
                  ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3-Plane Biological Mesh</span>
            </button>

            <button suppressHydrationWarning
              onClick={() => setViewMode('5tier')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === '5tier'
                  ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-[#D4AF37]/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>5-Tier Polyglot Data Topology &amp; DDL</span>
            </button>

            {viewMode === '3plane' && (
              <button suppressHydrationWarning
                onClick={runPipelineTrace}
                disabled={isTracing}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-[#F3E5AB] font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isTracing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                    <span>Tracing Packet (0.38ms ➔ 3.8ms)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                    <span>Run Live Pipeline Trace</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* 3-PLANE SYSTEM DIAGRAM (Replicating the exact uploaded architecture) */}
        {viewMode === '3plane' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Diagram Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* ======================================================== */}
            {/* 2. CONTROL PLANE (Autonomous Orchestration & DNA Repair) */}
            {/* ======================================================== */}
            <div className="rounded-3xl border-2 border-[#D4AF37]/40 bg-[#141416]/90 p-6 sm:p-8 relative shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                    2. CONTROL PLANE (Autonomous Orchestration & DNA Repair)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/40">Kafka + ts-morph + Firecracker</span>
              </div>

              {/* Node 2.1: Kafka / Redpanda Event Broker */}
              <div className="flex justify-center">
                <button suppressHydrationWarning
                  onClick={() => setActiveNode(nodeSpecs.eventBroker)}
                  className={`w-full max-w-md p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    highlightedStep === 'eventBroker'
                      ? 'bg-[#D4AF37] text-[#0B0B0C] border-white scale-105 shadow-[0_0_25px_#D4AF37]'
                      : 'bg-black/60 border-white/20 hover:border-[#D4AF37]/60 text-white'
                  }`}
                >
                  <div className="font-heading font-bold text-sm">Kafka / Redpanda Event Broker</div>
                  <div className="text-[10px] font-mono text-white/50 mt-0.5">High-throughput anomaly stream ingest</div>
                </button>
              </div>

              <div className="flex justify-center text-[#D4AF37]">
                <ArrowDown className="w-4 h-4" />
              </div>

              {/* Node 2.2: Antigen Profiler & Anomaly Sentry */}
              <div className="flex justify-center">
                <button suppressHydrationWarning
                  onClick={() => setActiveNode(nodeSpecs.antigenProfiler)}
                  className={`w-full max-w-md p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    highlightedStep === 'antigenProfiler'
                      ? 'bg-[#D4AF37] text-[#0B0B0C] border-white scale-105 shadow-[0_0_25px_#D4AF37]'
                      : 'bg-black/60 border-white/20 hover:border-[#D4AF37]/60 text-white'
                  }`}
                >
                  <div className="font-heading font-bold text-sm">Antigen Profiler & Anomaly Sentry</div>
                  <div className="text-[10px] font-mono text-white/50 mt-0.5">Categorizes schema mutations into diff vectors</div>
                </button>
              </div>

              <div className="flex justify-center text-[#D4AF37]">
                <ArrowDown className="w-4 h-4" />
              </div>

              {/* Branch Split: Hot-Patch Rule Compiler (Left) vs AST Genome Engine (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Branch A: Hot-Patch Rule Compiler */}
                <div className="space-y-4 flex flex-col items-center">
                  <div className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">Fast-Path Wire Relief</div>
                  <button suppressHydrationWarning
                    onClick={() => setActiveNode(nodeSpecs.hotPatchCompiler)}
                    className={`w-full p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      highlightedStep === 'hotPatchCompiler'
                        ? 'bg-[#D4AF37] text-[#0B0B0C] border-white scale-105 shadow-[0_0_25px_#D4AF37]'
                        : 'bg-black/60 border-white/20 hover:border-[#D4AF37]/60 text-white'
                    }`}
                  >
                    <div className="font-heading font-bold text-sm">Hot-Patch Rule Compiler</div>
                    <div className="text-[10px] font-mono text-white/50 mt-0.5">WASM bytecode & regex synthesizer</div>
                  </button>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-dashed border-[#D4AF37]/40 text-[10px] font-mono text-[#D4AF37] text-center w-full">
                    ↓ Pushes &quot;Push Rule Update&quot; to Data Plane Trie & Herd Mesh
                  </div>
                </div>

                {/* Branch B: AST Genome Engine */}
                <div className="space-y-4 flex flex-col items-center">
                  <div className="text-[10px] font-mono text-blue-400 uppercase font-bold">Permanent Code Repair</div>
                  <button suppressHydrationWarning
                    onClick={() => setActiveNode(nodeSpecs.astGenomeEngine)}
                    className={`w-full p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      highlightedStep === 'astGenomeEngine'
                        ? 'bg-blue-500 text-white border-white scale-105 shadow-[0_0_25px_rgba(59,130,246,0.6)]'
                        : 'bg-black/60 border-white/20 hover:border-blue-400/60 text-white'
                    }`}
                  >
                    <div className="font-heading font-bold text-sm">AST Genome Engine (ts-morph / ast-grep)</div>
                    <div className="text-[10px] font-mono text-white/50 mt-0.5">Deterministic syntax tree refactor</div>
                  </button>

                  <ArrowDown className="w-3.5 h-3.5 text-blue-400" />

                  <button suppressHydrationWarning
                    onClick={() => setActiveNode(nodeSpecs.sandboxVerifier)}
                    className={`w-full p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      highlightedStep === 'sandboxVerifier'
                        ? 'bg-blue-500 text-white border-white scale-105'
                        : 'bg-black/60 border-white/20 hover:border-blue-400/60 text-white'
                    }`}
                  >
                    <div className="font-heading font-bold text-xs">Ephemeral Unmocked Sandbox Verifier</div>
                    <div className="text-[9px] font-mono text-white/50 mt-0.5">Firecracker microVM live staging test</div>
                  </button>

                  <ArrowDown className="w-3.5 h-3.5 text-blue-400" />

                  <button suppressHydrationWarning
                    onClick={() => setActiveNode(nodeSpecs.prSynthesizer)}
                    className={`w-full p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      highlightedStep === 'prSynthesizer'
                        ? 'bg-emerald-500 text-black font-bold border-white scale-105 shadow-[0_0_20px_#10B981]'
                        : 'bg-black/60 border-white/20 hover:border-emerald-400/60 text-white'
                    }`}
                  >
                    <div className="font-heading font-bold text-xs flex items-center justify-center gap-1.5">
                      <GitPullRequest className="w-3.5 h-3.5 text-[#10B981]" /> PR Synthesizer & GitHub App
                    </div>
                    <div className="text-[9px] font-mono text-white/50 mt-0.5">Auto-generated Pull Request #204</div>
                  </button>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 3. GLOBAL HERD MESH (The Immune Consensus Ledger)        */}
            {/* ======================================================== */}
            <div className="rounded-3xl border-2 border-[#D4AF37]/30 bg-[#101012]/90 p-6 sm:p-8 relative shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#10B981]">
                    3. GLOBAL HERD MESH (The Immune Consensus Ledger)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37]">P2P GossipSub Consensus</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button suppressHydrationWarning
                  onClick={() => setActiveNode(nodeSpecs.zkSanitizer)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    highlightedStep === 'zkSanitizer'
                      ? 'bg-[#10B981] text-black font-bold border-white scale-105'
                      : 'bg-black/50 border-white/10 hover:border-[#10B981]/50 text-white'
                  }`}
                >
                  <div className="font-bold text-xs">Zero-Knowledge PII Sanitizer</div>
                  <div className="text-[9px] font-mono text-white/50 mt-0.5">Strips headers & tokens</div>
                </button>

                <button suppressHydrationWarning
                  onClick={() => setActiveNode(nodeSpecs.edSigner)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    highlightedStep === 'edSigner'
                      ? 'bg-[#10B981] text-black font-bold border-white scale-105'
                      : 'bg-black/50 border-white/10 hover:border-[#10B981]/50 text-white'
                  }`}
                >
                  <div className="font-bold text-xs">Ed25519 Cryptographic Signer</div>
                  <div className="text-[9px] font-mono text-white/50 mt-0.5">Sovereign root key proof</div>
                </button>

                <button suppressHydrationWarning
                  onClick={() => setActiveNode(nodeSpecs.gossipSub)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    highlightedStep === 'gossipSub'
                      ? 'bg-[#10B981] text-black font-bold border-white scale-105'
                      : 'bg-black/50 border-white/10 hover:border-[#10B981]/50 text-white'
                  }`}
                >
                  <div className="font-bold text-xs">P2P GossipSub Mesh Network</div>
                  <div className="text-[9px] font-mono text-white/50 mt-0.5">3.4ms Global broadcast</div>
                </button>

                <button suppressHydrationWarning
                  onClick={() => setActiveNode(nodeSpecs.enterpriseClusters)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    highlightedStep === 'enterpriseClusters'
                      ? 'bg-[#10B981] text-black font-bold border-white scale-105'
                      : 'bg-black/50 border-white/10 hover:border-[#10B981]/50 text-white'
                  }`}
                >
                  <div className="font-bold text-xs">Global Enterprise Clusters</div>
                  <div className="text-[9px] font-mono text-white/50 mt-0.5">Tokyo, Frankfurt, SF</div>
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 1. DATA PLANE (Edge Wire Defense - Sub-Millisecond)      */}
            {/* ======================================================== */}
            <div className="rounded-3xl border-2 border-white/20 bg-[#121214]/90 p-6 sm:p-8 relative shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    1. DATA PLANE (Edge Wire Defense - Sub-Millisecond)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#10B981] font-bold">Latency: &lt; 0.4ms Wire Budget</span>
              </div>

              {/* Node 1.1: Downstream Consumer Microservices */}
              <div className="flex justify-center">
                <button suppressHydrationWarning
                  onClick={() => setActiveNode(nodeSpecs.microservice)}
                  className={`w-full max-w-md p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    highlightedStep === 'microservice'
                      ? 'bg-[#D4AF37] text-[#0B0B0C] border-white scale-105 shadow-[0_0_25px_#D4AF37]'
                      : 'bg-black/60 border-white/20 hover:border-[#D4AF37]/60 text-white'
                  }`}
                >
                  <div className="font-heading font-bold text-sm">Downstream Consumer Microservices</div>
                  <div className="text-[10px] font-mono text-white/50 mt-0.5">Emits Outbound API Request</div>
                </button>
              </div>

              <div className="flex justify-center text-[#D4AF37]">
                <ArrowDown className="w-4 h-4" />
              </div>

              {/* Node 1.2: Envoy / Edge Ingress Gateway */}
              <div className="flex justify-center">
                <button suppressHydrationWarning
                  onClick={() => setActiveNode(nodeSpecs.envoy)}
                  className={`w-full max-w-md p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    highlightedStep === 'envoy'
                      ? 'bg-[#D4AF37] text-[#0B0B0C] border-white scale-105 shadow-[0_0_25px_#D4AF37]'
                      : 'bg-black/60 border-white/20 hover:border-[#D4AF37]/60 text-white'
                  }`}
                >
                  <div className="font-heading font-bold text-sm">Envoy / Edge Ingress Gateway</div>
                  <div className="text-[10px] font-mono text-white/50 mt-0.5">Socket descriptor hook ➔ WASM Kernel Filter</div>
                </button>
              </div>

              <div className="flex justify-center text-[#D4AF37]">
                <ArrowDown className="w-4 h-4" />
              </div>

              {/* Node 1.3: IMMUNIX WASM Kernel Filter */}
              <div className="flex justify-center">
                <button suppressHydrationWarning
                  onClick={() => setActiveNode(nodeSpecs.wasmFilter)}
                  className={`w-full max-w-lg p-5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                    highlightedStep === 'wasmFilter'
                      ? 'bg-[#D4AF37] text-[#0B0B0C] border-white scale-105 shadow-[0_0_35px_#D4AF37]'
                      : 'bg-[#1C1C1F] border-[#D4AF37]/50 hover:border-[#D4AF37] text-white'
                  }`}
                >
                  <div className="font-heading font-black text-base text-[#D4AF37] flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 fill-[#D4AF37]" /> IMMUNIX WASM Kernel Filter
                  </div>
                  <div className="text-xs font-mono text-white/70 mt-1">
                    Dual Execution: 1. Fast Match Hot-Patch | 2. In-Flight Payload Rewrite
                  </div>
                </button>
              </div>

              {/* Two sub-branches of WASM Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* 1. Fast Match Hot-Patch */}
                <button suppressHydrationWarning
                  onClick={() => setActiveNode(nodeSpecs.antibodyTrie)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    highlightedStep === 'antibodyTrie'
                      ? 'bg-[#D4AF37] text-[#0B0B0C] border-white scale-105 shadow-[0_0_25px_#D4AF37]'
                      : 'bg-black/60 border-white/20 hover:border-[#D4AF37]/60 text-white'
                  }`}
                >
                  <div className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold mb-1">
                    1. Fast Match Hot-Patch
                  </div>
                  <div className="font-heading font-bold text-sm">In-Memory Lock-Free Antibody Trie</div>
                  <div className="text-[10px] font-mono text-white/50 mt-1">O(1) prefix lookup • Synchronized via Push Rule Update</div>
                </button>

                {/* 2. In-Flight Payload Rewrite */}
                <button suppressHydrationWarning
                  onClick={() => setActiveNode(nodeSpecs.upstreamSaaS)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    highlightedStep === 'upstreamSaaS'
                      ? 'bg-[#10B981] text-black font-bold border-white scale-105 shadow-[0_0_25px_#10B981]'
                      : 'bg-black/60 border-white/20 hover:border-[#10B981]/60 text-white'
                  }`}
                >
                  <div className="text-[10px] font-mono text-[#10B981] uppercase font-bold mb-1">
                    2. In-Flight Payload Rewrite
                  </div>
                  <div className="font-heading font-bold text-sm">Upstream SaaS / Internal API</div>
                  <div className="text-[10px] font-mono text-white/50 mt-1">Intercepted & synthesized before returning 500</div>
                </button>
              </div>

              {/* Telemetry stream line note */}
              <div className="p-3 rounded-2xl bg-white/5 border border-dashed border-white/15 text-center text-[10px] font-mono text-white/60">
                ⤤ Telemetry & Anomaly Stream emitted to Control Plane Event Broker
              </div>
            </div>
          </div>

          {/* Node Inspector & Live Trace Console */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Trace Logs */}
            <div className="p-5 rounded-3xl bg-[#141416] border border-[#D4AF37]/40 shadow-2xl font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-[#D4AF37] font-bold flex items-center gap-1.5 text-[11px]">
                  <Activity className="w-3.5 h-3.5 text-[#10B981] animate-pulse" /> Live Execution Stream
                </span>
                <span className="text-white/40 text-[10px]">3-Plane Telemetry</span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {traceLogs.length === 0 ? (
                  <div className="text-white/40 py-6 text-center text-[11px]">
                    Click &quot;Run Live End-to-End Pipeline Trace&quot; above to observe real-time packet traversal.
                  </div>
                ) : (
                  traceLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`text-[10px] leading-relaxed p-1.5 rounded ${
                        log.includes('DATA PLANE')
                          ? 'text-[#D4AF37] bg-[#D4AF37]/10'
                          : log.includes('CONTROL PLANE')
                          ? 'text-blue-300 bg-blue-950/30'
                          : 'text-[#10B981] bg-emerald-950/30 font-bold'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Selected Node Spec Inspector */}
            {activeNode ? (
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1C1C1F] to-[#0B0B0C] border border-[#D4AF37]/50 shadow-2xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold">
                      {activeNode.plane}
                    </span>
                    <h4 className="font-heading font-black text-sm text-white mt-0.5">
                      {activeNode.title}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold">
                    {activeNode.metric}
                  </span>
                </div>

                <p className="text-[#6E6E73] text-[11px] leading-relaxed">
                  {activeNode.description}
                </p>

                <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] text-white/80">
                  <strong className="text-[#D4AF37] block mb-1">Technical Specification:</strong>
                  {activeNode.technicalSpec}
                </div>

                <div>
                  <span className="text-[10px] text-white/40 block mb-1 uppercase">Source / Manifest Hook:</span>
                  <pre className="p-3 rounded-xl bg-black border border-white/10 text-[10px] text-[#D4AF37] overflow-x-auto leading-relaxed">
                    {activeNode.codeSnippet}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-[#141416] border border-white/10 text-center text-xs font-mono text-white/40 space-y-2">
                <Layers className="w-8 h-8 text-[#D4AF37] mx-auto stroke-[1.5]" />
                <p>Click any node in the architecture diagram to inspect its technical specification and code implementation.</p>
              </div>
            )}
          </div>
        </div>
        ) : (
          /* VIEW 2: 5-TIER POLYGLOT DATA TOPOLOGY */
          <div className="space-y-12">
            {/* Architectural ASCII Topology Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-black/90 border border-[#D4AF37]/40 shadow-2xl overflow-x-auto font-mono text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold text-[#D4AF37] uppercase tracking-wider text-sm">
                    IMMUNIX 5-TIER POLYGLOT DATA TOPOLOGY
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-[#10B981] font-bold">
                  PRODUCTION HIGH-AVAILABILITY
                </span>
              </div>

              <div className="space-y-3 text-[11px] leading-relaxed text-[#F3E5AB]">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <span className="font-bold text-[#D4AF37]">[ TIER 1: SUB-MILLISECOND L1 CACHE ]</span>
                  <span className="text-white/80">WASM Radix Trie / Redis Cluster</span>
                  <span className="text-[#10B981]">&lt; 0.1ms wire antibody lookup</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <span className="font-bold text-[#D4AF37]">[ TIER 2: HIGH-THROUGHPUT TELEMETRY ]</span>
                  <span className="text-white/80">ClickHouse + Redpanda Event Bus</span>
                  <span className="text-[#10B981]">Billions of wire events, 10:1 compression</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <span className="font-bold text-[#D4AF37]">[ TIER 3: PRIMARY TRANSACTIONAL DB ]</span>
                  <span className="text-white/80">PostgreSQL 16 Enterprise Grid</span>
                  <span className="text-[#10B981]">Tenants, contracts, PR tracking, ACID guarantee</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <span className="font-bold text-[#D4AF37]">[ TIER 4: SEMANTIC VECTOR MEMORY ]</span>
                  <span className="text-white/80">pgvector / Qdrant HNSW Index</span>
                  <span className="text-[#10B981]">1536-dim fuzzy schema drift embeddings</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <span className="font-bold text-[#D4AF37]">[ TIER 5: DECENTRALIZED HERD LEDGER ]</span>
                  <span className="text-white/80">Merkle-DAG + Ed25519 Gossip</span>
                  <span className="text-[#10B981]">Global peer-to-peer consensus in 3.4ms</span>
                </div>
              </div>
            </div>

            {/* 5-Tier Deep Technical Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tier 1 */}
              <div className="p-6 rounded-3xl bg-[#141416] border border-[#D4AF37]/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest">
                    Tier 1 • Wire Inception
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-white">0.08ms</span>
                </div>
                <h4 className="font-heading font-black text-lg text-white">WASM Radix Trie / Redis</h4>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  In-kernel eBPF socket maps and lock-free WebAssembly Trie structures storing pre-compiled antibody bytecodes for instantaneous wire rewriting.
                </p>
                <div className="pt-2 text-[11px] font-mono text-white/50 border-t border-white/10">
                  Engine: <strong className="text-white">proxy-wasm ABI + Rust</strong>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="p-6 rounded-3xl bg-[#141416] border border-[#D4AF37]/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest">
                    Tier 2 • Telemetry
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-white">10M msg/s</span>
                </div>
                <h4 className="font-heading font-black text-lg text-white">ClickHouse + Redpanda</h4>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  High-velocity anomaly logs and payload diff streams ingested with zero JVM garbage collection pauses and 10:1 columnar ZSTD compression.
                </p>
                <div className="pt-2 text-[11px] font-mono text-white/50 border-t border-white/10">
                  Engine: <strong className="text-white">C++20 Native Engine</strong>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="p-6 rounded-3xl bg-[#141416] border border-[#D4AF37]/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest">
                    Tier 3 • Primary Store
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-white">ACID Strict</span>
                </div>
                <h4 className="font-heading font-black text-lg text-white">PostgreSQL 16 Sovereign</h4>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Enterprise tenants, Argon2id salted API keys, active antibodies, and audited GitHub PR pull request verification certificates with row-level security.
                </p>
                <div className="pt-2 text-[11px] font-mono text-white/50 border-t border-white/10">
                  Engine: <strong className="text-white">Postgres 16 + Citus Scale</strong>
                </div>
              </div>

              {/* Tier 4 */}
              <div className="p-6 rounded-3xl bg-[#141416] border border-[#D4AF37]/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest">
                    Tier 4 • Vector Memory
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-white">1536-dim</span>
                </div>
                <h4 className="font-heading font-black text-lg text-white">pgvector / Qdrant</h4>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Cosine distance index matching mutated payloads against historic OpenAPI/JSON-Schema embeddings to classify silent field renames in microseconds.
                </p>
                <div className="pt-2 text-[11px] font-mono text-white/50 border-t border-white/10">
                  Engine: <strong className="text-white">HNSW Vector Quantization</strong>
                </div>
              </div>

              {/* Tier 5 */}
              <div className="p-6 rounded-3xl bg-[#141416] border border-[#D4AF37]/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest">
                    Tier 5 • P2P Consensus
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-white">3.4ms Mesh</span>
                </div>
                <h4 className="font-heading font-black text-lg text-white">Merkle-DAG + Ed25519</h4>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Decentralized cryptographic ledger propagating verified software antibodies worldwide with Byzantine fault tolerance and Zero-Knowledge redaction.
                </p>
                <div className="pt-2 text-[11px] font-mono text-white/50 border-t border-white/10">
                  Engine: <strong className="text-white">libp2p GossipSub v1.2</strong>
                </div>
              </div>

              {/* Zero-Knowledge Vault Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1C1C1F] to-[#0B0B0C] border border-[#D4AF37]/50 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#10B981] font-bold uppercase tracking-widest">
                    Zero-Knowledge Vault
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-xs font-mono text-[#10B981]">0 PII Retained</span>
                </div>
                <h4 className="font-heading font-black text-lg text-white">Zero Storage Security</h4>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Upstream customer secrets (Stripe, Twilio, OpenAI) stream exclusively through ephemeral TLS memory buffers with zero disk writes.
                </p>
                <div className="pt-2 text-[11px] font-mono text-white/50 border-t border-white/10">
                  Compliance: <strong className="text-[#D4AF37]">SOC2 Type II + ISO 27001</strong>
                </div>
              </div>
            </div>

            {/* Interactive PostgreSQL Production DDL Inspector */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141416] border border-[#D4AF37]/40 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-base text-white">
                      PostgreSQL 16 Production DDL Specification
                    </h4>
                    <p className="text-xs font-mono text-[#6E6E73]">
                      Immutable relational schema definitions powering IMMUNIX Control Plane
                    </p>
                  </div>
                </div>

                <button suppressHydrationWarning
                  onClick={handleCopyDdl}
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {copiedDdl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span className="text-[#10B981]">Copied SQL!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Copy Table DDL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Table Selection Tabs */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(ddlTables).map((tblKey) => (
                  <button suppressHydrationWarning
                    key={tblKey}
                    onClick={() => setActiveDdlTab(tblKey)}
                    className={`px-3.5 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                      activeDdlTab === tblKey
                        ? 'bg-[#D4AF37] text-[#0B0B0C] font-bold shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                    }`}
                  >
                    {tblKey}
                  </button>
                ))}
              </div>

              {/* Selected DDL Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-white/60">
                  <span>{ddlTables[activeDdlTab]?.title} ── {ddlTables[activeDdlTab]?.desc}</span>
                  <span className="text-[#D4AF37]">schema.sql</span>
                </div>
                <pre className="p-5 rounded-2xl bg-black border border-white/10 font-mono text-xs text-[#10B981] overflow-x-auto leading-relaxed shadow-inner">
                  {ddlTables[activeDdlTab]?.sql}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

