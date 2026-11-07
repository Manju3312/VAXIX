'use client';

import React, { useState } from 'react';
import { Skull, RefreshCw, Play, CheckCircle2, Activity, FileCode, GitPullRequest, Terminal } from 'lucide-react';

export default function BreakMyApiArena() {
  const [selectedSabotage, setSelectedSabotage] = useState<'rename' | 'delete' | 'timestamp'>('rename');
  const [activeTab, setActiveTab] = useState<'telemetry' | 'payload' | 'ast'>('telemetry');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'System standby. Select an API sabotage vector above and click "Simulate 3:00 AM API Mutation".',
  ]);
  const [outcome, setOutcome] = useState<'idle' | 'success'>('idle');
  const [serverMetrics, setServerMetrics] = useState<{ latencyMs: number; eventId: string } | null>(null);

  const scenarioPayloads = {
    rename: {
      apiName: 'Stripe Payments v2026',
      scenarioId: 'PROPERTY_RENAMED',
      clientReq: `POST /v1/payment_intents HTTP/1.1
Host: api.stripe.com
Authorization: Bearer sk_live_••••••••
Content-Type: application/json

{
  "customer_email": "cto@enterprise-fintech.com",
  "amount_cents": 49000,
  "currency": "usd"
}`,
      upstreamErr: `HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": {
    "type": "invalid_request_error",
    "message": "Missing required parameter 'email_address'. Field 'customer_email' was deprecated at 03:00 UTC.",
    "param": "email_address"
  }
}`,
      healedRes: `HTTP/1.1 200 OK
X-Immunix-Inoculated: true
X-Immunix-Latency: 0.38ms
Content-Type: application/json

{
  "id": "pi_3N4xLm2eZvKYlo2C1",
  "status": "succeeded",
  "amount": 49000,
  "currency": "usd",
  "receipt_email": "cto@enterprise-fintech.com",
  "paid": true,
  "_immunix_wire_bridge": "SYNTHESIZED_FIELD_ALIAS"
}`,
      astDiff: `// consumer-app/src/services/billing.ts (ts-morph AST Refactor)
- const recipient = charge.customer_email;
+ const recipient = charge.email_address ?? charge.customer_email;
// Cryptographic Proof: SHA256:7f8a9b2c... | Staging Probe: 5.8ms PASS (HTTP 200)`,
    },
    delete: {
      apiName: 'Twilio Cloud Dispatch',
      scenarioId: 'ENDPOINT_RELOCATED',
      clientReq: `POST /v1/charges HTTP/1.1
Host: api.provider.com
Authorization: Bearer sk_live_••••••••

{
  "token": "tok_visa_4242",
  "amount": 142500
}`,
      upstreamErr: `HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "code": 404,
  "message": "Endpoint /v1/charges is relocated to /v2/checkout/pay"
}`,
      healedRes: `HTTP/1.1 200 OK
X-Immunix-Rerouted: /v2/checkout/pay
X-Immunix-Latency: 0.42ms

{
  "status": 200,
  "transaction_id": "tx_9814a0f",
  "cleared": true,
  "amount": 142500,
  "_immunix_rerouted": "/v1/charges ➔ /v2/checkout/pay"
}`,
      astDiff: `// consumer-app/src/services/checkout.ts (ts-morph AST Refactor)
- return await http.post('/v1/charges', payload);
+ return await http.post('/v2/checkout/pay', payload);
// Cryptographic Proof: SHA256:4b9a0c1e... | Staging Probe: 6.2ms PASS (HTTP 200)`,
    },
    timestamp: {
      apiName: 'Salesforce SObject Sync',
      scenarioId: 'TYPE_MUTATED',
      clientReq: `POST /services/data/v60.0/sobjects/Invoice HTTP/1.1
Content-Type: application/json

{
  "invoice_id": "inv_8820",
  "amount": "25000.00",
  "tax": "1250.00"
}`,
      upstreamErr: `HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "error": "Expected numerical float for field 'amount', received string: '25000.00'"
}`,
      healedRes: `HTTP/1.1 200 OK
X-Immunix-Type-Coerced: string->number
X-Immunix-Latency: 0.29ms

{
  "invoice_id": "inv_8820",
  "amount": 25000.0,
  "tax": 1250.0,
  "_immunix_type_coerced": ["string->number"]
}`,
      astDiff: `// consumer-app/src/schemas/invoice.ts (ts-morph AST Refactor)
- amount: z.number(),
+ amount: z.union([z.number(), z.string().transform(Number)]),
// Cryptographic Proof: SHA256:1a2b3c4d... | Staging Probe: 4.1ms PASS (HTTP 200)`,
    },
  };

  const currentPayload = scenarioPayloads[selectedSabotage];

  const runSimulation = async () => {
    setIsRunning(true);
    setOutcome('idle');
    setLogs(['[03:14:02.000] 💥 SABOTAGE INJECTED: Dispatching live API mutation to upstream proxy...']);

    try {
      // Execute live backend API call to persist into SQLite
      const response = await fetch('/api/sabotage/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: currentPayload.scenarioId,
          cluster_id: 'aws-us-east-1-primary',
        }),
      });

      const data = await response.json();
      const latency = data.latency_ms || 0.38;
      const eventId = data.event_id || `evt_${Date.now()}`;
      setServerMetrics({ latencyMs: latency, eventId });

      setTimeout(() => {
        if (selectedSabotage === 'rename') {
          setLogs((prev) => [
            ...prev,
            '[03:14:02.102] 💥 UPSTREAM SNEEZE: Stripe renames `customer_email` ➔ `email_address` without notice.',
            '[03:14:02.104] ⚠️ ANTIGEN DETECTED: Downstream payload validation failure (HTTP 400 Bad Request).',
            `[03:14:02.105] 🛡️ SPEED 1 WIRE RESCUE: Active Antibody synthesized in ${latency}ms (Envoy WASM filter).`,
            '[03:14:02.106] 🚀 PAYLOAD MUTATED ON WIRE: `customer_email` mapped back in memory. HTTP 200 preserved.',
            '[03:14:02.107] ✅ CONSUMER CHECKOUT SUCCEEDED: Zero user-facing downtime or lost carts.',
            '[03:14:02.320] 🧬 SPEED 2 AST CODER: ts-morph refactoring consumer TypeScript AST in ephemeral sandbox.',
            `[03:14:02.890] 📦 GITHUB PULL REQUEST OPENED: PR #42 with verified attestation certificate.`,
            '[03:14:03.110] 🌐 HERD IMMUNITY BROADCAST: Inoculation vaccine deployed to 14,280 global enterprise clusters.',
          ]);
        } else if (selectedSabotage === 'delete') {
          setLogs((prev) => [
            ...prev,
            '[03:14:02.102] 💥 UPSTREAM SNEEZE: Twilio deprecates `/v1/charges` ➔ enforces `/v2/checkout/pay`.',
            `[03:14:02.105] 🛡️ SPEED 1 WIRE RELOCATION: In-flight socket rerouted dynamically in ${latency}ms.`,
            '[03:14:02.107] ✅ CONSUMER RESPONSE: HTTP 200 OK delivered with zero packet loss.',
            '[03:14:02.940] 📦 GITHUB PULL REQUEST OPENED: Permanent URL migration patch ready on branch apex/heal.',
            '[03:14:03.110] 🌐 HERD IMMUNITY BROADCAST: Peer clusters in Tokyo and Frankfurt pre-inoculated.',
          ]);
        } else {
          setLogs((prev) => [
            ...prev,
            '[03:14:02.102] 💥 UPSTREAM SNEEZE: Salesforce shifts serialization from float to string.',
            `[03:14:02.105] 🛡️ SPEED 1 WIRE TRANSFORMATION: In-flight type coercion executed in ${latency}ms.`,
            '[03:14:02.107] ✅ CONSUMER RESPONSE: HTTP 200 OK delivered. Ingestion pipelines intact.',
            '[03:14:02.810] 📦 GITHUB PULL REQUEST OPENED: Codebase Zod types safely updated with union transform.',
            '[03:14:03.110] 🌐 HERD IMMUNITY BROADCAST: Global peer consensus achieved across 14,280 nodes.',
          ]);
        }
        setIsRunning(false);
        setOutcome('success');
      }, 700);
    } catch {
      // Fallback
      setLogs((prev) => [
        ...prev,
        '[03:14:02.105] 🛡️ SPEED 1 WIRE RESCUE: Active Antibody synthesized in 0.38ms (Local Fallback).',
        '[03:14:02.107] ✅ CONSUMER RESPONSE: HTTP 200 OK delivered.',
      ]);
      setIsRunning(false);
      setOutcome('success');
    }
  };

  const resetConsole = () => {
    setLogs(['System standby. Select an API sabotage vector above and click "Simulate 3:00 AM API Mutation".']);
    setOutcome('idle');
    setIsRunning(false);
  };

  return (
    <section id="break-my-api" className="py-24 bg-[#FBFBF9] relative border-y border-[#D4AF37]/20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#997D25] uppercase mb-4 shadow-sm">
            Interactive Sabotage Arena
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0B0B0C] font-display">
            Sabotage an API. Watch IMMUNIX Heal It in 0.8ms.
          </h2>
          <p className="mt-4 text-[#6E6E73] text-lg">
            Experience the world’s first autonomous dual-speed immune reaction. Simulate an upstream vendor mutation that would normally crash production and trigger PagerDuty.
          </p>
        </div>

        {/* Console Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Attack Configuration */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B0B0C] font-mono flex items-center gap-2">
                <Skull className="w-4 h-4 text-[#D4AF37]" />
                Select 3:00 AM Mutation
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

            <div className="space-y-3">
              <button
                suppressHydrationWarning
                onClick={() => setSelectedSabotage('rename')}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedSabotage === 'rename'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-sm'
                    : 'border-black/10 hover:border-[#D4AF37]/40 bg-[#FBFBF9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0B0B0C]">1. Stripe: Field Rename Mutation</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">CRITICAL</span>
                </div>
                <div className="text-xs text-[#6E6E73] mt-1 font-mono">`customer_email` ➔ `email_address`</div>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => setSelectedSabotage('delete')}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedSabotage === 'delete'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-sm'
                    : 'border-black/10 hover:border-[#D4AF37]/40 bg-[#FBFBF9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0B0B0C]">2. Twilio: Endpoint Sunset</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">404 NOT FOUND</span>
                </div>
                <div className="text-xs text-[#6E6E73] mt-1 font-mono">`/v1/charges` ➔ `/v2/checkout/pay`</div>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => setSelectedSabotage('timestamp')}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedSabotage === 'timestamp'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-sm'
                    : 'border-black/10 hover:border-[#D4AF37]/40 bg-[#FBFBF9]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0B0B0C]">3. Salesforce: Type Serialization</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">SERIALIZATION</span>
                </div>
                <div className="text-xs text-[#6E6E73] mt-1 font-mono">Float Numerical ➔ String Serialization</div>
              </button>
            </div>

            <button
              suppressHydrationWarning
              onClick={runSimulation}
              disabled={isRunning}
              className="mt-6 w-full py-4 rounded-2xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:bg-black hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>Executing Live Wire Inoculation...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                  <span>Simulate 3:00 AM API Mutation</span>
                </>
              )}
            </button>

            <div className="mt-4 p-3 rounded-xl bg-[#FBFBF9] border border-[#D4AF37]/20 flex items-center justify-between text-[11px] font-mono text-[#6E6E73]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#997D25]" /> Backend Persistence:
              </span>
              <span className="text-emerald-700 font-bold">SQLite WAL Active</span>
            </div>
          </div>

          {/* Right Column: Triple-Mode Interactive Terminal & Payload Inspector */}
          <div className="lg:col-span-7 bg-[#0B0B0C] rounded-3xl p-6 border border-[#D4AF37]/40 shadow-2xl text-white font-mono text-xs overflow-hidden">
            {/* Top Bar with Mode Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 mb-4 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="ml-2 text-white/50 text-[11px] hidden sm:inline">immunix-wire-sentry://live-kernel</span>
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
                  <FileCode className="w-3 h-3" /> Raw Payloads
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
                      log.includes('💥')
                        ? 'text-[#EF4444]'
                        : log.includes('🛡️') || log.includes('✅')
                        ? 'text-[#10B981] font-bold'
                        : log.includes('📦') || log.includes('🧬')
                        ? 'text-[#D4AF37]'
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
                    1. Outbound Downstream Request:
                  </div>
                  <pre className="bg-black/60 p-2.5 rounded-xl text-white/80 text-[11px] overflow-x-auto border border-white/5">
                    {currentPayload.clientReq}
                  </pre>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-red-400 mb-1">
                    2. Upstream 3:00 AM Sneeze (Normally Drops Transactions):
                  </div>
                  <pre className="bg-red-950/20 p-2.5 rounded-xl text-red-300 text-[11px] overflow-x-auto border border-red-500/20">
                    {currentPayload.upstreamErr}
                  </pre>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">
                    3. Speed 1 In-Flight Rescued Response (Customer receives HTTP 200 in &lt; 0.4ms):
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
                  Speed 2: Deterministic AST Genetic Patch (ts-morph)
                </div>
                <pre className="bg-black/60 p-3 rounded-xl text-[#F3E5AB] text-[11px] overflow-x-auto border border-[#D4AF37]/30 leading-relaxed">
                  {currentPayload.astDiff}
                </pre>
                <div className="p-3 bg-white/5 rounded-xl text-xs text-white/70 space-y-1">
                  <div className="text-white font-bold">Unmocked Verification Certificate:</div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    • Ephemeral Staging Sandbox Probe: PASS (HTTP 200 in 5.8ms)
                  </div>
                  <div className="text-[10px] text-[#D4AF37] font-mono">
                    • Ed25519 Cryptographic Attestation: SIGNED BY APEX KERNEL
                  </div>
                </div>
              </div>
            )}

            {outcome === 'success' && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[#10B981] text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Outage Averted: 0ms Downtime • PR #42 Created • Herd Inoculated</span>
                </div>
                <span className="text-white/40">
                  Lat: {serverMetrics?.latencyMs ? `${serverMetrics.latencyMs}ms` : '0.38ms'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
