'use client';

import React from 'react';
import { ShieldCheck, Lock, Award, KeyRound, Cpu } from 'lucide-react';

interface ComplianceProps {
  onOpenAudit: () => void;
}

export default function SovereignCompliance({ onOpenAudit }: ComplianceProps) {
  const assurances = [
    {
      icon: Lock,
      title: 'Zero-Payload Retention Policy',
      description:
        'IMMUNIX operates purely in socket memory. Outbound payloads are inspected in-kernel and forwarded without ever writing to disks, log aggregation services, or external relays.',
      stat: '0 Bytes Stored',
    },
    {
      icon: Cpu,
      title: 'Kernel-Safe eBPF Verifier',
      description:
        'All socket filters run as sandboxed eBPF bytecode verified by the Linux kernel runtime. Bounded loops, pointer sanitization, and strict instruction limits eliminate crash risks.',
      stat: '0 Kernel Panics',
    },
    {
      icon: Award,
      title: '$5,000,000 Financial Warranty',
      description:
        'Enterprise Grid and Sovereign Mesh customers receive underwritten financial indemnification against revenue losses caused by unhandled upstream contract mutations.',
      stat: '$5.0M Guarantee',
    },
    {
      icon: KeyRound,
      title: 'Ed25519 Sovereign Root Key',
      description:
        'Every vaccine broadcasted across the 14,280-node global mesh requires cryptographic consensus signatures. Rogue or adversarial rules are rejected at the protocol layer.',
      stat: 'Consensus Proof',
    },
  ];

  return (
    <section id="sovereign-compliance" className="py-24 bg-[#FBFBF9] border-t border-[#D4AF37]/25 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Sovereign Trust & Governance
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-[#0B0B0C] tracking-tight">
            Defense-Grade Compliance
          </h2>
          <p className="mt-4 text-[#6E6E73] text-base sm:text-lg leading-relaxed">
            Engineered for central banks, Fortune 500 fintechs, and critical cloud infrastructure providers. 
            Zero data compromises, deterministic verification, and sovereign privacy.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assurances.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-sm hover:shadow-[0_10px_30px_rgba(212,175,55,0.12)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#997D25] mb-5">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  <h3 className="font-heading font-black text-lg text-[#0B0B0C] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#6E6E73] leading-relaxed mb-6">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#6E6E73]">Verification:</span>
                  <span className="text-[#997D25] font-bold">{item.stat}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compliance Badges Bar */}
        <div className="mt-14 p-6 rounded-3xl bg-white border border-[#D4AF37]/30 shadow-sm flex flex-wrap items-center justify-around gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="font-heading font-black text-sm text-[#0B0B0C]">SOC 2 TYPE II</span>
            <span className="text-[10px] font-mono text-[#10B981] font-bold">ANNUALLY AUDITED</span>
          </div>

          <div className="h-6 w-[1px] bg-[#D4AF37]/20 hidden sm:block" />

          <div className="flex flex-col items-center">
            <span className="font-heading font-black text-sm text-[#0B0B0C]">ISO/IEC 27001</span>
            <span className="text-[10px] font-mono text-[#10B981] font-bold">CERTIFIED DEFENSE</span>
          </div>

          <div className="h-6 w-[1px] bg-[#D4AF37]/20 hidden sm:block" />

          <div className="flex flex-col items-center">
            <span className="font-heading font-black text-sm text-[#0B0B0C]">HIPAA READY</span>
            <span className="text-[10px] font-mono text-[#10B981] font-bold">ZERO-PII RETENTION</span>
          </div>

          <div className="h-6 w-[1px] bg-[#D4AF37]/20 hidden sm:block" />

          <div className="flex flex-col items-center">
            <span className="font-heading font-black text-sm text-[#0B0B0C]">FedRAMP HIGH</span>
            <span className="text-[10px] font-mono text-[#10B981] font-bold">AIR-GAP CAPABLE</span>
          </div>

          <div className="h-6 w-[1px] bg-[#D4AF37]/20 hidden lg:block" />

          <div>
            <button
              suppressHydrationWarning
              onClick={onOpenAudit}
              className="px-5 py-2.5 rounded-xl bg-[#0B0B0C] hover:bg-[#1C1C1F] text-white font-mono text-xs font-bold border border-[#D4AF37] transition-colors cursor-pointer"
            >
              Request Compliance Dossier
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

