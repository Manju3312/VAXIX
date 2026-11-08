'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, ShieldCheck, Lock, Cpu, EyeOff, GitPullRequest } from 'lucide-react';
import ImmuneHelix3D from './ImmuneHelix3D';

interface HeroProps {
  onOpenConsole?: () => void;
  onOpenAudit?: () => void;
  onOpenDossier?: () => void;
}

export default function Hero({ onOpenDossier }: HeroProps = {}) {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden bg-white">
      {/* Background radial gold glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Sovereign Positioning */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FBFBF9] border border-[#D4AF37]/40 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#997D25] uppercase">
                Enterprise Sovereign Drift Containment
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0B0B0C] font-display leading-[1.08]">
              A Shot of Immunity <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#997D25] to-[#0B0B0C]">
                Against Vendor API Drift.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[#6E6E73] max-w-2xl leading-relaxed font-sans">
              Watch fast-moving external APIs (Stripe, OpenAI, Webhooks). Contain damage in-process in &lt;2ms with zero body retention, and deliver tested, human-approved fix PRs.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/arena"
                className="px-8 py-4 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border-2 border-[#D4AF37] font-bold text-sm tracking-wider uppercase hover:bg-black hover:shadow-[0_10px_35px_rgba(212,175,55,0.4)] transition-all flex items-center gap-3 group"
              >
                <span>Launch Sabotage Arena</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#system-architecture-map"
                className="px-8 py-4 rounded-xl bg-white text-[#0B0B0C] border border-[#D4AF37]/40 font-bold text-sm tracking-wider uppercase hover:border-[#D4AF37] hover:bg-[#FBFBF9] transition-all"
              >
                Inspect Two Paths
              </a>

              {onOpenDossier && (
                <button
                  suppressHydrationWarning
                  onClick={onOpenDossier}
                  className="px-6 py-4 rounded-xl bg-[#FBFBF9] text-[#997D25] border border-[#D4AF37]/30 font-mono text-xs uppercase tracking-wider hover:border-[#D4AF37] hover:bg-white transition-all cursor-pointer"
                >
                  Architecture Dossier ↗
                </button>
              )}
            </div>

            {/* The 5 Core Invariants Bar */}
            <div className="mt-12 pt-8 border-t border-[#D4AF37]/20 w-full">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#997D25] font-bold mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                The 5 Immutable Safety Invariants (SOC-2 / PCI-DSS v4.0)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-[#FBFBF9] border border-[#D4AF37]/20">
                  <div className="font-bold text-[#0B0B0C] flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    Fail Open First
                  </div>
                  <div className="text-[10px] text-[#6E6E73] mt-0.5">&lt; 2ms Budget</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FBFBF9] border border-[#D4AF37]/20">
                  <div className="font-bold text-[#0B0B0C] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-600" />
                    Deterministic AST
                  </div>
                  <div className="text-[10px] text-[#6E6E73] mt-0.5">0% Hallucination</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FBFBF9] border border-[#D4AF37]/20">
                  <div className="font-bold text-[#0B0B0C] flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                    Zero Body Storage
                  </div>
                  <div className="text-[10px] text-[#6E6E73] mt-0.5">PII Destroyed</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FBFBF9] border border-[#D4AF37]/20">
                  <div className="font-bold text-[#0B0B0C] flex items-center gap-1.5">
                    <GitPullRequest className="w-3.5 h-3.5 text-purple-600" />
                    Human Review Gate
                  </div>
                  <div className="text-[10px] text-[#6E6E73] mt-0.5">Never Auto-Merged</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FBFBF9] border border-[#D4AF37]/20">
                  <div className="font-bold text-[#0B0B0C] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    SHA-256 Ledger
                  </div>
                  <div className="text-[10px] text-[#6E6E73] mt-0.5">Tamper-Evident Chain</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Canvas */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[480px]">
              <ImmuneHelix3D />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-[#D4AF37]/40 shadow-xl flex items-center gap-3">
                <Activity className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-[#0B0B0C]">FAIL-OPEN CIRCUIT BREAKER ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
