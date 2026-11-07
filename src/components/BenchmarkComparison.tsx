'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface BenchmarkRow {
  dimension: string;
  corrigio: boolean | 'partial';
  mendr: boolean | 'partial';
  apisynq: boolean | 'partial';
  immunix: boolean | 'partial';
}

export default function BenchmarkComparison() {
  const rows: BenchmarkRow[] = [
    { dimension: 'Speed 1 In-Flight Wire Hot-Patch (<1ms)', corrigio: false, mendr: false, apisynq: false, immunix: true },
    { dimension: 'Zero-Downtime at 3:00 AM (Averts Outage)', corrigio: false, mendr: false, apisynq: false, immunix: true },
    { dimension: 'Speed 2 AST Codemod (Deterministic Code Repair)', corrigio: true, mendr: false, apisynq: true, immunix: true },
    { dimension: 'Zero LLM Hallucinations (ts-morph / AST Compiler)', corrigio: 'partial', mendr: false, apisynq: 'partial', immunix: true },
    { dimension: 'Unmocked Live Ephemeral Sandbox Probing', corrigio: false, mendr: false, apisynq: false, immunix: true },
    { dimension: 'Global Herd Immunity Mesh (Instant Cross-Node Defense)', corrigio: false, mendr: false, apisynq: false, immunix: true },
    { dimension: 'Parametric Outage Financial Loss SLA Guarantee', corrigio: false, mendr: false, apisynq: false, immunix: true },
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
                  🛡️ IMMUNIX
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

                  {/* IMMUNIX */}
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
