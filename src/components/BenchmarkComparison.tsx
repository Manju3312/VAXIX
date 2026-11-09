'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface BenchmarkRow {
  dimension: string;
  corrigio: boolean | 'partial';
  mendr: boolean | 'partial';
  apisynq: boolean | 'partial';
  vaxix: boolean | 'partial';
}

export default function BenchmarkComparison() {
  const rows: BenchmarkRow[] = [
    { dimension: 'The Two Honest Paths (Path A <2ms Pre-Flight vs Path B Async PR)', corrigio: false, mendr: false, apisynq: false, vaxix: true },
    { dimension: 'Fail-Open Circuit Breaker (<2ms budget, 15ms hard deadline)', corrigio: false, mendr: false, apisynq: false, vaxix: true },
    { dimension: 'Zero Customer Body Retention (Client-Side Value Destruction)', corrigio: false, mendr: false, apisynq: false, vaxix: true },
    { dimension: 'Allowlisted 5-AST Deterministic Surgery (0% Hallucinations)', corrigio: 'partial', mendr: false, apisynq: 'partial', vaxix: true },
    { dimension: 'Sensitive Financial Route Guard (/charges locked to PR lane)', corrigio: false, mendr: false, apisynq: false, vaxix: true },
    { dimension: 'Mandatory Human Approval Gate (Zero Auto-Merge Policy)', corrigio: 'partial', mendr: true, apisynq: false, vaxix: true },
    { dimension: 'Tamper-Evident SHA-256 Recursive Hash Chain (SOC-2 Proof)', corrigio: false, mendr: false, apisynq: false, vaxix: true },
  ];

  return (
    <section id="benchmark" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase">Uncompromising Superiority</span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0B0B0C] mt-2 font-display">Architectural Benchmark</h2>
          <p className="mt-4 text-[#6E6E73] text-lg">
            Why PR-only tools and container-reboot scripts leave the global economy unprotected.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-[#D4AF37]/30 shadow-xl bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FBFBF9] border-b border-[#D4AF37]/20 text-xs font-mono uppercase tracking-wider text-[#6E6E73]">
                <th className="py-5 px-6">Architectural Capability</th>
                <th className="py-5 px-6 text-center">Corrigio.tech</th>
                <th className="py-5 px-6 text-center">Mendr (K8s)</th>
                <th className="py-5 px-6 text-center">APISynQ</th>
                <th className="py-5 px-6 text-center bg-[#D4AF37]/10 text-[#0B0B0C] font-black border-x border-[#D4AF37]/30">
                  🛡️ VAXIX
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-sm font-medium">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-[#FBFBF9]/60 transition-colors">
                  <td className="py-4.5 px-6 text-[#0B0B0C] font-semibold">{r.dimension}</td>
                  
                  {/* Corrigio */}
                  <td className="py-4.5 px-6 text-center">
                    {r.corrigio === true ? (
                      <Check className="w-4 h-4 text-[#10B981] mx-auto" />
                    ) : r.corrigio === 'partial' ? (
                      <span className="text-xs text-[#F59E0B] font-mono font-bold">Partial</span>
                    ) : (
                      <X className="w-4 h-4 text-[#6E6E73]/40 mx-auto" />
                    )}
                  </td>

                  {/* Mendr */}
                  <td className="py-4.5 px-6 text-center">
                    {r.mendr === true ? (
                      <Check className="w-4 h-4 text-[#10B981] mx-auto" />
                    ) : r.mendr === 'partial' ? (
                      <span className="text-xs text-[#F59E0B] font-mono font-bold">Partial</span>
                    ) : (
                      <X className="w-4 h-4 text-[#6E6E73]/40 mx-auto" />
                    )}
                  </td>

                  {/* APISynQ */}
                  <td className="py-4.5 px-6 text-center">
                    {r.apisynq === true ? (
                      <Check className="w-4 h-4 text-[#10B981] mx-auto" />
                    ) : r.apisynq === 'partial' ? (
                      <span className="text-xs text-[#F59E0B] font-mono font-bold">Partial</span>
                    ) : (
                      <X className="w-4 h-4 text-[#6E6E73]/40 mx-auto" />
                    )}
                  </td>

                  {/* VAXIX */}
                  <td className="py-4.5 px-6 text-center bg-[#D4AF37]/5 font-bold text-[#0B0B0C] border-x border-[#D4AF37]/20">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#997D25] border border-[#D4AF37]/30 text-xs font-mono font-bold">
                      <Check className="w-3.5 h-3.5 text-[#997D25]" />
                      <span>Sovereign</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
