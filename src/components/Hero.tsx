'use client';

import React from 'react';
import { Shield, Zap, ArrowRight, Terminal, CheckCircle2, Lock, Sparkles, Activity } from 'lucide-react';
import ImmuneHelix3D from './ImmuneHelix3D';

interface HeroProps {
  onOpenConsole: () => void;
  onOpenAudit: () => void;
  onOpenDossier?: () => void;
}

export default function Hero({ onOpenConsole, onOpenAudit, onOpenDossier }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-white luxury-grid-bg">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#D4AF37]/10 via-[#F3E5AB]/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Sovereign Copy & CTA Hierarchy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Sovereign Badge */}
            <button
              onClick={onOpenDossier}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FBFBF9] border border-[#D4AF37]/40 shadow-[0_2px_12px_rgba(212,175,55,0.12)] hover:border-[#D4AF37] transition-all cursor-pointer text-left"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#D4AF37]" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#997D25] uppercase">
                SOVEREIGN SOFTWARE IMMUNOLOGY
              </span>
              <span className="text-[#D4AF37]">•</span>
              <span className="text-[11px] font-mono text-[#0B0B0C] font-semibold">
                0.4ms Wire Inception Whitepaper ➔
              </span>
            </button>

            {/* Master Headline */}
            <h1 className="font-heading text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-[#0B0B0C] leading-[1.05]">
              The Autonomous <br />
              <span className="gold-gradient-text relative inline-block">
                Software Immune
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-transparent" />
              </span>{' '}
              Network.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#6E6E73] max-w-2xl leading-relaxed">
              When Stripe, Twilio, or internal microservices silently mutate their schemas at 3:00 AM, traditional systems throw HTTP 500s and trigger incident bridge rooms. 
              <strong className="text-[#0B0B0C] font-semibold"> IMMUNIX acts as biological DNA defense:</strong> intercepting broken contracts at socket wire-time in 0.4 milliseconds, synthesizing backwards-compatible bridges, and dispatching verified deterministic AST pull requests while customers transact with zero downtime.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#breakmyapi-arena"
                className="px-7 py-4 rounded-2xl bg-[#0B0B0C] text-white font-mono font-bold text-xs uppercase tracking-wider border border-[#D4AF37] hover:border-[#F3E5AB] hover:shadow-[0_10px_35px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                <span>Enter Sabotage Arena</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onOpenConsole}
                className="px-7 py-4 rounded-2xl bg-white text-[#0B0B0C] font-mono font-bold text-xs uppercase tracking-wider border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#FBFBF9] hover:shadow-[0_8px_25px_rgba(212,175,55,0.12)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-[#997D25]" />
                <span>Launch Live Mesh Console</span>
              </button>

              <button
                onClick={onOpenAudit}
                className="px-5 py-4 rounded-2xl text-[#6E6E73] hover:text-[#0B0B0C] font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Sovereign SLA</span>
                <span className="text-[#10B981] font-bold">$5M</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-[#6E6E73] border-t border-[#D4AF37]/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Zero-Data Retention (eBPF in-kernel)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Deterministic AST Code Repair</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>SOC2 Type II & FedRAMP Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D DNA Mesh + Sovereign Card Framework */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-2 bg-gradient-to-b from-[#D4AF37]/30 via-white/80 to-[#D4AF37]/15 shadow-[0_20px_50px_rgba(212,175,55,0.15)]">
              <div className="relative rounded-[22px] bg-white border border-[#D4AF37]/30 overflow-hidden shadow-inner">
                {/* Visual Header */}
                <div className="px-5 py-3.5 bg-[#FBFBF9] border-b border-[#D4AF37]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                    <span className="text-[11px] font-mono text-[#6E6E73] ml-2">
                      immunix_mesh_v4.dna
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#10B981] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                    <span>0.38ms Inception</span>
                  </div>
                </div>

                {/* The 3D DNA Canvas */}
                <div className="h-[430px] w-full bg-gradient-to-b from-white via-[#FBFBF9] to-white relative">
                  <ImmuneHelix3D interactive={true} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Telemetry Ticker Ribbon */}
        <div className="mt-16 rounded-3xl bg-[#0B0B0C] border border-[#D4AF37]/40 p-6 md:p-8 shadow-2xl text-white">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                Wire Inception Speed
              </div>
              <div className="text-2xl lg:text-3xl font-black font-mono text-white">0.38 ms</div>
              <div className="text-[10px] font-mono text-[#10B981]">eBPF socket intercept</div>
            </div>

            <div className="space-y-1 pt-4 md:pt-0 md:pl-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                Outage Shield Factor
              </div>
              <div className="text-2xl lg:text-3xl font-black font-mono text-white">99.999%</div>
              <div className="text-[10px] font-mono text-[#6E6E73]">0 customer drops</div>
            </div>

            <div className="space-y-1 pt-4 md:pt-0 md:pl-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                Inoculated Nodes
              </div>
              <div className="text-2xl lg:text-3xl font-black font-mono text-white">14,280</div>
              <div className="text-[10px] font-mono text-[#10B981]">Global herd sync</div>
            </div>

            <div className="space-y-1 pt-4 md:pt-0 md:pl-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                Capital Loss Averted
              </div>
              <div className="text-2xl lg:text-3xl font-black font-mono text-white">$412M+</div>
              <div className="text-[10px] font-mono text-[#D4AF37]">Across 842 enterprises</div>
            </div>

            <div className="space-y-1 pt-4 md:pt-0 md:pl-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                AST Code Repairs
              </div>
              <div className="text-2xl lg:text-3xl font-black font-mono text-white">489,120</div>
              <div className="text-[10px] font-mono text-[#6E6E73]">Verified pull requests</div>
            </div>

            <div className="space-y-1 pt-4 md:pt-0 md:pl-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                Sovereign Warranty
              </div>
              <div className="text-2xl lg:text-3xl font-black font-mono text-[#10B981]">$5.0M</div>
              <div className="text-[10px] font-mono text-[#D4AF37]">Underwritten SLA</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

