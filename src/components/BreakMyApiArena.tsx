'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  AlertTriangle,
  GitPullRequest,
  Activity,
  FileCode,
  Terminal,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Sliders,
  ExternalLink,
} from 'lucide-react';

interface SabotageScenario {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  description: string;
  service: string;
  rawBroken: object;
  healedPayload: object;
  astDiff: {
    filename: string;
    before: string;
    after: string;
  };
}

const scenarios: SabotageScenario[] = [
  {
    id: 'PROPERTY_RENAMED',
    name: '1. Property Rename Attack',
    tag: 'BREAKING SCHEMA',
    tagColor: 'bg-red-100 text-red-700 border-red-300',
    description: 'Stripe silently renames `customer_email` ➔ `email_address` in webhook event payload.',
    service: 'Stripe Payments v2026-03-01',
    rawBroken: {
      id: 'ch_3N4xLm2eZvKYlo2C1',
      object: 'charge',
      amount: 4900,
      currency: 'usd',
      // Notice customer_email is MISSING, replaced with email_address
      email_address: 'patron@sovereign-holdings.ch',
      status: 'succeeded',
    },
    healedPayload: {
      id: 'ch_3N4xLm2eZvKYlo2C1',
      object: 'charge',
      amount: 4900,
      currency: 'usd',
      // Healed in-flight: both fields populated transparently in 0.4ms
      customer_email: 'patron@sovereign-holdings.ch',
      email_address: 'patron@sovereign-holdings.ch',
      _immunix_synthetic_bridge: true,
      _latency_penalty_ms: 0.38,
      status: 'succeeded',
    },
    astDiff: {
      filename: 'src/services/billing/stripeWebhook.ts',
      before: `// Line 42: Legacy consumer expects customer_email
export function handleCharge(charge: StripeCharge) {
  const recipient = charge.customer_email;
  sendReceiptEmail(recipient, charge.amount);
}`,
      after: `// Line 42: Refactored deterministically by IMMUNIX AST Engine
export function handleCharge(charge: StripeCharge) {
  // Safe-alias fallback supporting both legacy and v2026 schema
  const recipient = charge.email_address ?? charge.customer_email;
  sendReceiptEmail(recipient, charge.amount);
}`,
    },
  },
  {
    id: 'ENDPOINT_RELOCATED',
    name: '2. Endpoint Relocation Attack',
    tag: '404 NOT FOUND',
    tagColor: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Upstream gateway relocates `/v1/charges` ➔ `/v2/checkout/pay` with zero migration window.',
    service: 'Core Banking API v2',
    rawBroken: {
      error: 'Not Found',
      status: 404,
      message: 'Route /v1/charges is terminated. Use /v2/checkout/pay.',
    },
    healedPayload: {
      status: 200,
      transaction_id: 'tx_9814a0f',
      cleared: true,
      amount: 142500,
      _immunix_rerouted_from: '/v1/charges',
      _immunix_rerouted_to: '/v2/checkout/pay',
      _latency_penalty_ms: 0.42,
    },
    astDiff: {
      filename: 'src/clients/bankingClient.ts',
      before: `export async function executeCharge(payload: ChargeRequest) {
  return await http.post('/v1/charges', payload);
}`,
      after: `export async function executeCharge(payload: ChargeRequest) {
  // Relocated to v2 endpoint per contract audit #IMMUNIX-ATB-4819
  return await http.post('/v2/checkout/pay', payload);
}`,
    },
  },
  {
    id: 'TYPE_MUTATED',
    name: '3. Type Mutation Attack',
    tag: 'SERIALIZATION DRIFT',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Upstream microservice mutates integer `amount: 25000` to numeric string `"25000"`.',
    service: 'Twilio / FinOps Billing',
    rawBroken: {
      invoice_id: 'inv_8820',
      // Mutated to string - breaks strict runtime validators (Zod/ArkType)
      amount: '25000.00',
      tax: '1250.00',
    },
    healedPayload: {
      invoice_id: 'inv_8820',
      amount: 25000.0,
      tax: 1250.0,
      _immunix_type_coerced: ['amount: string->number', 'tax: string->number'],
      _latency_penalty_ms: 0.29,
    },
    astDiff: {
      filename: 'src/schemas/invoiceSchema.ts',
      before: `export const InvoiceSchema = z.object({
  invoice_id: z.string(),
  amount: z.number().positive(),
  tax: z.number(),
});`,
      after: `export const InvoiceSchema = z.object({
  invoice_id: z.string(),
  // Coerces string representation to retain compatibility
  amount: z.union([z.number(), z.string().transform(Number)]),
  tax: z.union([z.number(), z.string().transform(Number)]),
});`,
    },
  },
  {
    id: 'ENVELOPE_WRAPPED',
    name: '4. Envelope Encapsulation Attack',
    tag: 'NESTED ENVELOPE',
    tagColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Provider wraps flat JSON array `[...]` inside `{ status: "success", data: [...] }`.',
    service: 'Salesforce CRM Graph',
    rawBroken: {
      status: 'success',
      data: [
        { id: 'usr_1', email: 'director@enterprise.com' },
        { id: 'usr_2', email: 'vp@enterprise.com' },
      ],
      meta: { page: 1, total: 2 },
    },
    healedPayload: {
      // In-flight transparent unwrap for legacy callers
      data: [
        { id: 'usr_1', email: 'director@enterprise.com' },
        { id: 'usr_2', email: 'vp@enterprise.com' },
      ],
      _immunix_envelope_unwrapped: true,
      _latency_penalty_ms: 0.35,
    },
    astDiff: {
      filename: 'src/integrations/crmFetcher.ts',
      before: `export async function fetchUsers() {
  const users = await api.get('/users');
  return users.map(u => u.email); // Crashes: users.map is not a function
}`,
      after: `export async function fetchUsers() {
  const res = await api.get('/users');
  const users = Array.isArray(res) ? res : res.data;
  return users.map(u => u.email);
}`,
    },
  },
];

export default function BreakMyApiArena() {
  const [activeScenario, setActiveScenario] = useState<SabotageScenario>(scenarios[0]);
  const [consoleTab, setConsoleTab] = useState<'telemetry' | 'payload_diff' | 'ast_codemod' | 'sandbox_probe'>('telemetry');
  const [logs, setLogs] = useState<string[]>([
    `[0.000s] 🟢 STANDBY: In-flight eBPF socket interceptor active on port 443.`,
    `[0.000s] 🛡️ 14,280 global clusters connected to sovereign immune mesh.`,
    `[0.000s] ⚡ Ready. Click any sabotage attack on the left to inject contract mutation.`,
  ]);
  const [isHealing, setIsHealing] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const triggerSabotage = async (scenario: SabotageScenario) => {
    setActiveScenario(scenario);
    setIsHealing(true);
    setHasRun(true);

    // Initial shock
    setLogs([
      `[0.000s] 💥 SABOTAGE INJECTED: Upstream deployed breaking change on ${scenario.service}!`,
      `[0.000s] ⚠️ Unshielded clients would crash with Fatal TypeError / HTTP 500!`,
    ]);

    try {
      const res = await fetch('/api/sabotage/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scenario.id }),
      });
      const data = await res.json();

      // Speed 1: Wire Inception in 0.4ms
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          `[0.001s] ⚡ SPEED 1 RESCUE: eBPF/WASM Proxy intercepted mutated socket payload in ${data.wire_interception_speed || '0.38ms'}!`,
          `[0.002s] 🛡️ Outage Shield Active: Zero customer downtime. In-flight synthetic bridge applied.`,
          `[0.003s] 💳 Client Transaction Succeeded (HTTP 200 OK delivered with legacy contract).`,
        ]);
      }, 450);

      // Speed 2: Permanent AST repair
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          `[0.014s] 🧬 SPEED 2 DNA REPAIR: AST engine refactored client call sites in ${scenario.astDiff.filename}.`,
          `[0.038s] 🧪 UNMOCKED SANDBOX PROBE: Spun ephemeral microVM; verified HTTP 200 against live upstream.`,
          `[0.052s] 🚀 PULL REQUEST OPENED: #204 "fix(${scenario.service.split(' ')[0].toLowerCase()}): adapt to schema drift"`,
          `[0.060s] 🌐 HERD IMMUNITY: Broadcasted vaccine antibody definition to 14,280 clusters globally!`,
        ]);
        setIsHealing(false);
      }, 1250);
    } catch {
      setIsHealing(false);
    }
  };

  return (
    <section id="breakmyapi-arena" className="py-24 bg-[#FBFBF9] border-y border-[#D4AF37]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" /> Interactive Public Arena
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-[#0B0B0C] tracking-tight">
            The 3:00 AM Sabotage Challenge
          </h2>
          <p className="mt-4 text-[#6E6E73] text-base sm:text-lg leading-relaxed">
            Choose a breaking change below. Watch Immunix intercept the outage at socket wire-time in{' '}
            <strong className="text-[#0B0B0C] font-semibold">0.4 milliseconds</strong> and synthesize a verified deterministic AST pull request.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls: Sabotage Scenario Selectors */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#997D25]">
                Select Sabotage Attack:
              </span>
              <span className="text-[11px] font-mono text-[#6E6E73]">4 Scenarios Ready</span>
            </div>

            {scenarios.map((scenario) => {
              const isSelected = activeScenario.id === scenario.id;
              return (
                <button
                  key={scenario.id}
                  onClick={() => triggerSabotage(scenario)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#D4AF37] shadow-[0_12px_35px_rgba(212,175,55,0.22)] ring-1 ring-[#D4AF37]'
                      : 'bg-white/80 hover:bg-white border-[#D4AF37]/30 hover:border-[#D4AF37]/70 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#0B0B0C] font-heading flex items-center gap-2">
                      {scenario.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase ${scenario.tagColor}`}
                    >
                      {scenario.tag}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#6E6E73] font-mono leading-relaxed">
                    {scenario.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#997D25] font-semibold">{scenario.service}</span>
                    <span className="text-[#10B981] font-bold flex items-center gap-1">
                      {isHealing && isSelected ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" /> Incepting...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" /> Auto-Heal in 0.4ms
                        </>
                      )}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Quick explanation pill */}
            <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/25 text-xs text-[#6E6E73] font-mono">
              <strong className="text-[#0B0B0C]">Dual-Speed Defense:</strong>
              <div className="mt-1">
                • <strong>Speed 1 (In-Flight):</strong> Wire interception protects current live users.
              </div>
              <div>
                • <strong>Speed 2 (Codebase):</strong> Deterministic AST PR fixes the repository permanently.
              </div>
            </div>
          </div>

          {/* Right Panel: Multi-Tab Interactive Telemetry & Code Inspection Console */}
          <div className="lg:col-span-7 bg-[#0B0B0C] rounded-3xl border border-[#D4AF37]/50 shadow-[0_20px_60px_rgba(212,175,55,0.18)] overflow-hidden font-mono text-xs flex flex-col min-h-[540px]">
            {/* Top Terminal Bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#141416]">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="text-white/40 text-[11px] ml-2 hidden sm:inline">
                  immunix-telemetry-engine — kernel_socket_443
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#D4AF37] text-[11px] uppercase font-bold tracking-widest">
                <Activity className={`w-3.5 h-3.5 ${isHealing ? 'animate-spin' : ''}`} />
                <span>{isHealing ? 'Healing In-Flight...' : 'In-Flight Active'}</span>
              </div>
            </div>

            {/* Tab Selectors */}
            <div className="flex items-center gap-1 px-4 pt-2.5 border-b border-white/10 bg-[#0E0E10] overflow-x-auto text-[11px]">
              <button
                onClick={() => setConsoleTab('telemetry')}
                className={`px-3 py-2 border-b-2 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  consoleTab === 'telemetry'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> Execution Telemetry
              </button>

              <button
                onClick={() => setConsoleTab('payload_diff')}
                className={`px-3 py-2 border-b-2 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  consoleTab === 'payload_diff'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> Wire Payload Bridge
              </button>

              <button
                onClick={() => setConsoleTab('ast_codemod')}
                className={`px-3 py-2 border-b-2 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  consoleTab === 'ast_codemod'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <GitPullRequest className="w-3.5 h-3.5" /> Deterministic AST PR
              </button>

              <button
                onClick={() => setConsoleTab('sandbox_probe')}
                className={`px-3 py-2 border-b-2 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  consoleTab === 'sandbox_probe'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" /> Sandbox Probe
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 flex-1 overflow-y-auto">
              {/* TAB 1: TELEMETRY STREAM */}
              {consoleTab === 'telemetry' && (
                <div className="space-y-2.5">
                  <div className="text-white/40 pb-2 border-b border-white/10 text-[11px] flex justify-between">
                    <span>Target Scenario: {activeScenario.name}</span>
                    <span className="text-[#10B981]">Mean Intercept: 0.38ms</span>
                  </div>

                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`leading-relaxed ${
                        log.includes('SABOTAGE')
                          ? 'text-red-400 font-bold bg-red-950/20 p-2 rounded-lg border border-red-500/20'
                          : log.includes('SPEED 1')
                          ? 'text-[#D4AF37] font-bold bg-[#D4AF37]/10 p-2 rounded-lg border border-[#D4AF37]/30'
                          : log.includes('SPEED 2')
                          ? 'text-sky-300 font-semibold'
                          : log.includes('HERD IMMUNITY')
                          ? 'text-emerald-400 font-bold'
                          : 'text-white/70'
                      }`}
                    >
                      {log}
                    </div>
                  ))}

                  {logs.length > 3 && (
                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[#10B981] flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Outage Shielded. Zero customer impact.
                      </span>
                      <button
                        onClick={() => setConsoleTab('payload_diff')}
                        className="text-[#D4AF37] hover:underline flex items-center gap-1"
                      >
                        Inspect Healed Payload <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: WIRE PAYLOAD BRIDGE */}
              {consoleTab === 'payload_diff' && (
                <div className="space-y-4">
                  <div className="text-white/60 text-xs">
                    Comparing Raw Broken Payload from upstream vs In-Flight Healed Response synthesized by IMMUNIX eBPF proxy:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Raw Broken */}
                    <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30">
                      <div className="text-red-400 font-bold text-xs mb-2 flex items-center justify-between">
                        <span>❌ RAW UPSTREAM RESPONSE</span>
                        <span className="text-[10px] bg-red-500/20 px-2 py-0.5 rounded">FATAL DRIFT</span>
                      </div>
                      <pre className="text-red-200 text-[11px] overflow-x-auto leading-relaxed">
                        {JSON.stringify(activeScenario.rawBroken, null, 2)}
                      </pre>
                      <div className="mt-3 text-[10px] text-red-400/80 italic">
                        Unshielded application crashes on missing property or invalid data types.
                      </div>
                    </div>

                    {/* Right: Healed */}
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40">
                      <div className="text-emerald-400 font-bold text-xs mb-2 flex items-center justify-between">
                        <span>🛡️ IMMUNIX HEALED WIRE (0.38ms)</span>
                        <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">200 OK</span>
                      </div>
                      <pre className="text-emerald-200 text-[11px] overflow-x-auto leading-relaxed">
                        {JSON.stringify(activeScenario.healedPayload, null, 2)}
                      </pre>
                      <div className="mt-3 text-[10px] text-emerald-400 font-bold">
                        Dual-compatibility bridge added transparently in socket ring buffer.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: AST CODEMOD PR */}
              {consoleTab === 'ast_codemod' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/80 font-bold">
                      Pull Request #204: <span className="text-[#D4AF37] font-mono">fix({activeScenario.service.split(' ')[0].toLowerCase()}): adapt contract</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px]">
                      DETERMINISTIC AST
                    </span>
                  </div>

                  <div className="text-[11px] text-white/50">
                    File: <code className="text-[#D4AF37]">{activeScenario.astDiff.filename}</code>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30">
                      <div className="text-red-400 text-[10px] font-bold uppercase mb-1">
                        - BEFORE (Outdated Call Site)
                      </div>
                      <pre className="text-red-200 text-[11px] overflow-x-auto">
                        {activeScenario.astDiff.before}
                      </pre>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
                      <div className="text-emerald-400 text-[10px] font-bold uppercase mb-1">
                        + AFTER (IMMUNIX Codemod Patch)
                      </div>
                      <pre className="text-emerald-200 text-[11px] overflow-x-auto">
                        {activeScenario.astDiff.after}
                      </pre>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#6E6E73] flex items-center justify-between pt-2">
                    <span>Generated without LLM hallucination using TypeScript Compiler API AST traversals.</span>
                    <span className="text-[#10B981] font-bold">CI Passed: 48/48</span>
                  </div>
                </div>
              )}

              {/* TAB 4: UNMOCKED SANDBOX PROBE */}
              {consoleTab === 'sandbox_probe' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">Ephemeral MicroVM Validation Target</span>
                      <span className="text-[#10B981] font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> 100% UNMOCKED PASS
                      </span>
                    </div>

                    <div className="space-y-1.5 text-white/70">
                      <div>Target Host: <code className="text-[#D4AF37]">api.{activeScenario.service.split(' ')[0].toLowerCase()}.com/live/staging</code></div>
                      <div>Probe Type: <code>Autonomous Ephemeral Contract Verification</code></div>
                      <div>TLS Handshake: <code>1.4ms (TLS 1.3 / ChaCha20-Poly1305)</code></div>
                      <div>Response Status: <code className="text-[#10B981]">HTTP 200 OK (Contract Verified)</code></div>
                      <div>Regression Suite: <code className="text-[#10B981]">0 Failed Assertions</code></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] leading-relaxed">
                    <strong>Why Unmocked Sandboxes Matter:</strong> Unlike legacy linters or static mocks, IMMUNIX never creates a pull request until the patch is verified against a live, isolated staging endpoint using our proprietary Model Context Protocol probe.
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Terminal Action Bar */}
            <div className="px-5 py-3.5 border-t border-white/10 bg-[#141416] flex items-center justify-between text-[11px] text-[#6E6E73]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>eBPF Kernel Socket Monitor Active</span>
              </div>

              <button
                onClick={() => triggerSabotage(activeScenario)}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-[#D4AF37]" /> Re-fire Attack
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

