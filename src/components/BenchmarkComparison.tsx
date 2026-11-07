'use client';

import React, { useState } from 'react';
import { Check, X, Minus, ShieldCheck, HelpCircle } from 'lucide-react';

interface BenchmarkRow {
  capability: string;
  category: string;
  description: string;
  corrigio: boolean | 'partial';
  mendr: boolean | 'partial';
  apisynq: boolean | 'partial';
  immunix: boolean;
  whyItMatters: string;
}

const rows: BenchmarkRow[] = [
  {
    capability: 'In-Flight Zero Downtime Proxy (< 1ms)',
    category: 'Speed 1 Inception',
    description: 'Intercepts socket-level schema drift via eBPF/WASM before payload hits application logic.',
    corrigio: false,
    mendr: false,
    apisynq: false,
    immunix: true,
    whyItMatters: 'Competitors require waiting hours for developers to manually push code. IMMUNIX shields users instantly in 0.38ms.',
  },
  {
    capability: 'Global Herd Immunity (Cross-Company Sync)',
    category: 'Mesh Architecture',
    description: 'When one cluster encounters an upstream mutation, all 14,280 clusters are inoculated pre-emptively.',
    corrigio: false,
    mendr: false,
    apisynq: false,
    immunix: true,
    whyItMatters: 'Isolating errors inside single silos forces every company to suffer the same crash independently.',
  },
  {
    capability: 'Unmocked Live Ephemeral Sandbox Validation',
    category: 'Verification Rigor',
    description: 'Proves patch correctness against live staging target in temporary microVM before filing PR.',
    corrigio: false,
    mendr: false,
    apisynq: false,
    immunix: true,
    whyItMatters: 'Mock-based linters give false positives on subtle HTTP headers and edge-case serialization quirks.',
  },
  {
    capability: 'Undocumented Runtime Serialization Drift Catch',
    category: 'Detection',
    description: 'Catches silent numerical-to-string mutations, missing properties, and envelope restructurings.',
    corrigio: false,
    mendr: 'partial',
    apisynq: false,
    immunix: true,
    whyItMatters: 'Vendors rarely bump version numbers for small serialization changes, catching traditional OpenAPI tools off-guard.',
  },
  {
    capability: 'Deterministic AST Codebase Refactoring',
    category: 'Speed 2 Repair',
    description: 'Mathematical TypeScript/Babel compiler AST tree-rewrite with zero stochastic hallucinations.',
    corrigio: true,
    mendr: false,
    apisynq: 'partial',
    immunix: true,
    whyItMatters: 'Pure LLM code generators invent non-existent methods and introduce security regressions.',
  },
  {
    capability: 'Model Context Protocol (MCP) Agent Tools',
    category: 'AI Interoperability',
    description: 'Full native JSON-RPC server with whats_changed, inoculate_cluster, and probe_sandbox primitives.',
    corrigio: false,
    mendr: false,
    apisynq: true,
    immunix: true,
    whyItMatters: 'Allows AI coding agents (Claude, Cursor, Antigravity) to query active antibodies and debug live clusters.',
  },
  {
    capability: 'Zero-Downtime Financial Loss SLA Warranty',
    category: 'Enterprise Assurance',
    description: '$5,000,000 underwritten financial indemnity for any outage caused by unhandled upstream schema drift.',
    corrigio: false,
    mendr: false,
    apisynq: false,
    immunix: true,
    whyItMatters: 'Pure software monitoring tools offer no financial skin in the game when your payment checkout drops.',
  },
];

export default function BenchmarkComparison() {
  const [activeRow, setActiveRow] = useState<BenchmarkRow | null>(null);

  return (
    <section id="architectural-benchmark" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Architectural Superiority
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-[#0B0B0C] tracking-tight">
            The Definitive Architectural Benchmark
          </h2>
          <p className="mt-4 text-[#6E6E73] text-base sm:text-lg leading-relaxed">
            Why traditional API linters, schema diff tools, and legacy monitoring suites fail to prevent outages:
            they notify you of the disaster instead of biological self-healing.
          </p>
        </div>

        {/* The Benchmark Matrix Table */}
        <div className="overflow-x-auto rounded-3xl border border-[#D4AF37]/30 shadow-[0_15px_45px_rgba(212,175,55,0.1)] bg-white">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#FBFBF9] border-b border-[#D4AF37]/25 text-[#0B0B0C] font-mono text-xs uppercase">
                <th className="p-5 sm:p-6">Capability & Defense Dimension</th>
                <th className="p-5 sm:p-6 text-center text-[#6E6E73] font-medium">Corrigio</th>
                <th className="p-5 sm:p-6 text-center text-[#6E6E73] font-medium">Mendr</th>
                <th className="p-5 sm:p-6 text-center text-[#6E6E73] font-medium">APISynQ</th>
                <th className="p-5 sm:p-6 text-center bg-[#D4AF37]/10 text-[#0B0B0C] font-black border-x border-[#D4AF37]/40">
                  <div className="flex items-center justify-center gap-1.5 text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    IMMUNIX
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {rows.map((r, idx) => (
                <tr
                  key={idx}
                  onClick={() => setActiveRow(activeRow?.capability === r.capability ? null : r)}
                  className={`hover:bg-[#FBFBF9]/80 transition-colors cursor-pointer ${
                    activeRow?.capability === r.capability ? 'bg-[#D4AF37]/5' : ''
                  }`}
                >
                  <td className="p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0B0B0C] text-sm">{r.capability}</span>
                      <HelpCircle className="w-4 h-4 text-[#997D25]/60 hover:text-[#997D25] shrink-0" />
                    </div>
                    <p className="text-xs text-[#6E6E73] mt-1 line-clamp-1">{r.description}</p>
                  </td>

                  {/* Corrigio */}
                  <td className="p-5 sm:p-6 text-center">
                    {r.corrigio === true ? (
                      <Check className="w-5 h-5 text-emerald-600 mx-auto stroke-[2.5]" />
                    ) : r.corrigio === 'partial' ? (
                      <Minus className="w-5 h-5 text-amber-500 mx-auto stroke-[2.5]" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto stroke-[2]" />
                    )}
                  </td>

                  {/* Mendr */}
                  <td className="p-5 sm:p-6 text-center">
                    {r.mendr === true ? (
                      <Check className="w-5 h-5 text-emerald-600 mx-auto stroke-[2.5]" />
                    ) : r.mendr === 'partial' ? (
                      <Minus className="w-5 h-5 text-amber-500 mx-auto stroke-[2.5]" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto stroke-[2]" />
                    )}
                  </td>

                  {/* APISynQ */}
                  <td className="p-5 sm:p-6 text-center">
                    {r.apisynq === true ? (
                      <Check className="w-5 h-5 text-emerald-600 mx-auto stroke-[2.5]" />
                    ) : r.apisynq === 'partial' ? (
                      <Minus className="w-5 h-5 text-amber-500 mx-auto stroke-[2.5]" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto stroke-[2]" />
                    )}
                  </td>

                  {/* IMMUNIX (Victor) */}
                  <td className="p-5 sm:p-6 text-center bg-[#D4AF37]/5 border-x border-[#D4AF37]/40 font-bold">
                    <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto">
                      <Check className="w-4 h-4 text-[#997D25] stroke-[3]" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dynamic Detail Card when row is clicked */}
        {activeRow && (
          <div className="mt-6 p-6 rounded-2xl bg-[#FBFBF9] border border-[#D4AF37]/40 shadow-md animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#997D25] uppercase font-bold">
                  {activeRow.category}
                </span>
                <h4 className="text-lg font-bold font-heading text-[#0B0B0C] mt-1.5">
                  {activeRow.capability}
                </h4>
                <p className="text-sm text-[#6E6E73] mt-1">{activeRow.whyItMatters}</p>
              </div>

              <button
                onClick={() => setActiveRow(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-[#997D25] hover:bg-[#D4AF37]/10"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

