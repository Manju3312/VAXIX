'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Skull,
  RefreshCw,
  Play,
  CheckCircle2,
  Activity,
  FileCode,
  GitPullRequest,
  Terminal,
  ExternalLink,
  Shield,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export default function BreakMyApiArena() {
  const [selectedSabotage, setSelectedSabotage] = useState<'rename' | 'delete' | 'timestamp'>('rename');
  const [pathMode, setPathMode] = useState<'path_a' | 'path_b'>('path_a');
  const [sensitiveGuard, setSensitiveGuard] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'payload' | 'ast'>('telemetry');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'System standby. Select an API sabotage vector above and click "Simulate 3:00 AM Mutation".',
  ]);
  const [outcome, setOutcome] = useState<'idle' | 'path_a_success' | 'path_b_outage' | 'sensitive_blocked'>('idle');
  const [serverMetrics, setServerMetrics] = useState<{ latencyMs: number; eventId: string } | null>(null);

  const scenarioPayloads = {
    rename: {
      apiName: 'Stripe Payments (2025-03-31.basil)',
      scenarioId: 'PROPERTY_RENAMED',
      endpoint: '/v1/payment_intents',
      isSensitive: true,
      clientReq: `POST /v1/payment_intents HTTP/1.1
Host: api.stripe.com
Authorization: Bearer [SHREDDED_TOKEN]
Content-Type: application/json

{
  "source": "tok_visa",
  "amount_cents": 49000,
  "currency": "usd"
}`,
      upstreamErr: `HTTP/1.1 400 Bad Request
Content-Type: application/problem+json
Deprecation: @1743465600
Sunset: Wed, 01 Jan 2026 00:00:00 GMT

{
  "type": "https://stripe.com/docs/error-codes/parameter-deprecated",
  "title": "Deprecated Parameter",
  "detail": "Parameter 'source' is deprecated. Use 'payment_method' instead.",
  "param": "source"
}`,
      healedRes: `HTTP/1.1 200 OK
X-Vaxix-Path: Path-A-Pre-Flight
X-Vaxix-Overhead: 1.15ms
Content-Type: application/json

{
  "id": "pi_3N4xLm2eZvKYlo2C1",
  "status": "succeeded",
  "amount": 49000,
  "currency": "usd",
  "payment_method": "tok_visa",
  "paid": true,
  "_vaxix_preflight_ast": "RENAME_FIELD_SOURCE_TO_PAYMENT_METHOD"
}`,
      astDiff: `// consumer-app/src/services/billing.ts (ts-morph AST Refactor)
- const payment = await stripe.charges.create({ source: token });
+ const payment = await stripe.paymentIntents.create({ payment_method: token });
// Ephemeral Sandbox Probe: PASS (HTTP 200 in 65ms) | Ed25519 Cert Verified`,
    },
    delete: {
      apiName: 'Twilio Cloud Dispatch',
      scenarioId: 'ENDPOINT_RELOCATED',
      endpoint: '/v1/charges',
      isSensitive: true,
      clientReq: `POST /v1/charges HTTP/1.1
Host: api.twilio.com
Authorization: Bearer [SHREDDED_TOKEN]

{
  "to": "+15551234567",
  "amount": 142500
}`,
      upstreamErr: `HTTP/1.1 404 Not Found
Content-Type: application/problem+json
Sunset: Wed, 01 Jan 2026 00:00:00 GMT

{
  "code": 404,
  "message": "Endpoint /v1/charges is sunset. Relocated to /v2/checkout/pay"
}`,
      healedRes: `HTTP/1.1 200 OK
X-Vaxix-Rerouted: /v1/charges ➔ /v2/checkout/pay
X-Vaxix-Overhead: 1.22ms

{
  "status": 200,
  "transaction_id": "tx_9814a0f",
  "cleared": true,
  "amount": 142500,
  "_vaxix_rerouted": "/v1/charges ➔ /v2/checkout/pay"
}`,
      astDiff: `// consumer-app/src/services/checkout.ts (ts-morph AST Refactor)
- return await http.post('/v1/charges', payload);
+ return await http.post('/v2/checkout/pay', payload);
// Ephemeral Sandbox Probe: PASS (HTTP 200 in 72ms) | Ed25519 Cert Verified`,
    },
    timestamp: {
      apiName: 'Salesforce SObject Sync',
      scenarioId: 'TYPE_MUTATED',
      endpoint: '/services/data/v60.0/sobjects/Invoice',
      isSensitive: false,
      clientReq: `POST /services/data/v60.0/sobjects/Invoice HTTP/1.1
Content-Type: application/json

{
  "invoice_id": "inv_8820",
  "amount": "25000.00",
  "tax": "1250.00"
}`,
      upstreamErr: `HTTP/1.1 422 Unprocessable Entity
Content-Type: application/problem+json

{
  "error": "Expected numerical float for field 'amount', received string: '25000.00'"
}`,
      healedRes: `HTTP/1.1 200 OK
X-Vaxix-Type-Coerced: string->integer
X-Vaxix-Overhead: 0.95ms

{
  "invoice_id": "inv_8820",
  "amount": 25000,
  "tax": 1250,
  "_vaxix_type_coerced": "string ➔ integer"
}`,
      astDiff: `// consumer-app/src/schemas/invoice.ts (ts-morph AST Refactor)
- amount: z.number(),
+ amount: z.union([z.number(), z.string().transform(Number)]),
// Ephemeral Sandbox Probe: PASS (HTTP 200 in 48ms) | Ed25519 Cert Verified`,
    },
  };

  const currentPayload = scenarioPayloads[selectedSabotage];

  const runSimulation = async () => {
    setIsRunning(true);
    setOutcome('idle');
    setLogs(['[03:14:02.000] 💥 SABOTAGE INJECTED: Dispatching API call to upstream vendor...']);

    try {
      const response = await fetch('/api/sabotage/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: currentPayload.scenarioId,
          mode: pathMode,
          endpoint: currentPayload.endpoint,
          allow_sensitive_override: !sensitiveGuard,
          cluster_id: 'aws-us-east-1-primary',
        }),
      });

      const data = await response.json();
      const latency = data.wire_latency || `${data.latency_ms || 1.15}ms`;
      const eventId = data.event_id || `evt_${Date.now()}`;
      setServerMetrics({ latencyMs: parseFloat(latency) || 1.15, eventId });

      setTimeout(() => {
        if (data.mode === 'path_b_sensitive_locked') {
          // Sensitive financial route guarded
          setLogs((prev) => [
            ...prev,
            `[03:14:02.102] 🛡️ SENSITIVE ROUTE DETECTED: Endpoint ${currentPayload.endpoint} is classified as FINANCIAL.`,
            '[03:14:02.103] 🚫 POLICY ENFORCED: In-flight live payload rewriting is STRICTLY FORBIDDEN on financial endpoints.',
            '[03:14:02.104] ⚠️ FAIL-OPEN TRIGGERED: Vendor error passed honestly to caller (HTTP 400 Bad Request).',
            '[03:14:02.150] 📦 HUMAN APPROVAL LANE: GitHub PR #414 opened with sandbox proof. SRE review mandatory.',
            '[03:14:02.200] 🔒 AUDIT LEDGER: Event cryptographically appended to SHA-256 hash chain.',
          ]);
          setOutcome('sensitive_blocked');
        } else if (data.mode === 'path_b') {
          // Cold-start Path B
          setLogs((prev) => [
            ...prev,
            '[03:14:02.102] 💥 UPSTREAM BREAK: Vendor introduced unannounced breaking schema change.',
            '[03:14:02.103] ⚠️ COLD-START OUTAGE: No antibody cached in local memory. Vendor returns HTTP 400.',
            '[03:14:02.104] 🛡️ FAIL-OPEN CIRCUIT BREAKER: Error passed honestly to caller in <2ms. Application never hangs.',
            '[03:14:02.120] 🧬 ASYNC CONTROL PLANE: RFC 9457 problem details captured. ts-morph synthesizing AST fix.',
            '[03:14:02.190] 🧪 EPHEMERAL SANDBOX: Unit test probe verified in 65ms (HTTP 200).',
            '[03:14:02.280] 📦 GITHUB PULL REQUEST OPENED: PR #414 ready for mandatory human review. Zero auto-merge.',
            '[03:14:02.320] 🔒 AUDIT LEDGER: Entry linked to SHA-256 hash chain (Zero Body Retention).',
          ]);
          setOutcome('path_b_outage');
        } else {
          // Path A Pre-Flight Inoculation
          setLogs((prev) => [
            ...prev,
            '[03:14:02.102] 🛡️ ACTIVE ANTIBODY DETECTED: Locally cached Ed25519-signed rule matched.',
            `[03:14:02.103] ⚡ PRE-FLIGHT REWRITE: In-process AST mutation executed in ${latency} before network transmission.`,
            '[03:14:02.145] 🚀 SINGLE ROUNDTRIP: Upstream vendor received valid schema and returned HTTP 200 OK directly.',
            '[03:14:02.146] ✅ ZERO DOWNTIME: Caller received 200 OK. Total added latency < 1.2ms.',
            '[03:14:02.180] 🔒 COMPLIANCE: Entry committed to tamper-evident SHA-256 ledger.',
          ]);
          setOutcome('path_a_success');
        }
        setIsRunning(false);
      }, 600);
    } catch {
      setLogs((prev) => [
        ...prev,
        '[03:14:02.105] 🛡️ FAIL-OPEN ACTIVE: Internal fallback triggered. Upstream request protected.',
      ]);
      setIsRunning(false);
      setOutcome('path_a_success');
    }
  };

  const resetConsole = () => {
    setLogs(['System standby. Select an API sabotage vector above and click "Simulate 3:00 AM Mutation".']);
    setOutcome('idle');
    setIsRunning(false);
  };

  return (
    <section id="break-my-api" className="py-24 bg-[#FBFBF9] relative border-y border-[#D4AF37]/20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#997D25] uppercase mb-4 shadow-sm">
            Interactive Sabotage Arena
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0B0B0C] font-display">
            Sabotage an API. Watch Driftshot Contain It in &lt; 2ms.
          </h2>
          <p className="mt-4 text-[#6E6E73] text-lg">
            Experience the Two Honest Paths in real time. Simulate breaking schema drift, fail-open circuit breaker protection, and sensitive financial route locking.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/arena"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#D4AF37] text-xs font-mono font-bold text-[#0B0B0C] hover:bg-[#0B0B0C] hover:text-[#F3E5AB] transition-all shadow-sm"
            >
              <span>Launch Fullscreen Interactive Studio</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            </Link>
          </div>
        </div>

        {/* Console Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Attack Configuration */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B0B0C] font-mono flex items-center gap-2">
                <Skull className="w-4 h-4 text-[#D4AF37]" />
                Select Upstream Sabotage
              </h3>
              {logs.length > 1 && (
                <button
                  suppressHydrationWarning
                  onClick={resetConsole}
                  className="text-xs font-mono text-[#6E6E73] hover:text-[#0B0B0C] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Scenario Buttons */}
            <div className="space-y-2.5">
              <button
                suppressHydrationWarning
                onClick={() => setSelectedSabotage('rename')}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedSabotage === 'rename'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-sm'
                    : 'border-black/10 hover:border-[#D4AF37]/40 bg-[#FBFBF9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0B0B0C]">1. Stripe: Field Deprecation</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">FINANCIAL</span>
                </div>
                <div className="text-xs text-[#6E6E73] mt-1 font-mono">`source` ➔ `payment_method` (RFC 9745)</div>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => setSelectedSabotage('delete')}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedSabotage === 'delete'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-sm'
                    : 'border-black/10 hover:border-[#D4AF37]/40 bg-[#FBFBF9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0B0B0C]">2. Twilio: Endpoint Sunset</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">RFC 8594</span>
                </div>
                <div className="text-xs text-[#6E6E73] mt-1 font-mono">`/v1/charges` ➔ `/v2/checkout/pay`</div>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => setSelectedSabotage('timestamp')}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedSabotage === 'timestamp'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-sm'
                    : 'border-black/10 hover:border-[#D4AF37]/40 bg-[#FBFBF9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0B0B0C]">3. Salesforce: Type Mutation</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">RFC 9457</span>
                </div>
                <div className="text-xs text-[#6E6E73] mt-1 font-mono">String Float ➔ Numeric Integer Coercion</div>
              </button>
            </div>

            {/* TWO-PATH SELECTOR TOGGLE */}
            <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#D4AF37]/30 space-y-2">
              <span className="text-xs font-mono font-bold text-[#0B0B0C] block uppercase tracking-wider">
                Operational Execution Path:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  suppressHydrationWarning
                  onClick={() => setPathMode('path_a')}
                  className={`p-2.5 rounded-xl text-left border text-xs font-mono transition-all cursor-pointer ${
                    pathMode === 'path_a'
                      ? 'bg-[#0B0B0C] text-emerald-300 border-emerald-500 font-bold'
                      : 'bg-white border-black/10 text-[#6E6E73] hover:text-[#0B0B0C]'
                  }`}
                >
                  <div className="font-bold text-[11px] text-emerald-400">PATH A: KNOWN DRIFT</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Pre-flight in SDK &lt;2ms</div>
                </button>

                <button
                  suppressHydrationWarning
                  onClick={() => setPathMode('path_b')}
                  className={`p-2.5 rounded-xl text-left border text-xs font-mono transition-all cursor-pointer ${
                    pathMode === 'path_b'
                      ? 'bg-[#0B0B0C] text-amber-300 border-amber-500 font-bold'
                      : 'bg-white border-black/10 text-[#6E6E73] hover:text-[#0B0B0C]'
                  }`}
                >
                  <div className="font-bold text-[11px] text-amber-400">PATH B: COLD START</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Honest 400 + Auto PR</div>
                </button>
              </div>
            </div>

            {/* SENSITIVE ENDPOINT GUARD TOGGLE */}
            <div className="p-3 rounded-2xl bg-[#FBFBF9] border border-[#D4AF37]/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#0B0B0C] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  Sensitive Endpoint Guard
                </span>
                <span className="text-[10px] text-[#6E6E73] block mt-0.5">
                  Hard-locks payment routes to PR-only (PCI-DSS)
                </span>
              </div>
              <button
                suppressHydrationWarning
                onClick={() => setSensitiveGuard(!sensitiveGuard)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  sensitiveGuard ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sensitiveGuard ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              suppressHydrationWarning
              onClick={runSimulation}
              disabled={isRunning}
              className="w-full py-4 rounded-2xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:bg-black hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>Executing Sovereign Simulation...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                  <span>Simulate 3:00 AM API Mutation</span>
                </>
              )}
            </button>

            <div className="p-3 rounded-xl bg-[#FBFBF9] border border-[#D4AF37]/20 flex items-center justify-between text-[11px] font-mono text-[#6E6E73]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#997D25]" /> Fail-Open Circuit Breaker:
              </span>
              <span className="text-emerald-700 font-bold">BUDGET &lt; 2ms P99</span>
            </div>
          </div>

          {/* Right Column: Interactive Terminal & Payload Inspector */}
          <div className="lg:col-span-7 bg-[#0B0B0C] rounded-3xl p-6 border border-[#D4AF37]/40 shadow-2xl text-white font-mono text-xs overflow-hidden">
            {/* Top Bar with Mode Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 mb-4 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="ml-2 text-white/50 text-[11px] hidden sm:inline">vaxix-driftshot://containment</span>
              </div>

              {/* View Switcher: Telemetry vs Wire Payloads vs AST Diff */}
              <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl">
                <button
                  suppressHydrationWarning
                  onClick={() => setActiveTab('telemetry')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'telemetry' ? 'bg-[#D4AF37] text-[#0B0B0C]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Activity className="w-3 h-3" /> Telemetry
                </button>
                <button
                  suppressHydrationWarning
                  onClick={() => setActiveTab('payload')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'payload' ? 'bg-[#D4AF37] text-[#0B0B0C]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3 h-3" /> Wire Payloads
                </button>
                <button
                  suppressHydrationWarning
                  onClick={() => setActiveTab('ast')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'ast' ? 'bg-[#D4AF37] text-[#0B0B0C]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <GitPullRequest className="w-3 h-3" /> AST Codemod
                </button>
              </div>
            </div>

            {/* TAB 1: Live Telemetry Logs */}
            {activeTab === 'telemetry' && (
              <div className="space-y-2.5 min-h-[300px] max-h-[360px] overflow-y-auto pr-2">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`leading-relaxed ${
                      log.includes('💥') || log.includes('🚫')
                        ? 'text-[#EF4444]'
                        : log.includes('🛡️') || log.includes('✅') || log.includes('⚡')
                        ? 'text-[#10B981] font-bold'
                        : log.includes('📦') || log.includes('🧬') || log.includes('🔒')
                        ? 'text-[#D4AF37]'
                        : log.includes('⚠️')
                        ? 'text-amber-300'
                        : 'text-white/70'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Raw In-Flight Payloads */}
            {activeTab === 'payload' && (
              <div className="space-y-3.5 min-h-[300px] max-h-[360px] overflow-y-auto pr-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-white/40 mb-1">
                    1. Outbound Downstream Request (Zero Customer Secrets):
                  </div>
                  <pre className="bg-black/60 p-2.5 rounded-xl text-white/80 text-[11px] overflow-x-auto border border-white/5">
                    {currentPayload.clientReq}
                  </pre>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-red-400 mb-1">
                    2. Upstream Vendor 3:00 AM Response (RFC 8594/9745/9457):
                  </div>
                  <pre className="bg-red-950/20 p-2.5 rounded-xl text-red-300 text-[11px] overflow-x-auto border border-red-500/20">
                    {currentPayload.upstreamErr}
                  </pre>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">
                    3. Path A: In-Process Pre-Flight Rewritten Response (&lt; 2ms Overhead):
                  </div>
                  <pre className="bg-emerald-950/20 p-2.5 rounded-xl text-emerald-300 text-[11px] overflow-x-auto border border-emerald-500/20">
                    {currentPayload.healedRes}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 3: Synthesized AST Codemod */}
            {activeTab === 'ast' && (
              <div className="min-h-[300px] max-h-[360px] overflow-y-auto pr-2 space-y-3">
                <div className="text-[10px] uppercase font-bold text-[#D4AF37] mb-1">
                  Deterministic AST Patch (ts-morph / LibCST • 0% Hallucinations)
                </div>
                <pre className="bg-black/60 p-3 rounded-xl text-[#F3E5AB] text-[11px] overflow-x-auto border border-[#D4AF37]/30 leading-relaxed">
                  {currentPayload.astDiff}
                </pre>
                <div className="p-3 bg-white/5 rounded-xl text-xs text-white/70 space-y-1">
                  <div className="text-white font-bold">Cryptographic Attestation &amp; Verification Proof:</div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    • Ephemeral Staging Sandbox Probe: PASS (HTTP 200 in 65ms)
                  </div>
                  <div className="text-[10px] text-[#D4AF37] font-mono">
                    • Ed25519 Root Key Signature: Attached upon SRE Human Review &amp; Merge
                  </div>
                </div>
              </div>
            )}

            {outcome === 'path_a_success' && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[#10B981] text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Path A: In-Process Pre-Flight Inoculated (&lt;1.2ms) • 1 Roundtrip Only</span>
                </div>
                <span className="text-white/40">
                  Lat: {serverMetrics?.latencyMs ? `${serverMetrics.latencyMs}ms` : '1.15ms'}
                </span>
              </div>
            )}

            {outcome === 'path_b_outage' && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-amber-400 text-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Path B: Cold-Start 400 Caught • PR #414 Opened • Mandatory Human Gate</span>
                </div>
                <span className="text-white/40">Fail-Open Active</span>
              </div>
            )}

            {outcome === 'sensitive_blocked' && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-red-400 text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-400" />
                  <span>Sensitive Route Protected: Live Rewrite Forbidden. Routed to PR #414.</span>
                </div>
                <span className="text-white/40">PCI-DSS v4.0 Invariant</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
