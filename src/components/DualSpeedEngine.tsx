'use client';

import React, { useState } from 'react';
import {
  Zap,
  Dna,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  GitBranch,
  CheckCircle2,
  Terminal,
  Activity,
  Radio,
} from 'lucide-react';

export default function DualSpeedEngine() {
  const [activeSpeed, setActiveSpeed] = useState<'speed1' | 'speed2' | 'herd'>('speed1');

  return (
    <section id="dual-speed-engine" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" /> Core Sovereign Architecture
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-[#0B0B0C] tracking-tight">
            The Dual-Speed Immune Engine
          </h2>
          <p className="mt-4 text-[#6E6E73] text-base sm:text-lg leading-relaxed">
            Why traditional API monitoring and schema linters fail: alerts only tell you that production has crashed. 
            IMMUNIX pairs sub-millisecond wire-level interception with deterministic codebase refactoring.
          </p>
        </div>

        {/* Speed Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#FBFBF9] border border-[#D4AF37]/30 shadow-md">
            <button
              onClick={() => setActiveSpeed('speed1')}
              className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSpeed === 'speed1'
                  ? 'bg-[#0B0B0C] text-white shadow-[0_4px_15px_rgba(212,175,55,0.25)]'
                  : 'text-[#6E6E73] hover:text-[#0B0B0C]'
              }`}
            >
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span>Speed 1: In-Flight Wire Inception (&lt; 0.4ms)</span>
            </button>

            <button
              onClick={() => setActiveSpeed('speed2')}
              className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSpeed === 'speed2'
                  ? 'bg-[#0B0B0C] text-white shadow-[0_4px_15px_rgba(212,175,55,0.25)]'
                  : 'text-[#6E6E73] hover:text-[#0B0B0C]'
              }`}
            >
              <Dna className="w-4 h-4 text-[#D4AF37]" />
              <span>Speed 2: Deterministic AST Repair</span>
            </button>

            <button
              onClick={() => setActiveSpeed('herd')}
              className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSpeed === 'herd'
                  ? 'bg-[#0B0B0C] text-white shadow-[0_4px_15px_rgba(212,175,55,0.25)]'
                  : 'text-[#6E6E73] hover:text-[#0B0B0C]'
              }`}
            >
              <Radio className="w-4 h-4 text-[#D4AF37]" />
              <span>Layer 3: Global Herd Immunity</span>
            </button>
          </div>
        </div>

        {/* Dynamic Architecture Display */}
        <div className="rounded-3xl border border-[#D4AF37]/30 bg-[#FBFBF9] p-8 lg:p-12 shadow-xl">
          {activeSpeed === 'speed1' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] font-mono text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  0.38ms In-Flight Socket Latency
                </div>
                <h3 className="text-3xl font-heading font-black text-[#0B0B0C]">
                  Wire-Time Socket Interception (eBPF + WASM)
                </h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed">
                  Attached directly to the Linux kernel socket buffer via safe eBPF kprobes, IMMUNIX inspects outbound HTTP/TLS responses in real time. 
                  When an upstream vendor mutates an endpoint or renames a key, our WebAssembly byte-stream engine synthesizes a backwards-compatible bridge on the wire.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Zero Customer Outage Window:</strong>
                      <p className="text-xs text-[#6E6E73]">Your users never see an error modal; payments and checkout orders clear smoothly.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Kernel-Safe Memory Sandboxing:</strong>
                      <p className="text-xs text-[#6E6E73]">Verified by the standard Linux eBPF in-kernel verifier. Zero risk of kernel panic or memory corruption.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Zero Data Storage / Pure Ephemeral:</strong>
                      <p className="text-xs text-[#6E6E73]">Raw payload streams pass through without ever writing to disks or external relays.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Flow Visual */}
              <div className="lg:col-span-6 bg-[#0B0B0C] rounded-2xl p-6 border border-[#D4AF37]/40 text-white font-mono text-xs shadow-2xl space-y-4">
                <div className="text-[#D4AF37] font-bold pb-2 border-b border-white/10 flex justify-between">
                  <span>SOCKET EXECUTION LIFECYCLE</span>
                  <span>TOTAL: 0.38ms</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-red-400 font-bold">1. Upstream Egress Received</div>
                      <div className="text-[11px] text-white/50">Stripe sends 200 OK with mutated payload</div>
                    </div>
                    <span className="text-[#D4AF37]">0.00ms</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-between">
                    <div>
                      <div className="text-[#D4AF37] font-bold">2. eBPF Hook Intercept</div>
                      <div className="text-[11px] text-white/70">Signature mismatch captured by WASM ring</div>
                    </div>
                    <span className="text-[#10B981] font-bold">+0.12ms</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                    <div>
                      <div className="text-emerald-400 font-bold">3. In-Flight Bridge Synthesized</div>
                      <div className="text-[11px] text-white/70">Legacy properties mapped, schema intact</div>
                    </div>
                    <span className="text-[#10B981] font-bold">+0.26ms</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">4. Application User Space Delivery</div>
                      <div className="text-[11px] text-white/50">Node.js / Go / Java receives expected schema</div>
                    </div>
                    <span className="text-white/60">Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSpeed === 'speed2' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-600 font-mono text-xs font-bold">
                  <GitBranch className="w-3.5 h-3.5" />
                  Deterministic AST Refactoring
                </div>
                <h3 className="text-3xl font-heading font-black text-[#0B0B0C]">
                  Permanent Genetic Codebase Repair
                </h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed">
                  Wire-time interception is an emergency shield, not a permanent architecture. Within seconds of an upstream mutation, IMMUNIX’s deterministic AST engine crawls your Git repositories, identifies every single call site, and generates a zero-hallucination Pull Request.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Zero LLM Hallucinations:</strong>
                      <p className="text-xs text-[#6E6E73]">Built upon the TypeScript and Babel Compiler APIs. Every transform is mathematically provable.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Unmocked Sandbox Probe:</strong>
                      <p className="text-xs text-[#6E6E73]">Before any PR is created, the patch runs inside an isolated microVM against the live upstream staging target.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">One-Click Merge & Clean Retirement:</strong>
                      <p className="text-xs text-[#6E6E73]">Once the PR merges and deploys to production, the wire-level antibody automatically stands down.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Flow Visual */}
              <div className="lg:col-span-6 bg-[#0B0B0C] rounded-2xl p-6 border border-[#D4AF37]/40 text-white font-mono text-xs shadow-2xl space-y-4">
                <div className="text-[#D4AF37] font-bold pb-2 border-b border-white/10 flex justify-between">
                  <span>AST PIPELINE VERIFICATION</span>
                  <span className="text-[#10B981]">PASSED 100%</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-[#D4AF37] font-bold">1. AST Crawler identifies 3 call sites:</div>
                  <div className="text-white/60 text-[11px] pl-3">
                    • <code>src/services/billing.ts (Line 42)</code><br />
                    • <code>src/workers/receiptWorker.ts (Line 18)</code><br />
                    • <code>src/types/stripeEvents.d.ts (Line 89)</code>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-blue-400 font-bold">2. MicroVM Sandbox Probe:</div>
                  <div className="text-white/60 text-[11px] pl-3">
                    • Spin ephemeral Firecracker VM in 18ms<br />
                    • Run full unit & integration suite (48 tests)<br />
                    • Staging endpoint test: HTTP 200 OK verified
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="text-emerald-400 font-bold">3. GitHub PR Auto-Opened:</div>
                  <div className="text-white/70 text-[11px] pl-3">
                    • Branch: <code>immunix/heal-stripe-v2026-03</code><br />
                    • Reviewers auto-assigned with cryptographic audit trail
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSpeed === 'herd' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#997D25] font-mono text-xs font-bold">
                  <Radio className="w-3.5 h-3.5" />
                  Collective Defense Mesh
                </div>
                <h3 className="text-3xl font-heading font-black text-[#0B0B0C]">
                  Global Herd Immunity Network
                </h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed">
                  When a breaking change hits an enterprise in Tokyo at 3:00 AM, the first cluster synthesizes and proves the antibody. Within milliseconds, the cryptographically signed vaccine rule is synchronized to 14,280 clusters worldwide.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Pre-Emptive Inoculation:</strong>
                      <p className="text-xs text-[#6E6E73]">Your clusters are protected before the upstream vendor’s phased rollout even reaches your region.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Cryptographic Signature Verification:</strong>
                      <p className="text-xs text-[#6E6E73]">Antibodies are signed with Ed25519 sovereign root keys to prevent rogue or poisoned rules.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Zero Knowledge Sharing:</strong>
                      <p className="text-xs text-[#6E6E73]">Only the abstract schema diff and WASM translation bytecode are propagated. No customer data or IP ever leaves the origin cluster.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Flow Visual */}
              <div className="lg:col-span-6 bg-[#0B0B0C] rounded-2xl p-6 border border-[#D4AF37]/40 text-white font-mono text-xs shadow-2xl space-y-4">
                <div className="text-[#D4AF37] font-bold pb-2 border-b border-white/10 flex justify-between">
                  <span>PEER-TO-PEER IMMUNE GOSSIP</span>
                  <span className="text-[#10B981]">14,280 CLUSTERS</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-[#D4AF37]">
                      <span>Node: Tokyo-01 (Discovery)</span>
                      <span>T+0.00ms</span>
                    </div>
                    <div className="text-white/60 text-[11px] mt-1">Discovered breaking Salesforce v59 mutation. Synthesized antibody #ATB-4819.</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-blue-400">
                      <span>Broadcast: Frankfurt-04 (Inoculated)</span>
                      <span>T+2.40ms</span>
                    </div>
                    <div className="text-white/60 text-[11px] mt-1">Vaccine rule received & verified via Ed25519 consensus.</div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Node: NewYork-Primary (Inoculated)</span>
                      <span>T+3.80ms</span>
                    </div>
                    <div className="text-white/70 text-[11px] mt-1">Inoculated 6 hours before provider’s US-East rollout hit. 0 downtime.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

