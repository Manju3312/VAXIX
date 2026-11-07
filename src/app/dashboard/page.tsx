'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Activity,
  Zap,
  GitPullRequest,
  Key,
  Globe,
  LogOut,
  Plus,
  CheckCircle2,
  Play,
  Lock,
  ExternalLink,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';

interface SessionData {
  user: string;
  role: string;
  tenant: string;
  tier: string;
  token: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [session] = useState<SessionData | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const rawSession = localStorage.getItem('immunix_session');
        if (rawSession) {
          return JSON.parse(rawSession);
        }
        const demoSession: SessionData = {
          user: 'cto@sovereign-holdings.ch',
          role: 'Principal SRE & Infrastructure Architect',
          tenant: 'Sovereign Core Holdings',
          tier: 'Enterprise Grid',
          token: `imx_session_${Date.now()}`,
        };
        localStorage.setItem('immunix_session', JSON.stringify(demoSession));
        return demoSession;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'antibodies' | 'telemetry' | 'prs' | 'mesh' | 'keys'>('antibodies');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live state
  const [antibodies, setAntibodies] = useState([
    {
      id: 'ATB-1902',
      vendor: 'OpenAI API',
      pattern: 'choices[0].text ➔ choices[0].message.content',
      ruleType: 'PAYLOAD_REWRITE',
      status: 'active',
      rescues: 418290,
      latency: '0.34ms',
      createdAt: '2026-11-06 03:14 UTC',
    },
    {
      id: 'ATB-2810',
      vendor: 'Stripe Payments',
      pattern: 'customer_email ➔ email_address',
      ruleType: 'FIELD_ALIAS',
      status: 'active',
      rescues: 891400,
      latency: '0.38ms',
      createdAt: '2026-11-06 18:22 UTC',
    },
    {
      id: 'ATB-3041',
      vendor: 'Twilio Cloud',
      pattern: '/v1/charges ➔ /v2/checkout/pay',
      ruleType: 'URL_REROUTE',
      status: 'active',
      rescues: 142100,
      latency: '0.42ms',
      createdAt: '2026-11-07 01:05 UTC',
    },
    {
      id: 'ATB-4199',
      vendor: 'Salesforce CRM',
      pattern: 'amount: float ➔ amount: string',
      ruleType: 'TYPE_COERCION',
      status: 'active',
      rescues: 60280,
      latency: '0.29ms',
      createdAt: '2026-11-07 04:30 UTC',
    },
  ]);

  const [apiKeys, setApiKeys] = useState([
    {
      id: 'key_1',
      name: 'Production Envoy Sidecar us-east-1',
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

  const handleLogout = () => {
    try {
      localStorage.removeItem('immunix_session');
    } catch {}
    router.push('/login');
  };

  const toggleAntibody = (id: string) => {
    setAntibodies((prev) =>
      prev.map((atb) =>
        atb.id === id ? { ...atb, status: atb.status === 'active' ? 'paused' : 'active' } : atb
      )
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateKey = () => {
    const newKey = {
      id: `key_${Date.now()}`,
      name: `Edge Gateway ${new Date().toLocaleTimeString()}`,
      prefix: `imx_live_${Math.random().toString(36).substring(2, 6)}...`,
      created: 'Just now',
      lastUsed: 'Never',
      rateLimit: '6,000 req/min',
    };
    setApiKeys([newKey, ...apiKeys]);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#0B0B0C] flex flex-col selection:bg-[#D4AF37] selection:text-black">
      {/* Top Sovereign Navigation */}
      <header className="bg-white border-b border-[#D4AF37]/30 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          
          {/* Logo & Tenant badge */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0B0B0C] border border-[#D4AF37] flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="font-black text-lg tracking-wider text-[#0B0B0C] font-display">IMMUNIX</span>
            </Link>

            <div className="h-6 w-px bg-black/10 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              <span className="text-[#6E6E73]">{session?.tenant || 'Sovereign Core Holdings'}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#997D25] border border-[#D4AF37]/30 font-bold text-[10px]">
                {session?.tier || 'Enterprise Grid'}
              </span>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBFBF9] border border-[#D4AF37]/25 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>14,280 Inoculated Nodes</span>
            </div>

            <Link
              href="/"
              className="text-xs font-mono font-bold text-[#6E6E73] hover:text-[#0B0B0C] px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors"
            >
              Public Arena
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
        
        {/* Welcome & Global Health Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-sm">
          <div>
            <div className="text-xs font-mono text-[#997D25] uppercase tracking-wider font-bold">
              Autonomous Mesh Console • eBPF Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B0B0C] font-display mt-1">
              Production Infrastructure Health
            </h1>
            <p className="text-xs text-[#6E6E73] mt-1">
              All 7 cloud clusters currently protected under 100% zero-downtime financial SLA warranty.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/#break-my-api"
              className="px-4 py-2.5 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:bg-black transition-all flex items-center gap-2 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
              <span>Simulate Sabotage</span>
            </Link>
          </div>
        </div>

        {/* High-Level Telemetry Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-[#6E6E73] block uppercase tracking-wider">
              Shielded Traffic
            </span>
            <div className="text-2xl font-black text-[#0B0B0C] font-mono">1,912,626</div>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">↑ 18.4% this week</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-[#6E6E73] block uppercase tracking-wider">
              In-Flight Rescues
            </span>
            <div className="text-2xl font-black text-[#0B0B0C] font-mono">4,189</div>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">0.00ms downtime</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-[#6E6E73] block uppercase tracking-wider">
              Wire p99 Latency
            </span>
            <div className="text-2xl font-black text-[#997D25] font-mono">0.34ms</div>
            <span className="text-[10px] text-[#6E6E73] font-mono">Envoy WASM Kernel</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-[#6E6E73] block uppercase tracking-wider">
              Active Antibodies
            </span>
            <div className="text-2xl font-black text-[#0B0B0C] font-mono">{antibodies.filter(a => a.status === 'active').length} Active</div>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">Speed 1 Protected</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm space-y-1 col-span-2 lg:col-span-1">
            <span className="text-[11px] font-mono text-[#6E6E73] block uppercase tracking-wider">
              Herd Consensus
            </span>
            <div className="text-2xl font-black text-[#0B0B0C] font-mono">14,280 Nodes</div>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">Global Mesh Sync</span>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-[#D4AF37]/20 gap-2 overflow-x-auto pb-1">
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
            <span>Active Antibodies (Speed 1)</span>
          </button>

          <button
            suppressHydrationWarning
            onClick={() => setActiveTab('telemetry')}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'telemetry'
                ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37]'
                : 'text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-black/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Live Wire Telemetry</span>
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
            <span>DNA Repairs (Speed 2)</span>
          </button>

          <button
            suppressHydrationWarning
            onClick={() => setActiveTab('mesh')}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'mesh'
                ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37]'
                : 'text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-black/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Herd Mesh (Speed 3)</span>
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
            <span>API Keys & Secrets</span>
          </button>
        </div>

        {/* TAB 1: ACTIVE ANTIBODIES */}
        {activeTab === 'antibodies' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#0B0B0C]">Active Wire Antibodies</h3>
                <p className="text-xs text-[#6E6E73]">
                  Sub-millisecond WebAssembly byte-level filters transforming broken payloads in flight.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#D4AF37]/30 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#FBFBF9] border-b border-[#D4AF37]/20 text-[#6E6E73] uppercase">
                    <tr>
                      <th className="p-4">Antibody ID</th>
                      <th className="p-4">Target Vendor</th>
                      <th className="p-4">Mutation Vector</th>
                      <th className="p-4">Rule Type</th>
                      <th className="p-4">Rescued Traffic</th>
                      <th className="p-4">Wire Latency</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {antibodies.map((atb) => (
                      <tr key={atb.id} className="hover:bg-[#FBFBF9]/60 transition-colors">
                        <td className="p-4 font-bold text-[#0B0B0C]">{atb.id}</td>
                        <td className="p-4 font-sans font-bold text-[#0B0B0C]">{atb.vendor}</td>
                        <td className="p-4 text-[#6E6E73]">{atb.pattern}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-black/5 text-[#0B0B0C] border border-black/10 text-[10px]">
                            {atb.ruleType}
                          </span>
                        </td>
                        <td className="p-4 text-[#0B0B0C] font-bold">{atb.rescues.toLocaleString()} reqs</td>
                        <td className="p-4 text-[#997D25] font-bold">{atb.latency}</td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              atb.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}
                          >
                            {atb.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            suppressHydrationWarning
                            onClick={() => toggleAntibody(atb.id)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                              atb.status === 'active'
                                ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                            }`}
                          >
                            {atb.status === 'active' ? 'Retire Rule' : 'Reactivate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE TELEMETRY */}
        {activeTab === 'telemetry' && (
          <div className="bg-[#0B0B0C] rounded-3xl p-6 border border-[#D4AF37]/40 shadow-2xl text-white font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-white/60">telemetry-bus://clickhouse.immunix.internal:8443</span>
              </div>
              <span className="text-[#D4AF37] text-[11px] font-bold">50,000+ RPS Streaming Ingest</span>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-white/80">[07:44:12.102] POST api.stripe.com/v1/payment_intents (200 OK)</span>
                <span className="text-emerald-400 font-bold">ANTIBODY ATB-2810 IN-FLIGHT RESCUE (0.38ms)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-white/80">[07:44:12.089] POST api.openai.com/v1/chat/completions (200 OK)</span>
                <span className="text-white/50">PASSTHROUGH (0.04ms)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-white/80">[07:44:12.015] POST api.twilio.com/v2/checkout/pay (200 OK)</span>
                <span className="text-[#D4AF37] font-bold">REROUTED FROM SUNSET /v1/charges (0.42ms)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-white/80">[07:44:11.980] POST salesforce.internal/sobjects/Invoice (200 OK)</span>
                <span className="text-emerald-400 font-bold">TYPE COERCED FLOAT➔STRING (0.29ms)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-white/80">[07:44:11.890] GET api.plaid.com/investments/holdings/get (200 OK)</span>
                <span className="text-white/50">PASSTHROUGH (0.05ms)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DNA REPAIRS & PRS */}
        {activeTab === 'prs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0B0B0C]">Speed 2: Synthesized GitHub Pull Requests</h3>
            <p className="text-xs text-[#6E6E73]">
              Deterministic ts-morph AST codemods tested against ephemeral unmocked staging sandboxes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                    PASSED EPHEMERAL SANDBOX (5.8ms)
                  </span>
                  <span className="text-xs font-mono text-[#6E6E73]">PR #412</span>
                </div>
                <h4 className="text-base font-bold text-[#0B0B0C]">
                  fix(stripe): adopt official email_address parameter
                </h4>
                <p className="text-xs text-[#6E6E73] font-mono leading-relaxed">
                  Refactored 3 call sites in `consumer-app/src/services/billing.ts`. Upstream schema updated to v2026-03.
                </p>
                <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-600 font-bold">Cryptographically Signed</span>
                  <a href="#" className="text-[#997D25] hover:underline flex items-center gap-1 font-bold">
                    View on GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                    PASSED EPHEMERAL SANDBOX (6.2ms)
                  </span>
                  <span className="text-xs font-mono text-[#6E6E73]">PR #413</span>
                </div>
                <h4 className="text-base font-bold text-[#0B0B0C]">
                  fix(twilio): relocate /v1/charges ➔ /v2/checkout/pay
                </h4>
                <p className="text-xs text-[#6E6E73] font-mono leading-relaxed">
                  Updated caller endpoints in `consumer-app/src/services/checkout.ts`. Verified against staging provider sandbox.
                </p>
                <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-600 font-bold">Cryptographically Signed</span>
                  <a href="#" className="text-[#997D25] hover:underline flex items-center gap-1 font-bold">
                    View on GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HERD MESH */}
        {activeTab === 'mesh' && (
          <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/30 shadow-md space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#0B0B0C]">Global Herd Immunity P2P Ledger</h3>
              <p className="text-xs text-[#6E6E73]">
                Decentralized consensus mesh distributing verified antibodies worldwide in &lt; 2.0 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#D4AF37]/20 text-xs font-mono">
                <div className="text-[#997D25] font-bold uppercase mb-1">Tokyo Node (ap-ne-1)</div>
                <div className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Inoculated
                </div>
                <div className="text-[#6E6E73] text-[10px] mt-2">Latency: 0.34ms • 7 Antibodies</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#D4AF37]/20 text-xs font-mono">
                <div className="text-[#997D25] font-bold uppercase mb-1">Frankfurt Node (eu-central-1)</div>
                <div className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Inoculated
                </div>
                <div className="text-[#6E6E73] text-[10px] mt-2">Latency: 0.29ms • 7 Antibodies</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#D4AF37]/20 text-xs font-mono">
                <div className="text-[#997D25] font-bold uppercase mb-1">New York Node (us-east-1)</div>
                <div className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Inoculated
                </div>
                <div className="text-[#6E6E73] text-[10px] mt-2">Latency: 0.31ms • 7 Antibodies</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ZERO-KNOWLEDGE API KEYS */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B0B0C]">Zero-Knowledge API Keys</h3>
                <p className="text-xs text-[#6E6E73]">
                  Hashed with Argon2id. Used by Envoy sidecars and local SDKs to pull real-time cluster antibodies.
                </p>
              </div>

              <button
                suppressHydrationWarning
                onClick={handleCreateKey}
                className="px-4 py-2.5 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:bg-black transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Generate New Key</span>
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

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Zero Storage Security Policy: </strong>
                IMMUNIX never stores third-party credentials (such as Stripe secret keys). Upstream credentials pass through hardware memory buffers only.
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
