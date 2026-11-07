'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity } from 'lucide-react';
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
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#997D25] uppercase">
                The Global Software Immune Mesh
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0B0B0C] font-display leading-[1.08]">
              APIs Break at 3 AM. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#997D25] to-[#0B0B0C]">
                Your App Never Dies.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[#6E6E73] max-w-2xl leading-relaxed font-sans">
              IMMUNIX transforms fragile microservices into self-healing biological organisms. 
              Sub-millisecond wire antibody interception prevents outages in-flight, while AST codemods patch production code with zero hallucinations.
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
                href="#benchmark"
                className="px-8 py-4 rounded-xl bg-white text-[#0B0B0C] border border-[#D4AF37]/40 font-bold text-sm tracking-wider uppercase hover:border-[#D4AF37] hover:bg-[#FBFBF9] transition-all"
              >
                Inspect Benchmark
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

            {/* Trust Strip */}
            <div className="mt-14 pt-8 border-t border-[#D4AF37]/20 w-full grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#0B0B0C] font-mono">&lt; 0.8ms</div>
                <div className="text-xs text-[#6E6E73] font-medium mt-0.5">Wire In-Flight Rescue</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#997D25] font-mono">0.0%</div>
                <div className="text-xs text-[#6E6E73] font-medium mt-0.5">LLM Hallucinations (AST)</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#0B0B0C] font-mono">100%</div>
                <div className="text-xs text-[#6E6E73] font-medium mt-0.5">Zero-Downtime Guarantee</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Canvas */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[480px]">
              <ImmuneHelix3D />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-[#D4AF37]/40 shadow-xl flex items-center gap-3">
                <Activity className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-[#0B0B0C]">LIVE BIOMIMETIC MESH ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
