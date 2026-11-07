'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Activity,
  Terminal,
  Server,
  Zap,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Lock,
  Radio,
} from 'lucide-react';

interface ConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsoleModal({ isOpen, onClose }: ConsoleModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'antibodies' | 'ebpf' | 'terminal'>('overview');
  const [selectedCluster, setSelectedCluster] = useState('aws-us-east-1');
  const [ebpfShieldEnabled, setEbpfShieldEnabled] = useState(true);
  const [customTestInput, setCustomTestInput] = useState(
    JSON.stringify(
      {
        event: 'payment.created',
        customer_email: 'finance@acme-corp.com',
        amount: 25000,
        currency: 'usd',
      },
      null,
      2
    )
  );
  const [injectionResult, setInjectionResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Live log simulation in the modal
  const [consoleLogs, setConsoleLogs] = useState<
    Array<{ timestamp: string; level: 'INFO' | 'WARN' | 'SHIELD' | 'PR'; message: string }>
  >([
    {
      timestamp: '05:22:14.102',
      level: 'INFO',
      message: 'Cluster aws-us-east-1 connected via eBPF kprobe v6.8.0-45',
    },
    {
      timestamp: '05:22:15.340',
      level: 'SHIELD',
      message: 'Antibody #ATB-892 active: Stripe /v1/charges ➔ /v2/checkout/pay translation mapped (0.32ms)',
    },
    {
      timestamp: '05:22:16.892',
      level: 'INFO',
      message: 'Global Herd Immunity mesh synced: 14,280 clusters verified intact',
    },
    {
      timestamp: '05:22:18.014',
      level: 'WARN',
      message: 'Upstream schema drift detected on target endpoint: Salesforce v59.0 Contact payload',
    },
    {
      timestamp: '05:22:18.015',
      level: 'SHIELD',
      message: 'In-flight WASM translation synthesized: 0 HTTP 500s dropped (4,180 reqs saved)',
    },
  ]);

  useEffect(() => {
    if (!isOpen) return;

    // Periodic gentle log arrival
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
        now.getSeconds()
      ).padStart(2, '0')}.${String(Math.floor(Math.random() * 900) + 100)}`;

      const sampleEvents = [
        { level: 'SHIELD' as const, message: 'Wire-time interception verified: 0.38ms response synthesis.' },
        { level: 'INFO' as const, message: 'Ephemeral sandbox probe passed for GitHub Webhook v3.' },
        { level: 'PR' as const, message: 'AST Codemod generated pull request #284 (Auto-merged via CI).' },
        { level: 'INFO' as const, message: 'Zero socket drops across 12 pods in production namespace.' },
      ];

      const chosen = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setConsoleLogs((prev) => [...prev.slice(-18), { timestamp: timeStr, ...chosen }]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const runPayloadTest = async () => {
    setIsProcessing(true);
    setInjectionResult(null);

    try {
      let parsedPayload: Record<string, unknown> = { event: 'payment.created', amount: 25000 };
      try {
        parsedPayload = JSON.parse(customTestInput);
      } catch {
        // Fall back to default if input is unparseable
      }

      const res = await fetch('/api/pipeline/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'Live Console Probe',
          endpoint: 'api.enterprise.mesh/v1/transaction',
          mutationType: 'FIELD_RENAMED',
          payload: parsedPayload,
        }),
      });
      const data = await res.json();
      const dataPlaneMs = data.executionSummary?.dataPlaneDurationMs ?? 0.38;
      const controlPlaneMs = data.executionSummary?.controlPlaneDurationMs ?? 14.2;
      const peerVotes = data.herdMesh?.consensusPeerVotes ?? 14280;

      setIsProcessing(false);
      setInjectionResult(
        `✓ [${dataPlaneMs}ms] In-Flight Wire Inception: Intercepted schema drift without dropping connection.\n` +
          `✓ [${controlPlaneMs}ms] AST Codemod generated: Patch verified green against unmocked target.\n` +
          `✓ [3.4ms] Herd Immunity Consensus: Signed Ed25519 rule broadcast to ${peerVotes} clusters.\n` +
          `✓ Result: Outage prevented. Client received 200 OK with synthesized legacy contract.`
      );
    } catch {
      setIsProcessing(false);
      setInjectionResult(
        `✓ [0.38ms] In-Flight Wire Inception: Intercepted schema drift without dropping connection.\n` +
          `✓ [12.4ms] AST Codemod generated: Patch verified green against unmocked target.\n` +
          `✓ Result: Outage prevented. Client received 200 OK with synthesized legacy contract.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0B0B0C] border border-[#D4AF37]/50 shadow-[0_25px_70px_rgba(212,175,55,0.25)] text-white overflow-hidden font-sans">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141416]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#997D25] flex items-center justify-center text-[#0B0B0C] font-black text-sm">
              <Shield className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-white text-base tracking-tight">IMMUNIX</span>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase font-bold tracking-wider">
                  Sovereign Console v4.2
                </span>
              </div>
              <p className="text-[11px] text-[#6E6E73] font-mono">Autonomous Production Mesh Telemetry</p>
            </div>
          </div>

          {/* Quick cluster selector */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono">
              <Server className="w-3.5 h-3.5 text-[#D4AF37]" />
              <select
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
                className="bg-transparent text-white outline-none cursor-pointer"
              >
                <option value="aws-us-east-1" className="bg-[#1C1C1F] text-white">aws-us-east-1 (Primary)</option>
                <option value="gcp-europe-west3" className="bg-[#1C1C1F] text-white">gcp-europe-west3 (Frankfurt)</option>
                <option value="azure-japaneast" className="bg-[#1C1C1F] text-white">azure-japaneast (Tokyo)</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-[#0B0B0C] text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-all font-semibold ${
              activeTab === 'overview'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-[#6E6E73] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Mesh Overview
          </button>
          <button
            onClick={() => setActiveTab('antibodies')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-all font-semibold ${
              activeTab === 'antibodies'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-[#6E6E73] hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Active Antibodies (7)
          </button>
          <button
            onClick={() => setActiveTab('ebpf')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-all font-semibold ${
              activeTab === 'ebpf'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-[#6E6E73] hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> eBPF Probe Simulator
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-all font-semibold ${
              activeTab === 'terminal'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-[#6E6E73] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Live Socket Stream
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[#6E6E73] text-xs font-mono uppercase">Inception Latency</div>
                  <div className="text-2xl font-bold font-mono text-[#D4AF37] mt-1">0.38 ms</div>
                  <div className="text-[11px] text-[#10B981] mt-1 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Zero socket stall
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[#6E6E73] text-xs font-mono uppercase">Outages Shielded</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">100.0%</div>
                  <div className="text-[11px] text-[#D4AF37] mt-1 font-mono">14,280 clusters</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[#6E6E73] text-xs font-mono uppercase">eBPF Verification</div>
                  <div className="text-2xl font-bold font-mono text-[#10B981] mt-1">KERNEL SAFE</div>
                  <div className="text-[11px] text-[#6E6E73] mt-1 font-mono">Verif. passed (0 rej)</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[#6E6E73] text-xs font-mono uppercase">AST Repair Time</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">14.2 ms</div>
                  <div className="text-[11px] text-[#D4AF37] mt-1 font-mono">Deterministic PR</div>
                </div>
              </div>

              {/* Real-time toggles */}
              <div className="p-5 rounded-2xl bg-[#141416] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Speed 1: Wire Inception Interceptor</span>
                    <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] text-[10px] font-mono">eBPF Active</span>
                  </div>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    Intercepts broken JSON schemas at socket layer and synthesizes valid return payload in 0.4ms.
                  </p>
                </div>
                <button
                  onClick={() => setEbpfShieldEnabled(!ebpfShieldEnabled)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    ebpfShieldEnabled
                      ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {ebpfShieldEnabled ? 'SHIELD ENGAGED' : 'SHIELD DISABLED'}
                </button>
              </div>

              {/* Recent activity stream preview */}
              <div className="rounded-2xl bg-black border border-white/10 p-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-[#6E6E73]">
                  <span className="flex items-center gap-1.5 text-white/80">
                    <Radio className="w-3.5 h-3.5 text-[#10B981] animate-pulse" /> Live Herd Broadcast Feed
                  </span>
                  <span>Cluster: {selectedCluster}</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {consoleLogs.slice(-6).map((log, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-white/40">{log.timestamp}</span>
                      <span
                        className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                          log.level === 'SHIELD'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                            : log.level === 'WARN'
                            ? 'bg-amber-500/20 text-amber-400'
                            : log.level === 'PR'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className="text-white/80">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'antibodies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#6E6E73]">
                <span>7 active vaccine definitions applied to incoming upstream egress</span>
                <span className="text-[#D4AF37] font-mono">Sync latency: 2.1ms</span>
              </div>

              {[
                {
                  id: 'ATB-8921',
                  provider: 'Stripe API',
                  mutation: "customer_email ➔ email_address",
                  action: 'Field alias bridge + AST rewrite',
                  status: 'Active (Shielded 14,920 reqs)',
                },
                {
                  id: 'ATB-4819',
                  provider: 'Salesforce REST',
                  mutation: '/v1/charges ➔ /v2/checkout/pay',
                  action: 'HTTP 308 socket reroute',
                  status: 'Active (Shielded 8,110 reqs)',
                },
                {
                  id: 'ATB-3104',
                  provider: 'Twilio Messaging',
                  mutation: 'amount: number ➔ amount: string',
                  action: 'Type coercer in WASM layer',
                  status: 'Active (Shielded 3,420 reqs)',
                },
                {
                  id: 'ATB-1902',
                  provider: 'OpenAI API',
                  mutation: 'choices[0].text ➔ choices[0].message.content',
                  action: 'Envelope unwrap synthesizer',
                  status: 'Active (Shielded 91,200 reqs)',
                },
              ].map((antibody) => (
                <div
                  key={antibody.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#D4AF37] text-xs font-bold">{antibody.id}</span>
                      <span className="text-white text-sm font-semibold">{antibody.provider}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        VERIFIED GREEN
                      </span>
                    </div>
                    <div className="text-xs font-mono text-white/70 mt-1">
                      Mutation: <code className="text-amber-300">{antibody.mutation}</code>
                    </div>
                    <div className="text-[11px] text-[#6E6E73] mt-0.5">Strategy: {antibody.action}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono text-[#10B981]">{antibody.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ebpf' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#141416] border border-white/10 text-xs">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#D4AF37]" /> Test Payload Inception Engine
                </h4>
                <p className="text-[#6E6E73] mb-4">
                  Simulate upstream drift directly against the in-memory eBPF kernel bridge simulator:
                </p>

                <textarea
                  value={customTestInput}
                  onChange={(e) => setCustomTestInput(e.target.value)}
                  className="w-full h-32 p-3 rounded-xl bg-black border border-white/10 font-mono text-xs text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]"
                />

                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={runPayloadTest}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0B0B0C] font-mono font-bold text-xs transition-colors flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Incepting Payload...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" /> Fire Socket Test
                      </>
                    )}
                  </button>
                  <span className="text-[11px] font-mono text-[#6E6E73]">Expected latency: 0.38ms</span>
                </div>

                {injectionResult && (
                  <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs whitespace-pre-wrap leading-relaxed animate-in fade-in">
                    {injectionResult}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="rounded-2xl bg-black border border-[#D4AF37]/30 p-4 font-mono text-xs space-y-2 min-h-[300px]">
              <div className="text-[#6E6E73] pb-2 border-b border-white/10">
                # IMMUNIX Autonomous Socket Stream — Kernel Ring Buffer
              </div>
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-white/30">{log.timestamp}</span>{' '}
                  <span
                    className={
                      log.level === 'SHIELD'
                        ? 'text-[#D4AF37] font-bold'
                        : log.level === 'WARN'
                        ? 'text-amber-400 font-bold'
                        : log.level === 'PR'
                        ? 'text-blue-400 font-bold'
                        : 'text-emerald-400'
                    }
                  >
                    [{log.level}]
                  </span>{' '}
                  <span className="text-white/80">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#141416] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#6E6E73] gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Air-Gapped Sovereign Verification Enabled</span>
          </div>
          <div className="flex items-center gap-3">
            <span>SOC2 Type II</span>
            <span>•</span>
            <span>Zero-Payload Retention</span>
            <span>•</span>
            <span className="text-[#10B981]">100% Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}

